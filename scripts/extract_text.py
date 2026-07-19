"""
从 epub 提取日文原文片段（名场面用）
每卷取前 5 个最大章节，每段截前 400 字
输出 lib/makeine-text.json
"""
import os
import re
import zipfile
import json

SRC = r"C:\Users\wukaix\Desktop\败犬\日文"
OUT = r"C:\Users\wukaix\WorkBuddy\博客教学\lib\makeine-text.json"

VOLUMES = [
    ("1.epub", "v1", "第1卷"),
    ("2.epub", "v2", "第2卷"),
    ("3.epub", "v3", "第3卷"),
    ("4.epub", "v4", "第4卷"),
    ("5.epub", "v5", "第5卷"),
    ("6.epub", "v6", "第6卷"),
    ("7.epub", "v7", "第7卷"),
    ("第八卷日文原版.epub", "v8", "第8卷"),
    ("SSS.epub", "sss", "SSS卷"),
]

# 三种版式的章节路径前缀
CHAPTER_PREFIXES = ("text/", "OEBPS/Text/", "item/xhtml/")

TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")
RUBY_BASE_RE = re.compile(r"<ruby>(.*?)</ruby>", re.DOTALL)
RT_RE = re.compile(r"<rt>.*?</rt>", re.DOTALL)
H_TAG_RE = re.compile(r"<h[1-3][^>]*>(.*?)</h[1-3]>", re.DOTALL | re.IGNORECASE)


def extract_text(html: str) -> str:
    # 提取 <h1> 作为标题（在清洗前）
    h_match = H_TAG_RE.search(html)
    title = ""
    if h_match:
        title = TAG_RE.sub("", h_match.group(1)).strip()
    # 移除 ruby 注释但保留 base
    html = RUBY_BASE_RE.sub(lambda m: RT_RE.sub("", m.group(1)), html)
    # 去标签
    text = TAG_RE.sub(" ", html)
    # 标准化空白
    text = WHITESPACE_RE.sub(" ", text).strip()
    return title, text


def main():
    result = {}
    for epub, vol_id, vol_label in VOLUMES:
        src_path = os.path.join(SRC, epub)
        if not os.path.exists(src_path):
            continue
        with zipfile.ZipFile(src_path) as z:
            # 收集章节文件（含信息）
            chapters = []
            for info in z.infolist():
                name = info.filename
                if not (name.endswith(".html") or name.endswith(".xhtml")):
                    continue
                if not any(name.startswith(p) for p in CHAPTER_PREFIXES):
                    continue
                if "cover" in name.lower() or "navigation" in name.lower() or "toc" in name.lower():
                    continue
                chapters.append((info.file_size, name))
            # 按大小降序，取前 5 个
            chapters.sort(reverse=True)
            snippets = []
            for size, name in chapters[:5]:
                with z.open(name) as f:
                    html_bytes = f.read()
                try:
                    html = html_bytes.decode("utf-8", errors="ignore")
                except Exception:
                    continue
                title, text = extract_text(html)
                snippet_text = text[:400]
                if len(snippet_text) < 50:
                    continue
                snippets.append({
                    "id": f"{vol_id}-{os.path.basename(name).split('.')[0]}",
                    "source": name,
                    "title": title or f"{vol_label} · {os.path.basename(name)}",
                    "text": snippet_text + ("…" if len(text) > 400 else ""),
                })
            result[vol_id] = {
                "label": vol_label,
                "snippets": snippets,
            }
            print(f"[ok] {vol_label}: {len(snippets)} snippets")

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    total = sum(len(v["snippets"]) for v in result.values())
    print(f"\nDone. {total} snippets -> {OUT}")


if __name__ == "__main__":
    main()
