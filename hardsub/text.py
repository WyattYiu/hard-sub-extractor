from __future__ import annotations

import re
import unicodedata
from difflib import SequenceMatcher
from functools import lru_cache

CJK_RANGE = r"\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"
CJK_RE = re.compile(f"[{CJK_RANGE}]")
KANA_RANGE = r"\u3040-\u309f\u30a0-\u30ff\u31f0-\u31ff\uff66-\uff9f"
KANA_RE = re.compile(f"[{KANA_RANGE}]")
HANGUL_RANGE = r"\u1100-\u11ff\u3130-\u318f\uac00-\ud7af"
HANGUL_RE = re.compile(f"[{HANGUL_RANGE}]")
LATIN_RE = re.compile(r"[A-Za-z]")
LANGUAGE_NAMES = {"zh": "中文", "en": "英文", "ja": "日语", "ko": "韩语"}
CJK_PUNCT = "，。！？；：、…—～·「」『』《》〈〉（）【】〔〕“”‘’・"
CJK_PUNCT_RE = re.compile(f"[{re.escape(CJK_PUNCT)}]")
CJK_OR_KANA_RE = re.compile(f"[{CJK_RANGE}{KANA_RANGE}]")
MEANINGFUL_RE = re.compile(f"[{CJK_RANGE}{KANA_RANGE}{HANGUL_RANGE}A-Za-z0-9]")
SPACE_BETWEEN_CJK_RE = re.compile(f"(?<=[{CJK_RANGE}{KANA_RANGE}])\\s+(?=[{CJK_RANGE}{KANA_RANGE}])")
SPACE_BEFORE_PUNCT_RE = re.compile(f"\\s+(?=[{re.escape(CJK_PUNCT)}])")
SPACE_AFTER_OPEN_RE = re.compile("(?<=[「『《【“‘（])\\s+")
CONTROL_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
PUNCT_ONLY_RE = re.compile(f"^[{re.escape(CJK_PUNCT)}\\-—_~.·…]+$")
REPEATED_CHAR_RE = re.compile(r"(.)\1{7,}")
PAIR_MAP = {
    "(": ")", "（": "）", "[": "]", "【": "】", "{": "}", "〔": "〕",
    "《": "》", "〈": "〉", "「": "」", "『": "』", "“": "”", "‘": "’",
}

_opencc_cache = {}


def _opencc(config: str):
    try:
        from opencc import OpenCC
    except ImportError as exc:  # pragma: no cover - setup handles this
        raise RuntimeError("缺少 opencc，请先运行 ./setup.sh") from exc
    if config not in _opencc_cache:
        _opencc_cache[config] = OpenCC(config)
    return _opencc_cache[config]


def classify_language(text: str) -> str:
    """Classify a subtitle line by its dominant writing system.

    Kana is the reliable discriminator between Chinese and Japanese. Japanese
    lines that happen to contain only kanji are indistinguishable from Chinese
    without a language model, so they are treated as Chinese.
    """
    if not text:
        return "unknown"
    if KANA_RE.search(text):
        return "ja"
    if HANGUL_RE.search(text):
        return "ko"
    if CJK_RE.search(text):
        return "zh"
    if LATIN_RE.search(text):
        return "en"
    return "unknown"


def language_allowed(text: str, languages: list[str]) -> bool:
    kind = classify_language(text)
    if kind == "unknown":
        return True
    return kind in languages


def convert_text(text: str, mode: str) -> str:
    """Convert between simplified and traditional Chinese, preserving layout."""
    if not text or mode in ("", "none", None):
        return text
    if mode == "simplified":
        return _opencc("t2s").convert(text)
    if mode == "traditional":
        return _opencc("s2t").convert(text)
    if mode == "traditional_tw":
        return _opencc("s2tw").convert(text)
    return text


def convert_multiline_preserving_scripts(text: str, mode: str) -> str:
    """Convert Chinese lines, leaving Japanese/English lines untouched."""
    if not text or mode in ("", "none", None):
        return text
    return "\n".join(
        convert_text(line, mode) if classify_language(line) == "zh" else line
        for line in text.split("\n")
    )


def normalize_text(text: str) -> str:
    """Normalize OCR spacing without destroying Chinese punctuation."""
    if not text:
        return ""
    text = unicodedata.normalize("NFC", text)
    text = text.replace("\ufeff", "").replace("\u200b", "").replace("\xa0", " ")
    text = text.replace("\u3000", " ")
    text = CONTROL_RE.sub("", text)
    text = text.replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    # Keep intentional spaces between CJK words ("是的 自慰"). They are
    # ignored for duplicate matching by comparison_key, but preserved in output.
    text = SPACE_BEFORE_PUNCT_RE.sub("", text)
    text = SPACE_AFTER_OPEN_RE.sub("", text)
    text = REPEATED_CHAR_RE.sub(lambda m: m.group(1) * 3, text)
    text = re.sub(r"^[•●▪◆◇○◦]+\s*", "", text)
    return text.strip(" \t")


def strip_unbalanced_punctuation(text: str) -> str:
    """Remove unmatched brackets/quotes instead of hard-coding each symbol."""
    if not text:
        return text
    stack: list[tuple[str, int]] = []
    remove: set[int] = set()
    for index, char in enumerate(text):
        if char in PAIR_MAP:
            stack.append((char, index))
        elif char in PAIR_MAP.values():
            if stack and PAIR_MAP[stack[-1][0]] == char:
                stack.pop()
            else:
                remove.add(index)
    for _, index in stack:
        remove.add(index)
    if remove:
        text = "".join(char for index, char in enumerate(text) if index not in remove)
    if text.count('"') % 2 == 1:
        if text.endswith('"'):
            text = text[:-1]
        elif text.startswith('"'):
            text = text[1:]
    return text.strip()


def clean_line(text: str) -> str:
    text = normalize_text(text)
    text = re.sub(r"\n+", " ", text)
    text = re.sub(r" {2,}", " ", text)
    if not text:
        return ""
    if not MEANINGFUL_RE.search(text):
        if PUNCT_ONLY_RE.match(text) and len(text) <= 6:
            return text
        return ""
    if len(text) == 1 and not CJK_RE.search(text) and not text.isalnum():
        return ""
    if len(text) > 160:
        text = text[:160].rstrip()
    text = strip_unbalanced_punctuation(text)
    # Apple Vision often appends a comma/period to a subtitle line. Those
    # trailing separators are noise; keep question/exclamation marks.
    text = re.sub(r"[、，,。.；;：:\-—–~～]+\s*$", "", text).rstrip()
    # Drop a closing quote only when it has no matching opening quote.
    for closing, opening in (("”", "“"), ("’", "‘"), ("」", "「"), ("』", "『")):
        while text.endswith(closing) and text.count(closing) > text.count(opening):
            text = text[:-1].rstrip()
    for quote in ('"', "'"):
        if text.endswith(quote) and text.count(quote) % 2 == 1:
            text = text[:-1].rstrip()
    return text.strip()


@lru_cache(maxsize=8192)
def comparison_key(text: str) -> str:
    """Punctuation- and script-insensitive key used for duplicate detection."""
    text = normalize_text(text)
    text = "".join(ch for ch in text if ch.isalnum() or CJK_RE.match(ch))
    if not text:
        return ""
    try:
        text = _opencc("t2s").convert(text)
    except Exception:
        pass
    return text.lower()


def similarity(a: str, b: str) -> float:
    ka, kb = comparison_key(a), comparison_key(b)
    if not ka or not kb:
        return 1.0 if ka == kb else 0.0
    if ka == kb:
        return 1.0
    ratio = SequenceMatcher(None, ka, kb).ratio()
    if len(ka) >= 4 and len(kb) >= 4 and (ka in kb or kb in ka):
        ratio = max(ratio, 0.9)
    return ratio


def is_meaningful(text: str) -> bool:
    return bool(MEANINGFUL_RE.search(text)) or bool(PUNCT_ONLY_RE.match(text))


def merge_text_fragments(left: str, right: str) -> str:
    left, right = left.rstrip(), right.lstrip()
    if not left:
        return right
    if not right:
        return left
    a, b = left[-1], right[0]
    if CJK_OR_KANA_RE.match(a) or CJK_OR_KANA_RE.match(b) or a in CJK_PUNCT or b in CJK_PUNCT:
        return left + right
    if a in "-–—/(":
        return left + right
    return left + " " + right


def choose_best_text(results: list[dict]) -> str:
    """Pick the most trustworthy text among several OCR reads of one cue."""
    if not results:
        return ""
    counts: dict[str, int] = {}
    for item in results:
        key = comparison_key(item["text"])
        if key:
            counts[key] = counts.get(key, 0) + 1
    if not counts:
        return ""
    best_key = max(
        counts,
        key=lambda k: (
            counts[k],
            max((r.get("confidence", 0) for r in results if comparison_key(r["text"]) == k), default=0),
        ),
    )
    candidates = [r for r in results if comparison_key(r["text"]) == best_key]
    longest = max(len(comparison_key(r["text"])) for r in candidates)
    viable = [r for r in candidates if len(comparison_key(r["text"])) >= longest * 0.85]
    best = max(viable or candidates, key=lambda r: (r.get("confidence", 0), len(r["text"])))
    return best["text"]


def split_lines(text: str) -> list[str]:
    out = []
    for line in normalize_text(text).split("\n"):
        cleaned = clean_line(line)
        if cleaned:
            out.append(cleaned)
    return out
