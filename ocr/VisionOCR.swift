// Native macOS Vision OCR helper for HardSub.
// Outputs normalized (bottom-left origin) text observations as JSON on stdout.
//
// Usage:
//   vision-ocr languages
//   vision-ocr recognize <image> [langs,csv] [fast|accurate] [minTextHeight]
//   vision-ocr serve        (JSON-lines worker; avoids process startup per frame)
//
// This binary is intentionally dependency-free; it uses Apple's built-in OCR.

import Foundation
import CoreGraphics
import ImageIO
import Vision

struct Line: Codable {
    let text: String
    let confidence: Float
    let x: Double
    let y: Double
    let w: Double
    let h: Double
}

struct Output: Codable {
    let width: Int
    let height: Int
    let lines: [Line]
}

struct Rect: Codable {
    let x: Double
    let y: Double
    let w: Double
    let h: Double
}

struct ServeRequest: Codable {
    let id: String
    let image: String
    let languages: [String]?
    let level: String?
    let minHeight: Float?
    let mode: String?
}

struct ServeResponse: Codable {
    let id: String
    let width: Int?
    let height: Int?
    let lines: [Line]?
    let rects: [Rect]?
    let error: String?
}

func fail(_ message: String, code: Int32 = 2) -> Never {
    FileHandle.standardError.write((message + "\n").data(using: .utf8)!)
    exit(code)
}

func loadImage(_ path: String) -> CGImage {
    let url = URL(fileURLWithPath: path)
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        fail("cannot read image: \(path)")
    }
    return image
}

func recognize(imagePath: String, languages: [String], levelArg: String, minHeight: Float) throws -> Output {
    let image = loadImage(imagePath)
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = levelArg == "fast" ? .fast : .accurate
    request.usesLanguageCorrection = true
    request.recognitionLanguages = languages
    request.minimumTextHeight = minHeight

    // Traditional and simplified Chinese share many glyphs. Asking Vision for both
    // lets it choose per line instead of forcing one script on the whole frame.
    if #available(macOS 13.0, *) {
        request.revision = VNRecognizeTextRequestRevision3
    }

    let handler = VNImageRequestHandler(cgImage: image, options: [:])
    try handler.perform([request])

    var lines: [Line] = []
    if let observations = request.results {
        for observation in observations {
            guard let candidate = observation.topCandidates(1).first else { continue }
            let box = observation.boundingBox
            lines.append(Line(
                text: candidate.string,
                confidence: candidate.confidence,
                x: Double(box.origin.x),
                y: Double(box.origin.y),
                w: Double(box.size.width),
                h: Double(box.size.height)
            ))
        }
    }
    return Output(width: image.width, height: image.height, lines: lines)
}

func detectTextRects(imagePath: String) throws -> (Int, Int, [Rect]) {
    let image = loadImage(imagePath)
    let request = VNDetectTextRectanglesRequest()
    request.reportCharacterBoxes = false
    let handler = VNImageRequestHandler(cgImage: image, options: [:])
    try handler.perform([request])
    var rects: [Rect] = []
    if let observations = request.results {
        for observation in observations {
            let box = observation.boundingBox
            rects.append(Rect(
                x: Double(box.origin.x), y: Double(box.origin.y),
                w: Double(box.size.width), h: Double(box.size.height)
            ))
        }
    }
    return (image.width, image.height, rects)
}

let args = CommandLine.arguments

if args.count >= 2 && args[1] == "serve" {
    // Long-lived worker. One request/response per line keeps Vision loaded, which
    // matters when a feature film needs thousands of OCR calls.
    let decoder = JSONDecoder()
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.withoutEscapingSlashes]
    while let line = readLine(strippingNewline: true) {
        if line.trimmingCharacters(in: .whitespaces).isEmpty { continue }
        guard let data = line.data(using: .utf8) else { continue }
        do {
            let req = try decoder.decode(ServeRequest.self, from: data)
            do {
                if req.mode == "detect" {
                    let result = try autoreleasepool { try detectTextRects(imagePath: req.image) }
                    let response = ServeResponse(
                        id: req.id, width: result.0, height: result.1,
                        lines: nil, rects: result.2, error: nil
                    )
                    let out = try encoder.encode(response)
                    FileHandle.standardOutput.write(out)
                    FileHandle.standardOutput.write("\n".data(using: .utf8)!)
                } else {
                    let result = try autoreleasepool {
                        try recognize(
                            imagePath: req.image,
                            languages: req.languages ?? ["zh-Hans", "zh-Hant", "en-US"],
                            levelArg: req.level ?? "accurate",
                            minHeight: req.minHeight ?? 0.006
                        )
                    }
                    let response = ServeResponse(
                        id: req.id, width: result.width, height: result.height,
                        lines: result.lines, rects: nil, error: nil
                    )
                    let out = try encoder.encode(response)
                    FileHandle.standardOutput.write(out)
                    FileHandle.standardOutput.write("\n".data(using: .utf8)!)
                }
            } catch {
                let response = ServeResponse(id: req.id, width: nil, height: nil, lines: nil, rects: nil, error: "\(error)")
                let out = try encoder.encode(response)
                FileHandle.standardOutput.write(out)
                FileHandle.standardOutput.write("\n".data(using: .utf8)!)
            }
        } catch {
            FileHandle.standardError.write(("bad request: \(error)\n").data(using: .utf8)!)
        }
    }
    exit(0)
}

if args.count >= 2 && args[1] == "languages" {
    do {
        let langs = try VNRecognizeTextRequest.supportedRecognitionLanguages(
            for: .accurate,
            revision: VNRecognizeTextRequestRevision3
        )
        print(langs.joined(separator: "\n"))
    } catch {
        fail("cannot query supported languages: \(error)")
    }
    exit(0)
}

if args.count >= 3 && args[1] == "detect" {
    do {
        let (width, height, rects) = try detectTextRects(imagePath: args[2])
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.withoutEscapingSlashes]
        let out = ServeResponse(id: "cli", width: width, height: height, lines: nil, rects: rects, error: nil)
        FileHandle.standardOutput.write(try encoder.encode(out))
    } catch {
        fail("detect failed: \(error)")
    }
    exit(0)
}

if args.count < 3 || args[1] != "recognize" {
    fail("usage: vision-ocr recognize <image> [langs,csv] [fast|accurate] [minTextHeight]")
}

let imagePath = args[2]
let languageArg = args.count >= 4 ? args[3] : "zh-Hans,zh-Hant,en-US"
let levelArg = args.count >= 5 ? args[4] : "accurate"
let minHeight = args.count >= 6 ? (Float(args[5]) ?? 0.006) : 0.006
let languages = languageArg
    .split(separator: ",")
    .map { $0.trimmingCharacters(in: .whitespaces) }
    .filter { !$0.isEmpty }

do {
    let output = try recognize(
        imagePath: imagePath,
        languages: languages,
        levelArg: levelArg,
        minHeight: minHeight
    )
    let encoder = JSONEncoder()
    encoder.outputFormatting = [.withoutEscapingSlashes]
    let data = try encoder.encode(output)
    FileHandle.standardOutput.write(data)
} catch {
    fail("cannot encode result: \(error)")
}
