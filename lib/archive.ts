import generated from './archive.generated.json';

export type CharacterId =
  | 'yanami'
  | 'yakishio'
  | 'komari'
  | 'nukumizu'
  | 'basori'
  | 'kaju'
  | 'shikiya'
  | 'shiratama';

export type ArtworkType = 'cover' | 'plate' | 'story';
export type ArtworkOrientation = 'portrait' | 'landscape' | 'square';

export interface Character {
  id: CharacterId;
  name: string;
  nameJp: string;
  kana: string;
  romaji: string;
  role: string;
  tagline: string;
  description: string;
  accent: string;
  ink: string;
  portraitSrc: string;
  portraitPosition: string;
  facts: Array<{ label: string; value: string }>;
}

export interface Volume {
  id: string;
  number: string;
  label: string;
  sourceFile: string;
  coverSrc: string | null;
  artworkIds: string[];
  description: string;
}

export interface Artwork {
  id: string;
  volumeId: string;
  src: string;
  thumbnailSrc: string;
  sourcePath: string;
  type: ArtworkType;
  colorMode: 'color' | 'mono';
  orientation: ArtworkOrientation;
  width: number;
  height: number;
  focalPoint: string;
  characterIds: CharacterId[];
  candidateCharacterIds: CharacterId[];
  chapter: string;
  excerptId: string | null;
  alt: string;
  reviewStatus: 'verified';
  blurDataUrl: string;
}

export interface Excerpt {
  id: string;
  artworkId: string;
  volumeId: string;
  chapter: string;
  zh: string;
  ja: string;
  sourceFile: string;
}

export interface Relationship {
  from: CharacterId;
  to: CharacterId;
  label: string;
  tone: 'friend' | 'family' | 'club' | 'unspoken';
}

const curatedArtworkCharacters: Partial<Record<string, CharacterId[]>> = {
  'v1-002': ['yanami'],
  'v1-003': ['yakishio', 'yanami'],
  'v1-004': ['kaju', 'komari'],
  'v1-005': ['yanami', 'yakishio', 'komari'],
  'v2-002': ['yakishio'],
  'v3-002': ['komari'],
  'v4-002': ['shikiya'],
  'v5-002': ['kaju'],
  'v5-003': ['yakishio', 'nukumizu'],
  'v7-002': ['shiratama'],
  'v7-003': ['shiratama', 'nukumizu'],
  'v8-002': ['basori'],
  'v8-003': ['komari', 'nukumizu'],
  'sss-002': ['yanami'],
  'sss-004': ['yanami', 'yakishio', 'komari'],
};

export const characters: Character[] = [
  {
    id: 'yanami',
    name: '八奈见杏菜',
    nameJp: '八奈見杏菜',
    kana: 'やなみ あんな',
    romaji: 'YANAMI ANNA',
    role: '败犬一号 / 美食担当',
    tagline: '把失恋也吃成青春的蓝色主角。',
    description: '高中二年级。开朗、健谈，而且总在寻找下一口食物。她与温水在家庭餐厅的相遇，成为整个故事真正的开场。',
    accent: '#19aee6',
    ink: '#063f68',
    portraitSrc: '/archive/volumes/v1/art-002.webp',
    portraitPosition: '50% 20%',
    facts: [
      { label: '年级', value: '石蕗高中 2 年' },
      { label: '生日', value: '11 月 29 日' },
      { label: '关键词', value: '青梅竹马 / 便当 / 吃货' },
    ],
  },
  {
    id: 'yakishio',
    name: '烧盐柠檬',
    nameJp: '焼塩檸檬',
    kana: 'やきしお れもん',
    romaji: 'YAKISHIO REMON',
    role: '败犬二号 / 田径王牌',
    tagline: '跑得过所有人，却没跑赢那段青梅竹马。',
    description: '田径部的元气王牌。她的直率、行动力与晒成小麦色的皮肤，让每次登场都像盛夏突然闯进画面。',
    accent: '#ff8d2a',
    ink: '#71321b',
    portraitSrc: '/archive/volumes/v2/art-002.webp',
    portraitPosition: '50% 20%',
    facts: [
      { label: '年级', value: '石蕗高中 2 年' },
      { label: '生日', value: '8 月 1 日' },
      { label: '关键词', value: '田径 / 水族馆 / 青梅竹马' },
    ],
  },
  {
    id: 'komari',
    name: '小鞠知花',
    nameJp: '小鞠知花',
    kana: 'こまり ちか',
    romaji: 'KOMARI CHIKA',
    role: '败犬三号 / 文艺部',
    tagline: '说不出口的话，全都藏进了文字。',
    description: '极度怕生的文学少女，习惯借手机和文字与人交流。看似畏缩，却在重要时刻拥有异常坚定的意志。',
    accent: '#ef426f',
    ink: '#682033',
    portraitSrc: '/archive/volumes/v3/art-002.webp',
    portraitPosition: '50% 18%',
    facts: [
      { label: '年级', value: '石蕗高中 2 年' },
      { label: '生日', value: '3 月 29 日' },
      { label: '关键词', value: '文艺部 / 手机 / 自来水' },
    ],
  },
  {
    id: 'nukumizu',
    name: '温水和彦',
    nameJp: '温水和彦',
    kana: 'ぬくみず かずひこ',
    romaji: 'NUKUMIZU KAZUHIKO',
    role: '主人公 / 旁观者',
    tagline: '本想当背景人物，却成了所有故事的见证者。',
    description: '达观而孤独的高中二年级生。偶然目击八奈见的失恋后，被接连出现的败犬女主们卷入青春中心。',
    accent: '#2f3747',
    ink: '#151922',
    portraitSrc: '/archive/volumes/v5/art-003.webp',
    portraitPosition: '70% 44%',
    facts: [
      { label: '年级', value: '石蕗高中 2 年' },
      { label: '生日', value: '12 月 25 日' },
      { label: '关键词', value: '文艺部 / 小说 / 观察者' },
    ],
  },
  {
    id: 'basori',
    name: '马剃天爱星',
    nameJp: '馬剃天愛星',
    kana: 'ばそり てぃあら',
    romaji: 'BASORI TIARA',
    role: '学生会 / 第八卷焦点',
    tagline: '认真得近乎笨拙，也因此格外耀眼。',
    description: '学生会的重要成员。严肃认真，却也会为成绩苦恼；第八卷中，她与温水的距离得到更清晰的刻画。',
    accent: '#39bdb5',
    ink: '#174d51',
    portraitSrc: '/archive/volumes/v8/art-002.webp',
    portraitPosition: '50% 20%',
    facts: [
      { label: '年级', value: '石蕗高中 2 年' },
      { label: '所属', value: '学生会' },
      { label: '关键词', value: '认真 / 会长候选 / 补习' },
    ],
  },
  {
    id: 'kaju',
    name: '温水佳树',
    nameJp: '温水佳樹',
    kana: 'ぬくみず かじゅ',
    romaji: 'NUKUMIZU KAJU',
    role: '完美妹妹 / 家庭线',
    tagline: '哥哥生活里的绝对秩序与最大变量。',
    description: '温水和彦的妹妹。家务、学习与社交都游刃有余，对哥哥的关心则明显超过普通兄妹的距离。',
    accent: '#f3b20c',
    ink: '#5d4715',
    portraitSrc: '/archive/volumes/v5/art-002.webp',
    portraitPosition: '50% 18%',
    facts: [
      { label: '年级', value: '桃园国中 3 年' },
      { label: '生日', value: '6 月 6 日' },
      { label: '关键词', value: '兄控 / 家务 / 完美妹妹' },
    ],
  },
  {
    id: 'shikiya',
    name: '志喜屋梦子',
    nameJp: '志喜屋夢子',
    kana: 'しきや ゆめこ',
    romaji: 'SHIKIYA YUMEKO',
    role: '学生会 / 丧尸系辣妹',
    tagline: '苍白、缓慢，却总能让空气突然失去节奏。',
    description: '学生会成员，拥有独特的丧尸系气质。她不擅长坦率表达，沉默与直球常常同时出现。',
    accent: '#bb77d4',
    ink: '#482b57',
    portraitSrc: '/archive/volumes/v4/art-002.webp',
    portraitPosition: '50% 18%',
    facts: [
      { label: '年级', value: '石蕗高中 3 年' },
      { label: '所属', value: '学生会' },
      { label: '关键词', value: '丧尸系 / 辣妹 / 不坦率' },
    ],
  },
  {
    id: 'shiratama',
    name: '白玉莉子',
    nameJp: '白玉リコ',
    kana: 'しらたま りこ',
    romaji: 'SHIRATAMA RIKO',
    role: '败犬四号 / 文艺部新生',
    tagline: '天使般登场，问题儿童般打破平静。',
    description: '文艺部的一年级新成员。惹人怜爱的外表下藏着大胆计划，第七卷的婚礼潜入事件因她而展开。',
    accent: '#88b9a6',
    ink: '#31564e',
    portraitSrc: '/archive/volumes/v7/art-002.webp',
    portraitPosition: '50% 18%',
    facts: [
      { label: '年级', value: '石蕗高中 1 年' },
      { label: '所属', value: '文艺部' },
      { label: '关键词', value: '婚礼 / 停学 / 问题儿童' },
    ],
  },
];

export const relationships: Relationship[] = [
  { from: 'yanami', to: 'nukumizu', label: '便当债与日常同盟', tone: 'friend' },
  { from: 'yakishio', to: 'nukumizu', label: '奔跑与陪伴', tone: 'friend' },
  { from: 'komari', to: 'nukumizu', label: '文艺部搭档', tone: 'club' },
  { from: 'kaju', to: 'nukumizu', label: '兄妹', tone: 'family' },
  { from: 'shikiya', to: 'nukumizu', label: '难以预测的距离', tone: 'unspoken' },
  { from: 'basori', to: 'nukumizu', label: '学生会与补习', tone: 'unspoken' },
  { from: 'shiratama', to: 'nukumizu', label: '社长与问题新生', tone: 'club' },
];

export const volumes = generated.volumes as Volume[];
export const excerpts = generated.excerpts as Excerpt[];
export const artworks = (generated.artworks as Artwork[]).map((artwork) => ({
  ...artwork,
  characterIds: curatedArtworkCharacters[artwork.id] ?? artwork.characterIds,
}));

export const archiveMeta = {
  collectionLabel: generated.collectionLabel,
  publishedStatus: generated.publishedStatus,
  excerptCount: generated.excerpts.length,
  sourceNote: '资料核对：原作 EPUB、萌娘百科作品与角色条目。',
  illustrator: 'いみぎむる（伊右群）',
  author: '雨森焚火',
} as const;

export const featuredArtworkRows = [
  ['v1-002', 'v1-003', 'v1-004', 'v1-005', 'v2-002', 'v3-002', 'v4-002', 'v5-002'],
  ['v5-003', 'v7-002', 'v7-003', 'v8-002', 'v8-003', 'sss-002', 'sss-004'],
] as const;

export const featuredArtworkIds = featuredArtworkRows.flat();

export const characterById = new Map(characters.map((character) => [character.id, character]));
export const volumeById = new Map(volumes.map((volume) => [volume.id, volume]));
export const artworkById = new Map(artworks.map((artwork) => [artwork.id, artwork]));
export const excerptById = new Map(excerpts.map((excerpt) => [excerpt.id, excerpt]));

export function getCharacter(id: string) {
  return characterById.get(id as CharacterId);
}

export function getVolume(id: string) {
  return volumeById.get(id);
}

export function getArtwork(id: string) {
  return artworkById.get(id);
}

export function getArtworksForCharacter(id: CharacterId) {
  const character = characterById.get(id);
  return artworks.filter(
    (artwork) => artwork.characterIds.includes(id) || artwork.src === character?.portraitSrc,
  );
}

export function getArtworksForVolume(id: string) {
  return artworks.filter((artwork) => artwork.volumeId === id);
}
