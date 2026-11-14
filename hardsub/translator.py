from __future__ import annotations

import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

from .text import convert_text

TAG_RE = re.compile(r"\{[^}]*\}|<[^>]+>")
SRT_TIME_RE = re.compile(
    r"^\s*(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})\s*-->\s*"
    r"(\d{1,2}:\d{2}:\d{2}[,.]\d{1,3})(.*)$"
)
ASS_TIME_RE = re.compile(r"^\s*(\d+:\d{2}:\d{2}[.:]\d{1,3})\s*$")
MEANINGFUL_RE = re.compile(r"[0-9A-Za-z\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]")


class TranslationError(RuntimeError):
    pass


@dataclass
class Entry:
    index: int | None
    timing: str
    text: str
    prefix: str = ""
    suffix: str = ""
    line_index: int | None = None
    label: str = ""


@dataclass
class SubtitleDocument:
    kind: str
    entries: list[Entry]
    header_lines: list[str] = field(default_factory=list)
    newline: str = "\n"
    had_bom: bool = False


@dataclass
class Unit:
    prefix: str
    visible: str
    suffix: str


def decode_subtitle(data: bytes) -> str:
    for encoding in ("utf-8-sig", "utf-8", "cp932", "shift_jis", "gb18030"):
        try:
            return data.decode(encoding)
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="replace")


def parse_subtitle(data: bytes, filename: str = "") -> SubtitleDocument:
    text = decode_subtitle(data)
    had_bom = data.startswith(b"\xef\xbb\xbf")
    suffix = Path(filename or "").suffix.lower()
    if suffix in (".ass", ".ssa") or "[events]" in text.lower():
        return parse_ass(text, had_bom)
    if suffix == ".srt" or "-->" in text:
        return parse_srt(text, had_bom)
    raise TranslationError("只支持 SRT、ASS 或 SSA 字幕文件")


def parse_srt(text: str, had_bom: bool = False) -> SubtitleDocument:
    text = text.replace("\r\n", "\n").replace("\r", "\n").lstrip("\ufeff")
    blocks = re.split(r"\n[ \t]*\n", text.strip("\n"))
    entries: list[Entry] = []
    for block in blocks:
        lines = block.split("\n")
        timing_index = next((i for i, line in enumerate(lines) if "-->" in line), None)
        if timing_index is None:
            continue
        timing = lines[timing_index].strip()
        match = SRT_TIME_RE.match(timing)
        if not match:
            continue
        index = None
        if timing_index > 0:
            candidate = lines[timing_index - 1].strip()
            if candidate.isdigit():
                index = int(candidate)
        body = "\n".join(lines[timing_index + 1:]).strip("\n")
        entries.append(Entry(
            index=index,
            timing=timing,
            text=body,
            label=match.group(1),
        ))
    if not entries:
        raise TranslationError("SRT 中没有找到有效字幕条目")
    return SubtitleDocument(kind="srt", entries=entries, had_bom=had_bom)


def parse_ass(text: str, had_bom: bool = False) -> SubtitleDocument:
    text = text.replace("\r\n", "\n").replace("\r", "\n").lstrip("\ufeff")
    lines = text.split("\n")
    fmt: list[str] | None = None
    text_index = -1
    in_events = False
    entries: list[Entry] = []
    for line_index, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith("[") and stripped.endswith("]"):
            in_events = stripped.lower() == "[events]"
            continue
        if not in_events:
            continue
        if stripped.lower().startswith("format:"):
            fmt = [part.strip() for part in stripped.split(":", 1)[1].split(",")]
            text_index = next((i for i, name in enumerate(fmt) if name.lower() == "text"), -1)
            continue
        if not stripped.lower().startswith("dialogue:") or not fmt or text_index < 0:
            continue
        payload = line.split(":", 1)[1]
        parts = payload.split(",", len(fmt) - 1)
        if len(parts) <= text_index:
            continue
        body = parts[text_index]
        start = parts[1].strip() if len(parts) > 1 else ""
        entries.append(Entry(
            index=None,
            timing="",
            text=body,
            prefix=",".join(parts[:text_index]),
            suffix=",".join(parts[text_index + 1:]),
            line_index=line_index,
            label=start,
        ))
    if not entries:
        raise TranslationError("ASS/SSA 中没有找到 Dialogue 字幕条目")
    return SubtitleDocument(kind="ass", entries=entries, header_lines=lines, had_bom=had_bom)


def _split_lines(text: str, kind: str) -> list[str]:
    if kind == "ass":
        text = text.replace(r"\N", "\n").replace(r"\n", "\n")
    return text.split("\n")


def _units_for(text: str, kind: str) -> list[Unit]:
    units: list[Unit] = []
    for line in _split_lines(text, kind):
        prefix_match = re.match(r"^(\s*(?:\{[^}]*\}|<[^>]+>)+)", line)
        prefix = prefix_match.group(1) if prefix_match else ""
        rest = line[len(prefix):]
        suffix_match = re.search(r"((?:\{[^}]*\}|<[^>]+>)+)\s*$", rest)
        suffix = suffix_match.group(1) if suffix_match else ""
        visible = TAG_RE.sub("", rest).strip()
        units.append(Unit(prefix=prefix, visible=visible, suffix=suffix))
    return units


def _join_text(lines: list[str], kind: str) -> str:
    joined = "\n".join(lines)
    return joined.replace("\n", r"\N") if kind == "ass" else joined


def _google_translate(text: str, source: str, target: str) -> str:
    query = urllib.parse.urlencode({
        "client": "gtx",
        "sl": source,
        "tl": target,
        "dt": "t",
        "q": text,
    })
    url = "https://translate.googleapis.com/translate_a/single?" + query
    request = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 HardSubStudio/1.9",
        "Accept": "application/json",
    })
    last_error: Exception | None = None
    for attempt in range(4):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                payload = json.loads(response.read().decode("utf-8"))
            parts = payload[0] if payload else []
            translated = "".join(part[0] for part in parts if part and part[0])
            if translated:
                return translated
            raise TranslationError("翻译服务返回空结果")
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, TranslationError) as exc:
            last_error = exc
            time.sleep(1.2 * (attempt + 1))
    raise TranslationError(f"联网翻译失败：{last_error}")


def translate_texts(
    texts: list[str],
    source: str,
    target: str,
    progress=None,
) -> list[str]:
    unique = list(dict.fromkeys(text for text in texts if text.strip()))
    total = max(1, len(unique))
    translated: dict[str, str] = {}
    batches: list[list[str]] = []
    batch: list[str] = []
    size = 0
    for text in unique:
        if batch and (len(batch) >= 20 or size + len(text) > 1400):
            batches.append(batch)
            batch, size = [], 0
        batch.append(text)
        size += len(text) + 1
    if batch:
        batches.append(batch)

    target_code = "zh-TW" if target == "zh-Hant" else "zh-CN"
    script = "traditional_tw" if target == "zh-Hant" else "simplified"
    completed = 0
    for batch in batches:
        translated_batch: list[str] | None = None
        if len(batch) > 1:
            joined = "\n".join(batch)
            try:
                result = _google_translate(joined, source, target_code)
                candidate = result.split("\n")
                if len(candidate) == len(batch):
                    translated_batch = candidate
            except TranslationError:
                translated_batch = None
        if translated_batch is None:
            translated_batch = [
                _google_translate(text, source, target_code) for text in batch
            ]
        for original, value in zip(batch, translated_batch):
            translated[original] = convert_text(value.strip(), script)
        completed += len(batch)
        if progress:
            progress(completed, total)
        time.sleep(0.08)
    return [translated.get(text, text) for text in texts]


def translate_document(
    document: SubtitleDocument,
    source: str,
    target: str,
    bilingual: bool = False,
    progress=None,
) -> list[Entry]:
    all_units: list[list[Unit]] = []
    texts: list[str] = []
    for entry in document.entries:
        units = _units_for(entry.text, document.kind)
        all_units.append(units)
        texts.extend(unit.visible for unit in units if unit.visible)
    translated_texts = iter(translate_texts(texts, source, target, progress=progress))
    translated_entries: list[Entry] = []
    for entry, units in zip(document.entries, all_units):
        lines = []
        for unit in units:
            if unit.visible:
                value = next(translated_texts)
            else:
                value = ""
            lines.append(unit.prefix + value + unit.suffix)
        translated_text = _join_text(lines, document.kind)
        if bilingual:
            separator = r"\N" if document.kind == "ass" else "\n"
            translated_text = entry.text + separator + translated_text
        translated_entries.append(Entry(
            index=entry.index,
            timing=entry.timing,
            text=translated_text,
            prefix=entry.prefix,
            suffix=entry.suffix,
            line_index=entry.line_index,
            label=entry.label,
        ))
    return translated_entries


def render_subtitle(document: SubtitleDocument, entries: list[Entry]) -> str:
    if document.kind == "srt":
        blocks = []
        for number, entry in enumerate(entries, 1):
            blocks.append(f"{entry.index or number}\n{entry.timing}\n{entry.text}")
        return "\n\n".join(blocks) + "\n"
    lines = list(document.header_lines)
    for entry in entries:
        if entry.line_index is None:
            continue
        line = lines[entry.line_index]
        head = line.split(":", 1)[0]
        lines[entry.line_index] = (
            f"{head}:{entry.prefix},{entry.text}"
            + (f",{entry.suffix}" if entry.suffix else "")
        )
    return "\n".join(lines)


def translate_subtitle_file(
    input_path: str | Path,
    output_path: str | Path,
    source: str,
    target: str,
    bilingual: bool = False,
    progress=None,
) -> dict:
    path = Path(input_path)
    document = parse_subtitle(path.read_bytes(), path.name)
    translated = translate_document(document, source, target, bilingual, progress)
    rendered = render_subtitle(document, translated)
    output = Path(output_path)
    output.write_text(rendered, encoding="utf-8-sig" if document.kind == "srt" else "utf-8")
    preview = []
    for index, entry in enumerate(translated[:8]):
        preview.append({
            "time": entry.label,
            "source": document.entries[index].text.replace("\n", " / ").replace(r"\N", " / "),
            "target": entry.text.replace("\n", " / ").replace(r"\N", " / "),
        })
    return {
        "kind": document.kind,
        "entries": len(translated),
        "preview": preview,
    }
