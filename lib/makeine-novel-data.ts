// 由 scripts/generate_novel_data.py 自动生成，请勿手改

export interface NovelVolume {
  id: string;
  label: string;
  cover: string | null;
  plates: string[];
}

export const novelVolumes: NovelVolume[] = [
  {
    "id": "v1",
    "label": "第1卷",
    "cover": "/makeine-img/v1/cover.jpeg",
    "plates": [
      "/makeine-img/v1/00001.jpeg",
      "/makeine-img/v1/00002.jpeg",
      "/makeine-img/v1/00003.jpeg",
      "/makeine-img/v1/00004.jpeg",
      "/makeine-img/v1/00005.jpeg",
      "/makeine-img/v1/00006.jpeg"
    ]
  },
  {
    "id": "v2",
    "label": "第2卷",
    "cover": "/makeine-img/v2/cover.jpeg",
    "plates": [
      "/makeine-img/v2/00001.jpeg",
      "/makeine-img/v2/00002.jpeg",
      "/makeine-img/v2/00003.jpeg",
      "/makeine-img/v2/00004.jpeg",
      "/makeine-img/v2/00005.jpeg",
      "/makeine-img/v2/00006.jpeg"
    ]
  },
  {
    "id": "v3",
    "label": "第3卷",
    "cover": "/makeine-img/v3/cover.jpeg",
    "plates": [
      "/makeine-img/v3/00001.jpeg",
      "/makeine-img/v3/00002.jpeg",
      "/makeine-img/v3/00003.jpeg",
      "/makeine-img/v3/00004.jpeg",
      "/makeine-img/v3/00005.jpeg",
      "/makeine-img/v3/00006.jpeg"
    ]
  },
  {
    "id": "v4",
    "label": "第4卷",
    "cover": null,
    "plates": [
      "/makeine-img/v4/image00219.jpeg",
      "/makeine-img/v4/image00220.jpeg",
      "/makeine-img/v4/image00221.jpeg",
      "/makeine-img/v4/image00222.jpeg",
      "/makeine-img/v4/image00223.jpeg",
      "/makeine-img/v4/image00224.jpeg"
    ]
  },
  {
    "id": "v5",
    "label": "第5卷",
    "cover": null,
    "plates": [
      "/makeine-img/v5/i-0001_01.jpg",
      "/makeine-img/v5/i-0002-0003_01.jpg",
      "/makeine-img/v5/i-0004-0005_01.jpg",
      "/makeine-img/v5/i-0006-0007_01.jpg",
      "/makeine-img/v5/i-0008_01.jpg",
      "/makeine-img/v5/i-0009_01.jpg"
    ]
  },
  {
    "id": "v6",
    "label": "第6卷",
    "cover": null,
    "plates": [
      "/makeine-img/v6/i-0001_01.jpg",
      "/makeine-img/v6/i-0002-0003_01.jpg",
      "/makeine-img/v6/i-0004-0005_01.jpg",
      "/makeine-img/v6/i-0006-0007_01.jpg",
      "/makeine-img/v6/i-0008_01.jpg",
      "/makeine-img/v6/i-0009_01.jpg"
    ]
  },
  {
    "id": "v7",
    "label": "第7卷",
    "cover": null,
    "plates": [
      "/makeine-img/v7/embed0000_HD.jpg",
      "/makeine-img/v7/embed0001_HD.jpg",
      "/makeine-img/v7/embed0002_HD.jpg",
      "/makeine-img/v7/embed0003_HD.jpg",
      "/makeine-img/v7/embed0004_HD.jpg",
      "/makeine-img/v7/embed0005_HD.jpg"
    ]
  },
  {
    "id": "v8",
    "label": "第8卷",
    "cover": null,
    "plates": [
      "/makeine-img/v8/i-0001_01.jpg",
      "/makeine-img/v8/i-0002-0003_01.jpg",
      "/makeine-img/v8/i-0004-0005_01.jpg",
      "/makeine-img/v8/i-0006-0007_01.jpg",
      "/makeine-img/v8/i-0008_01.jpg",
      "/makeine-img/v8/i-0009_01.jpg"
    ]
  },
  {
    "id": "sss",
    "label": "SSS卷",
    "cover": null,
    "plates": [
      "/makeine-img/sss/embed0000_HD.jpg",
      "/makeine-img/sss/embed0001_HD.jpg",
      "/makeine-img/sss/embed0002_HD.jpg",
      "/makeine-img/sss/embed0003_HD.jpg",
      "/makeine-img/sss/embed0004_HD.jpg",
      "/makeine-img/sss/embed0005_HD.jpg"
    ]
  }
];

export interface NovelPlate { vol: string; volLabel: string; src: string; }

// 从 novelVolumes 派生，消除数据冗余
export const novelPlates: NovelPlate[] = novelVolumes.flatMap((v) =>
  v.plates.map((src) => ({ vol: v.id, volLabel: v.label, src }))
);