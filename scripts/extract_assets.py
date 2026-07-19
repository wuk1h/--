"""
从桌面 败犬/日文 下的 epub 提取官方插画到 public/makeine-img/
每卷提取：cover.jpeg + images/00001-0000N.jpeg（彩色插页）
"""
import os
import zipfile
import shutil

SRC = r"C:\Users\wukaix\Desktop\败犬\日文"
DST = r"C:\Users\wukaix\WorkBuddy\博客教学\public\makeine-img"
NUM_PLATES = 6  # 每卷彩色插页数（前 N 张，通常是角色立绘）

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

if os.path.exists(DST):
    shutil.rmtree(DST)
os.makedirs(DST, exist_ok=True)

total = 0
for epub, vol_id, vol_label in VOLUMES:
    src_path = os.path.join(SRC, epub)
    if not os.path.exists(src_path):
        print(f"[skip] {epub} not found")
        continue
    vol_dir = os.path.join(DST, vol_id)
    os.makedirs(vol_dir, exist_ok=True)

    with zipfile.ZipFile(src_path) as z:
        names = z.namelist()
        # 封面：兼容 cover.jpeg 与 OEBPS/Images/cover*.jpeg
        cover_candidates = [n for n in names if n.lower().endswith("cover.jpeg")] + \
                           [n for n in names if n.lower().endswith("cover.jpg")]
        for n in cover_candidates[:1]:
            with z.open(n) as f, open(os.path.join(vol_dir, "cover.jpeg"), "wb") as o:
                o.write(f.read())
            total += 1
        # 插页：兼容 images/、OEBPS/Images/、item/image/，扩展名 .jpeg/.jpg
        plate_candidates = [n for n in names
                            if (n.startswith("images/") or n.startswith("OEBPS/Images/")
                                or n.startswith("item/image/"))
                            and n.lower().endswith((".jpeg", ".jpg"))
                            and "cover" not in n.lower()]
        plate_candidates.sort()
        for n in plate_candidates[:NUM_PLATES]:
            base = os.path.basename(n)
            with z.open(n) as f, open(os.path.join(vol_dir, base), "wb") as o:
                o.write(f.read())
            total += 1
    print(f"[ok] {vol_label} ({vol_id}): cover + {min(NUM_PLATES, len(plate_candidates))} plates")

print(f"\nDone. Total images: {total}")
