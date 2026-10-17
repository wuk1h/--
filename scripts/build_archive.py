"""Build the Makeine archive from the supplied bilingual EPUB files.

The EPUB sources remain outside the repository. This script extracts only
publishable, full-size artwork and creates web-friendly derivatives plus a
typed JSON manifest consumed by the static Next.js site.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import io
import json
import posixpath
import re
import shutil
import zipfile
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Iterable
from xml.etree import ElementTree as ET

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ROOT = ROOT / "public" / "archive"
DATA_OUT = ROOT / "lib" / "archive.generated.json"

VOLUMES = [
    ("v1", "第 1 卷", "1.epub", "01"),
    ("v2", "第 2 卷", "2.epub", "02"),
    ("v3", "第 3 卷", "3.epub", "03"),
    ("v4", "第 4 卷", "4.epub", "04"),
    ("v5", "第 5 卷", "5.epub", "05"),
    ("v6", "第 6 卷", "6.epub", "06"),
    ("v7", "第 7 卷", "7.epub", "07"),
    ("v8", "第 8 卷", "第八卷日文原版.epub", "08"),
    ("sss", "SSS 卷", "SSS.epub", "SSS"),
]

ALIASES: dict[str, tuple[str, ...]] = {
    "yanami": ("八奈见杏菜", "八奈見杏菜", "八奈見", "八奈见"),
    "yakishio": ("烧盐柠檬", "焼塩檸檬", "焼塩", "烧盐"),
    "komari": ("小鞠知花", "小鞠"),
    "nukumizu": ("温水和彦", "温水"),
    "basori": ("马剃天爱星", "馬剃天愛星", "馬剃", "马剃"),
    "kaju": ("温水佳树", "温水佳樹", "佳樹", "佳树"),
    "shikiya": ("志喜屋梦子", "志喜屋夢子", "志喜屋"),
    "shiratama": ("白玉莉子", "白玉リコ", "白玉"),
}

TAG_RE = re.compile(r"<[^>]+>")
RT_RE = re.compile(r"<rt\b[^>]*>.*?</rt>", re.I | re.S)
BLOCK_RE = re.compile(r"<(?:p|h[1-4])\b[^>]*>(.*?)</(?:p|h[1-4])>", re.I | re.S)
IMAGE_RE = re.compile(r"<(?:img|image)\b[^>]*(?:src|href)=[\"']([^\"']+)[\"']", re.I)
KANA_RE = re.compile(r"[\u3040-\u30ff]")
SPACE_RE = re.compile(r"\s+")
BACK_MATTER_MARKERS = (
    "小学館ｅＢｏｏｋｓ",
    "小学館eBooks",
)


@dataclass
class SpineDocument:
    path: str
    title: str
    blocks: list[str]
    images: list[str]

    @property
    def text(self) -> str:
        return " ".join(self.blocks)


def local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def clean_markup(value: str) -> str:
    value = RT_RE.sub("", value)
    value = TAG_RE.sub(" ", value)
    return SPACE_RE.sub(" ", html.unescape(value)).strip()


def extract_blocks(markup: str) -> list[str]:
    blocks = [clean_markup(match.group(1)) for match in BLOCK_RE.finditer(markup)]
    return [block for block in blocks if len(block) >= 2]


def split_bilingual(blocks: Iterable[str], limit: int = 280) -> tuple[str, str]:
    japanese: list[str] = []
    chinese: list[str] = []
    ja_len = zh_len = 0
    for block in blocks:
        if KANA_RE.search(block):
            if ja_len < limit:
                japanese.append(block)
                ja_len += len(block)
        elif re.search(r"[\u4e00-\u9fff]", block):
            if zh_len < limit:
                chinese.append(block)
                zh_len += len(block)
        if ja_len >= limit and zh_len >= limit:
            break
    return trim_excerpt(" ".join(chinese), limit), trim_excerpt(" ".join(japanese), limit)


def trim_excerpt(value: str, limit: int) -> str:
    value = SPACE_RE.sub(" ", value).strip()
    if len(value) <= limit:
        return value
    stop = max(value.rfind(mark, 0, limit) for mark in ("。", "！", "？", "」"))
    return value[: stop + 1 if stop > limit // 2 else limit].strip() + "…"


def resolve_zip_path(base: str, relative: str) -> str:
    if relative.startswith("/"):
        return relative.lstrip("/")
    return posixpath.normpath(posixpath.join(posixpath.dirname(base), relative))


def read_text(archive: zipfile.ZipFile, path: str) -> str:
    raw = archive.read(path)
    for encoding in ("utf-8", "utf-8-sig", "shift_jis"):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            pass
    return raw.decode("utf-8", errors="ignore")


def locate_opf(archive: zipfile.ZipFile) -> str:
    root = ET.fromstring(archive.read("META-INF/container.xml"))
    for element in root.iter():
        if local_name(element.tag) == "rootfile":
            full_path = element.attrib.get("full-path")
            if full_path:
                return full_path
    raise ValueError("EPUB container has no rootfile")


def parse_spine(archive: zipfile.ZipFile, opf_path: str) -> tuple[list[SpineDocument], dict[str, str], str | None]:
    root = ET.fromstring(archive.read(opf_path))
    manifest: dict[str, tuple[str, str, str]] = {}
    cover_id: str | None = None
    spine_ids: list[str] = []
    for element in root.iter():
        name = local_name(element.tag)
        if name == "item":
            item_id = element.attrib.get("id", "")
            href = element.attrib.get("href", "")
            media_type = element.attrib.get("media-type", "")
            properties = element.attrib.get("properties", "")
            manifest[item_id] = (resolve_zip_path(opf_path, href), media_type, properties)
            if "cover-image" in properties:
                cover_id = item_id
        elif name == "itemref":
            item_id = element.attrib.get("idref")
            if item_id:
                spine_ids.append(item_id)
        elif name == "meta" and element.attrib.get("name") == "cover":
            cover_id = element.attrib.get("content")

    documents: list[SpineDocument] = []
    image_types: dict[str, str] = {}
    for item_id, (path, media_type, _properties) in manifest.items():
        if media_type.startswith("image/"):
            image_types[path] = media_type

    for item_id in spine_ids:
        item = manifest.get(item_id)
        if not item or "html" not in item[1]:
            continue
        path = item[0]
        markup = read_text(archive, path)
        blocks = extract_blocks(markup)
        title = next((block for block in blocks if len(block) <= 80), "")
        images = [resolve_zip_path(path, ref) for ref in IMAGE_RE.findall(markup)]
        documents.append(SpineDocument(path=path, title=title, blocks=blocks, images=images))

    cover_path = manifest.get(cover_id, (None, "", ""))[0] if cover_id else None
    return documents, image_types, cover_path


def nearest_context(documents: list[SpineDocument], index: int) -> tuple[str, str, str, str]:
    candidates: list[tuple[int, SpineDocument]] = []
    for distance in range(0, 6):
        for pos in (index - distance, index + distance):
            if 0 <= pos < len(documents):
                doc = documents[pos]
                if sum(len(block) for block in doc.blocks) >= 120:
                    candidates.append((distance, doc))
        if candidates:
            break
    if not candidates:
        return "", "", "", ""
    _, doc = candidates[0]
    zh, ja = split_bilingual(doc.blocks)
    return doc.title, zh, ja, doc.path


def back_matter_start(documents: list[SpineDocument]) -> int | None:
    """Return the first publisher back-matter document in this EPUB edition.

    The supplied books place advertisements, QR codes and publication pages
    after a dedicated Shogakukan eBooks spine item. Using the spine boundary
    keeps late SSS bonus stories while excluding every page that follows the
    publisher marker.
    """
    matches: list[int] = []
    for index, document in enumerate(documents):
        context = f"{document.title} {document.text}"
        if any(marker in context for marker in BACK_MATTER_MARKERS):
            matches.append(index)
    # These editions repeat the publisher label in their opening metadata.
    # The final occurrence is the boundary after the author afterword.
    return matches[-1] if matches else None


def character_candidates(text: str) -> list[str]:
    result: list[str] = []
    for character_id, aliases in ALIASES.items():
        if any(alias in text for alias in aliases):
            result.append(character_id)
    return result


def image_orientation(width: int, height: int) -> str:
    ratio = width / height
    if ratio > 1.18:
        return "landscape"
    if ratio < 0.82:
        return "portrait"
    return "square"


def save_derivatives(source: bytes, output_dir: Path, stem: str) -> tuple[int, int, str, str, str]:
    with Image.open(io.BytesIO(source)) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        width, height = image.size
        display = image.copy()
        display.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
        display_path = output_dir / f"{stem}.webp"
        display.save(display_path, "WEBP", quality=88, method=6)

        thumb = image.copy()
        thumb.thumbnail((640, 640), Image.Resampling.LANCZOS)
        thumb_path = output_dir / f"{stem}-thumb.webp"
        thumb.save(thumb_path, "WEBP", quality=80, method=6)

        blur = image.copy()
        blur.thumbnail((32, 32), Image.Resampling.BILINEAR)
        buffer = io.BytesIO()
        blur.save(buffer, "WEBP", quality=30)
        import base64

        blur_data = "data:image/webp;base64," + base64.b64encode(buffer.getvalue()).decode("ascii")
    return width, height, display_path.name, thumb_path.name, blur_data


def build_volume(source_dir: Path, config: tuple[str, str, str, str]) -> tuple[dict, list[dict], list[dict]]:
    volume_id, label, filename, number = config
    source_path = source_dir / filename
    if not source_path.exists():
        raise FileNotFoundError(source_path)

    output_dir = PUBLIC_ROOT / "volumes" / volume_id
    output_dir.mkdir(parents=True, exist_ok=True)
    artworks: list[dict] = []
    excerpts: list[dict] = []
    seen_hashes: set[str] = set()
    cover_src: str | None = None

    with zipfile.ZipFile(source_path) as archive:
        opf_path = locate_opf(archive)
        documents, image_types, cover_path = parse_spine(archive, opf_path)
        excluded_from_index = back_matter_start(documents)
        first_text_index = next(
            (index for index, doc in enumerate(documents) if sum(len(block) for block in doc.blocks) > 1000),
            0,
        )
        refs: list[tuple[int, str]] = []
        for doc_index, document in enumerate(documents):
            refs.extend((doc_index, image_path) for image_path in document.images)
        if cover_path and cover_path not in {path for _, path in refs}:
            refs.insert(0, (0, cover_path))

        for source_index, (doc_index, image_path) in enumerate(refs):
            if excluded_from_index is not None and doc_index >= excluded_from_index:
                continue
            if image_path not in archive.namelist():
                continue
            raw = archive.read(image_path)
            digest = hashlib.sha256(raw).hexdigest()
            if digest in seen_hashes:
                continue
            seen_hashes.add(digest)
            try:
                with Image.open(io.BytesIO(raw)) as probe:
                    width, height = probe.size
            except Exception:
                continue
            is_cover = image_path == cover_path or "cover" in PurePosixPath(image_path).name.lower()
            if not is_cover and (len(raw) < 10_000 or max(width, height) < 700 or min(width, height) < 350):
                continue

            artwork_id = f"{volume_id}-{len(artworks) + 1:03d}"
            stem = "cover" if is_cover and cover_src is None else f"art-{len(artworks) + 1:03d}"
            width, height, display_name, thumb_name, blur_data = save_derivatives(raw, output_dir, stem)
            src = f"/archive/volumes/{volume_id}/{display_name}"
            thumb_src = f"/archive/volumes/{volume_id}/{thumb_name}"
            if is_cover and cover_src is None:
                cover_src = src

            chapter, zh, ja, source_doc = nearest_context(documents, doc_index)
            excerpt_id = f"excerpt-{artwork_id}"
            context = f"{chapter} {zh} {ja}"
            candidates = character_candidates(context)
            kind = "cover" if is_cover else ("plate" if doc_index < first_text_index else "story")
            candidate_character_ids = candidates if kind == "story" and 0 < len(candidates) <= 3 else []
            color_mode = "color" if image_mode_is_color(raw) else "mono"
            artworks.append(
                {
                    "id": artwork_id,
                    "volumeId": volume_id,
                    "src": src,
                    "thumbnailSrc": thumb_src,
                    "sourcePath": image_path,
                    "type": kind,
                    "colorMode": color_mode,
                    "orientation": image_orientation(width, height),
                    "width": width,
                    "height": height,
                    "focalPoint": "50% 50%",
                    # Nearby text only produces review candidates. Public tags
                    # are applied from the manually curated map in archive.ts.
                    "characterIds": [],
                    "candidateCharacterIds": candidate_character_ids,
                    "chapter": chapter or label,
                    "excerptId": excerpt_id if zh or ja else None,
                    "alt": f"《败犬女主太多了！》{label}官方插画",
                    "reviewStatus": "verified",
                    "blurDataUrl": blur_data,
                }
            )
            if zh or ja:
                excerpts.append(
                    {
                        "id": excerpt_id,
                        "artworkId": artwork_id,
                        "volumeId": volume_id,
                        "chapter": chapter or label,
                        "zh": zh,
                        "ja": ja,
                        "sourceFile": source_doc,
                    }
                )

    if not cover_src and artworks:
        cover_src = artworks[0]["src"]
    volume = {
        "id": volume_id,
        "number": number,
        "label": label,
        "sourceFile": filename,
        "coverSrc": cover_src,
        "artworkIds": [artwork["id"] for artwork in artworks],
        "description": f"收录 {len(artworks)} 张经来源校验的官方图像。",
    }
    return volume, artworks, excerpts


def image_mode_is_color(raw: bytes) -> bool:
    with Image.open(io.BytesIO(raw)) as image:
        sample = image.convert("RGB")
        sample.thumbnail((96, 96), Image.Resampling.BILINEAR)
        colorful = 0
        pixels = list(sample.get_flattened_data())
        for red, green, blue in pixels:
            if max(red, green, blue) - min(red, green, blue) > 18:
                colorful += 1
        return colorful / max(len(pixels), 1) > 0.08


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True, help="Directory containing the user-supplied EPUB files")
    args = parser.parse_args()
    source_dir = args.source.resolve()
    if not source_dir.is_dir():
        raise SystemExit(f"EPUB source directory does not exist: {source_dir}")

    volumes_root = PUBLIC_ROOT / "volumes"
    if volumes_root.exists():
        resolved = volumes_root.resolve()
        if ROOT.resolve() not in resolved.parents:
            raise RuntimeError(f"Refusing to remove output outside workspace: {resolved}")
        shutil.rmtree(volumes_root)
    volumes_root.mkdir(parents=True)

    volumes: list[dict] = []
    artworks: list[dict] = []
    excerpts: list[dict] = []
    for config in VOLUMES:
        volume, volume_artworks, volume_excerpts = build_volume(source_dir, config)
        volumes.append(volume)
        artworks.extend(volume_artworks)
        excerpts.extend(volume_excerpts)
        print(f"[ok] {volume['label']}: {len(volume_artworks)} artworks")

    payload = {
        "generatedFrom": "user-supplied EPUB collection",
        "collectionLabel": "第 1–8 卷 + SSS",
        "publishedStatus": "9+1+1 册（2026.07）",
        "volumes": volumes,
        "artworks": artworks,
        "excerpts": excerpts,
    }
    DATA_OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nGenerated {len(artworks)} artworks and {len(excerpts)} excerpts")


if __name__ == "__main__":
    main()
