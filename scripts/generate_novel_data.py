"""
扫描 public/makeine-img/，生成 lib/makeine-novel-data.ts
供 /novel 沉浸式阅读页面使用
"""
import os
import json

IMG_ROOT = r"C:\Users\wukaix\WorkBuddy\博客教学\public\makeine-img"
OUT = r"C:\Users\wukaix\WorkBuddy\博客教学\lib\makeine-novel-data.ts"

VOLUMES_ORDER = [
    ("v1", "第1卷"),
    ("v2", "第2卷"),
    ("v3", "第3卷"),
    ("v4", "第4卷"),
    ("v5", "第5卷"),
    ("v6", "第6卷"),
    ("v7", "第7卷"),
    ("v8", "第8卷"),
    ("sss", "SSS卷"),
]

volumes_ts = []
for vid, label in VOLUMES_ORDER:
    d = os.path.join(IMG_ROOT, vid)
    if not os.path.isdir(d):
        continue
    files = [f for f in os.listdir(d) if f.lower().endswith((".jpeg", ".jpg"))]
    cover = f"/makeine-img/{vid}/cover.jpeg" if "cover.jpeg" in files else None
    plates = sorted([f for f in files if f != "cover.jpeg"])
    plates_paths = [f"/makeine-img/{vid}/{p}" for p in plates]
    volumes_ts.append({
        "id": vid,
        "label": label,
        "cover": cover,
        "plates": plates_paths,
    })

# 生成 TS
lines = ["// 由 scripts/generate_novel_data.py 自动生成，请勿手改", ""]
lines.append("export interface NovelVolume {")
lines.append("  id: string;")
lines.append("  label: string;")
lines.append("  cover: string | null;")
lines.append("  plates: string[];")
lines.append("}")
lines.append("")
lines.append("export const novelVolumes: NovelVolume[] = " + json.dumps(volumes_ts, ensure_ascii=False, indent=2) + ";")
lines.append("")
# 所有 plate 平铺，用于插图墙（派生自 novelVolumes，消除数据冗余）
all_plates = []
for v in volumes_ts:
    for p in v["plates"]:
        all_plates.append({"vol": v["id"], "volLabel": v["label"], "src": p})
lines.append("export interface NovelPlate { vol: string; volLabel: string; src: string; }")
lines.append("")
lines.append("// 从 novelVolumes 派生，消除数据冗余")
lines.append("export const novelPlates: NovelPlate[] = novelVolumes.flatMap((v) =>")
lines.append("  v.plates.map((src) => ({ vol: v.id, volLabel: v.label, src }))")
lines.append(");")

with open(OUT, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Generated {OUT}")
print(f"Volumes: {len(volumes_ts)}, plates: {len(all_plates)}")
