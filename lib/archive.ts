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
export type ReviewStatus = 'verified';

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
  title?: string;
  sceneDescription?: string;
  sceneType?: 'portrait' | 'dialogue' | 'club' | 'family' | 'school' | 'comedy' | 'relationship' | 'special';
  descriptionReviewStatus?: ReviewStatus;
  sourceChapter?: string;
  reviewedCharacterIds?: CharacterId[];
  reviewStatus: ReviewStatus;
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

export interface CharacterArtworkReview {
  artworkId: string;
  characterIds: CharacterId[];
  title: string;
  sceneDescription: string;
  sceneType: NonNullable<Artwork['sceneType']>;
  sourceChapter: string;
  excerptId?: string;
  descriptionReviewStatus: ReviewStatus;
}

export interface CharacterMoment {
  id: string;
  volumeId: string;
  artworkId: string;
  title: string;
  summary: string;
  excerptId: string;
  sourceFile: string;
  reviewStatus: ReviewStatus;
}

export interface CharacterConnection {
  id: string;
  characterId?: CharacterId;
  verifiedName?: string;
  label: string;
  description: string;
  source: string;
  reviewStatus: ReviewStatus;
}

export interface CharacterAnimeProfile {
  status: 'covered' | 'not-covered';
  voiceActor: string;
  officialCharacterUrl?: string;
  videos: Array<{ title: string; youtubeId: string; sourceUrl: string }>;
  checkedAt: string;
}

export interface ExternalArtwork {
  id: string;
  characterId: CharacterId;
  kind: 'official-link' | 'video';
  title: string;
  sourceUrl: string;
  author: string;
  copyrightNote: string;
  sha256?: string;
}

export interface CharacterDossier {
  characterId: CharacterId;
  dossierNo: string;
  affiliation: string;
  grade: string;
  birthday: string;
  keywords: string[];
  firstFocusVolumeId: string;
  appearanceVolumeIds: string[];
  anime: CharacterAnimeProfile;
  spoilerMode: 'full';
  personalitySummary: string;
  originalDescriptions: Array<{
    id: string;
    title: string;
    zh: string;
    ja: string;
    source: string;
    excerptId?: string;
    reviewStatus: ReviewStatus;
  }>;
  moments: CharacterMoment[];
  connections: CharacterConnection[];
  artworkSections: {
    hero: string[];
    monochrome: string[];
    ensemble: string[];
    archive: string[];
  };
  externalMedia: ExternalArtwork[];
}

const baseCharacterData: Record<CharacterId, Omit<Character, 'id'>> = {
  yanami: {
    name: '八奈见杏菜',
    nameJp: '八奈見杏菜',
    kana: 'やなみ あんな',
    romaji: 'YANAMI ANNA',
    role: '败犬一号 / 美食担当',
    tagline: '把失恋也吃成青春主菜的蓝色幼驯染。',
    description: '石蕗高中二年级。开朗健谈，情绪来得快也恢复得快，常常用食物把失恋后的空洞填成热闹的日常。',
    accent: '#19aee6',
    ink: '#063f68',
    portraitSrc: '/archive/volumes/v1/art-002.webp',
    portraitPosition: '50% 20%',
    facts: [
      { label: '年级', value: '石蕗高中 2 年级' },
      { label: '生日', value: '11 月 29 日' },
      { label: '关键词', value: '青梅竹马 / 便当 / 吃货' },
    ],
  },
  yakishio: {
    name: '烧盐柠檬',
    nameJp: '焼塩檸檬',
    kana: 'やきしお れもん',
    romaji: 'YAKISHIO REMON',
    role: '败犬二号 / 田径王牌',
    tagline: '跑得过所有人，却跑不赢那段青梅竹马。',
    description: '田径部的元气王牌。直率、行动力强，像盛夏突然闯进画面；她的失败也因此格外明亮。',
    accent: '#ff8d2a',
    ink: '#71321b',
    portraitSrc: '/archive/volumes/v2/art-002.webp',
    portraitPosition: '50% 20%',
    facts: [
      { label: '年级', value: '石蕗高中 2 年级' },
      { label: '生日', value: '8 月 1 日' },
      { label: '关键词', value: '田径 / 水族馆 / 青梅竹马' },
    ],
  },
  komari: {
    name: '小鞠知花',
    nameJp: '小鞠知花',
    kana: 'こまり ちか',
    romaji: 'KOMARI CHIKA',
    role: '败犬三号 / 文艺部',
    tagline: '说不出口的话，全都藏进文字里。',
    description: '极度怕生的文学少女，习惯借手机和文字与人交流。看似畏缩，却在关键时刻拥有异常坚定的意志。',
    accent: '#ef426f',
    ink: '#682033',
    portraitSrc: '/archive/volumes/v3/art-002.webp',
    portraitPosition: '50% 18%',
    facts: [
      { label: '年级', value: '石蕗高中 2 年级' },
      { label: '生日', value: '3 月 29 日' },
      { label: '关键词', value: '文艺部 / 手机 / 自来水' },
    ],
  },
  nukumizu: {
    name: '温水和彦',
    nameJp: '温水和彦',
    kana: 'ぬくみず かずひこ',
    romaji: 'NUKUMIZU KAZUHIKO',
    role: '主人公 / 旁观者',
    tagline: '本想当背景人物，却成了所有故事的见证者。',
    description: '达观而孤独的高中二年级生。偶然目击八奈见失恋后，被接连出现的败犬女主们卷入青春中心。',
    accent: '#2f3747',
    ink: '#151922',
    portraitSrc: '/archive/volumes/v5/art-003.webp',
    portraitPosition: '70% 44%',
    facts: [
      { label: '年级', value: '石蕗高中 2 年级' },
      { label: '生日', value: '12 月 25 日' },
      { label: '关键词', value: '文艺部 / 小说 / 观察者' },
    ],
  },
  basori: {
    name: '马剃天爱星',
    nameJp: '馬剃天愛星',
    kana: 'ばそり てぃあら',
    romaji: 'BASORI TIARA',
    role: '学生会 / 第八卷焦点',
    tagline: '认真得近乎笨拙，也因此格外耀眼。',
    description: '学生会的重要成员。严肃认真，也会为成绩和距离感苦恼；第八卷中，她与温水的关系被更清晰地刻画。',
    accent: '#39bdb5',
    ink: '#174d51',
    portraitSrc: '/archive/volumes/v8/art-002.webp',
    portraitPosition: '50% 20%',
    facts: [
      { label: '年级', value: '石蕗高中 2 年级' },
      { label: '所属', value: '学生会' },
      { label: '关键词', value: '认真 / 会长候选 / 补习' },
    ],
  },
  kaju: {
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
      { label: '年级', value: '桃园国中 3 年级' },
      { label: '生日', value: '6 月 6 日' },
      { label: '关键词', value: '兄控 / 家务 / 完美妹妹' },
    ],
  },
  shikiya: {
    name: '志喜屋梦子',
    nameJp: '志喜屋夢子',
    kana: 'しきや ゆめこ',
    romaji: 'SHIKIYA YUMEKO',
    role: '学生会 / 丧尸系辣妹',
    tagline: '苍白、缓慢，却总能让空气突然失去节奏。',
    description: '学生会成员，拥有独特的丧尸系气质。她不擅长快速表达，沉默与直球常常同时出现。',
    accent: '#bb77d4',
    ink: '#482b57',
    portraitSrc: '/archive/volumes/v4/art-002.webp',
    portraitPosition: '50% 18%',
    facts: [
      { label: '年级', value: '石蕗高中 3 年级' },
      { label: '所属', value: '学生会' },
      { label: '关键词', value: '丧尸系 / 辣妹 / 不按拍' },
    ],
  },
  shiratama: {
    name: '白玉莉子',
    nameJp: '白玉リコ',
    kana: 'しらたま りこ',
    romaji: 'SHIRATAMA RIKO',
    role: '败犬四号 / 文艺部新生',
    tagline: '天使般登场，问题儿童般打破平静。',
    description: '文艺部的一年级新成员。可爱的外表下藏着大胆计划，第七卷的婚礼潜入事件因她而展开。',
    accent: '#88b9a6',
    ink: '#31564e',
    portraitSrc: '/archive/volumes/v7/art-002.webp',
    portraitPosition: '50% 18%',
    facts: [
      { label: '年级', value: '石蕗高中 1 年级' },
      { label: '所属', value: '文艺部' },
      { label: '关键词', value: '婚礼 / 停学 / 问题儿童' },
    ],
  },
};

export const characters: Character[] = (Object.entries(baseCharacterData) as Array<[CharacterId, Omit<Character, 'id'>]>)
  .map(([id, character]) => ({ id, ...character }));

export const relationships: Relationship[] = [
  { from: 'yanami', to: 'nukumizu', label: '便当债与日常同盟', tone: 'friend' },
  { from: 'yakishio', to: 'nukumizu', label: '奔跑与陪伴', tone: 'friend' },
  { from: 'komari', to: 'nukumizu', label: '文艺部搭档', tone: 'club' },
  { from: 'kaju', to: 'nukumizu', label: '兄妹', tone: 'family' },
  { from: 'shikiya', to: 'nukumizu', label: '难以预测的距离', tone: 'unspoken' },
  { from: 'basori', to: 'nukumizu', label: '学生会与补习', tone: 'unspoken' },
  { from: 'shiratama', to: 'nukumizu', label: '社长与问题新生', tone: 'club' },
];

export const artworkReviews: CharacterArtworkReview[] = [
  { artworkId: 'v1-002', characterIds: ['yanami'], title: '蓝色制服主视觉', sceneDescription: '八奈见杏菜以卷首彩页姿态登场，蓝色制服和明亮表情构成她的第一印象。', sceneType: 'portrait', sourceChapter: '第 1 卷卷首彩页', excerptId: 'excerpt-v1-002', descriptionReviewStatus: 'verified' },
  { artworkId: 'v1-003', characterIds: ['yakishio', 'yanami'], title: '泳池边的三人关系', sceneDescription: '烧盐柠檬与八奈见杏菜同框，画面围绕运动系青春和败犬同盟的早期气氛展开。', sceneType: 'relationship', sourceChapter: '第 1 卷卷首彩页', excerptId: 'excerpt-v1-003', descriptionReviewStatus: 'verified' },
  { artworkId: 'v1-004', characterIds: ['kaju', 'komari'], title: '佳树与小鞠的彩页', sceneDescription: '温水佳树和小鞠知花出现在同一张彩页中，形成家庭线与文艺部线的并置。', sceneType: 'club', sourceChapter: '第 1 卷卷首彩页', excerptId: 'excerpt-v1-004', descriptionReviewStatus: 'verified' },
  { artworkId: 'v1-005', characterIds: ['yanami', 'yakishio', 'komari'], title: '败犬女主集合', sceneDescription: '八奈见、烧盐、小鞠三位核心女主同框，是第一卷对败犬群像的彩色展示。', sceneType: 'relationship', sourceChapter: '第 1 卷卷首彩页', excerptId: 'excerpt-v1-005', descriptionReviewStatus: 'verified' },
  { artworkId: 'v1-009', characterIds: ['yanami'], title: '餐桌前的杏菜', sceneDescription: '八奈见杏菜坐在餐桌前吃薯条，轻松食欲和失恋余波在同一张黑白图中并置。', sceneType: 'comedy', sourceChapter: '第 1 卷 1 败目', excerptId: 'excerpt-v1-009', descriptionReviewStatus: 'verified' },
  { artworkId: 'v1-010', characterIds: ['yanami'], title: '青梅竹马的冲击', sceneDescription: '八奈见杏菜在近景中露出受冲击的表情，画面对应她意识到恋情彻底失败的瞬间。', sceneType: 'relationship', sourceChapter: '第 1 卷 1 败目', excerptId: 'excerpt-v1-010', descriptionReviewStatus: 'verified' },
  { artworkId: 'v1-018', characterIds: ['yanami', 'nukumizu'], title: '屋顶上的告别宣言', sceneDescription: '八奈见向过去的恋情喊出告别，温水在一旁见证她把失败转化成继续前进的姿态。', sceneType: 'relationship', sourceChapter: '第 1 卷 4 败目', excerptId: 'excerpt-v1-018', descriptionReviewStatus: 'verified' },
  { artworkId: 'v2-006', characterIds: ['yanami', 'nukumizu'], title: '想让人误会的杏菜', sceneDescription: '八奈见与温水共同出现在第二卷开篇附近，画面延续两人饭友与同盟般的互动。', sceneType: 'dialogue', sourceChapter: '第 2 卷 1 败目', excerptId: 'excerpt-v2-006', descriptionReviewStatus: 'verified' },
  { artworkId: 'sss-002', characterIds: ['yanami'], title: 'SSS 彩页中的杏菜', sceneDescription: '八奈见杏菜在特典集彩页中作为轻小说氛围的第一视觉出现。', sceneType: 'special', sourceChapter: 'SSS 卷首彩页', excerptId: 'excerpt-sss-002', descriptionReviewStatus: 'verified' },

  { artworkId: 'v2-002', characterIds: ['yakishio'], title: '柠檬的盛夏主视觉', sceneDescription: '烧盐柠檬以第二卷彩页主视觉登场，运动系的明快感成为画面中心。', sceneType: 'portrait', sourceChapter: '第 2 卷卷首彩页', excerptId: 'excerpt-v2-002', descriptionReviewStatus: 'verified' },
  { artworkId: 'v1-012', characterIds: ['yakishio'], title: '约定好的败北', sceneDescription: '烧盐柠檬的黑白特写强调她直率的神情，也预示青梅竹马恋情的失衡。', sceneType: 'portrait', sourceChapter: '第 1 卷 2 败目', excerptId: 'excerpt-v1-012', descriptionReviewStatus: 'verified' },
  { artworkId: 'v1-013', characterIds: ['yakishio'], title: '田径部更衣室前', sceneDescription: '烧盐柠檬拿着毛巾和运动包，画面集中在她作为田径部王牌的日常。', sceneType: 'school', sourceChapter: '第 1 卷 2 败目', excerptId: 'excerpt-v1-013', descriptionReviewStatus: 'verified' },
  { artworkId: 'v3-010', characterIds: ['yakishio', 'nukumizu'], title: '被众人围住的柠檬', sceneDescription: '烧盐柠檬被同学围住，温水从旁观察，运动少女的社交中心感被放大。', sceneType: 'school', sourceChapter: '第 3 卷正文', excerptId: 'excerpt-v3-010', descriptionReviewStatus: 'verified' },
  { artworkId: 'v5-003', characterIds: ['yakishio', 'nukumizu'], title: '水边的陪伴', sceneDescription: '烧盐柠檬与温水同框，画面以开阔背景呈现两人关系中不急于命名的陪伴。', sceneType: 'relationship', sourceChapter: '第 5 卷卷首彩页', excerptId: 'excerpt-v5-003', descriptionReviewStatus: 'verified' },
  { artworkId: 'v5-012', characterIds: ['yakishio'], title: '全速力地后退', sceneDescription: '烧盐柠檬的黑白图以奔跑感和停顿感并置，表现她面对感情时的迟疑。', sceneType: 'relationship', sourceChapter: '第 5 卷 2 败目', excerptId: 'excerpt-v5-012', descriptionReviewStatus: 'verified' },
  { artworkId: 'v6-015', characterIds: ['yakishio', 'yanami'], title: '名为烧盐柠檬的少女', sceneDescription: '围绕烧盐柠檬的黑白插画，画面把她的开朗外壳与内心告别感放在同一页。', sceneType: 'relationship', sourceChapter: '第 6 卷 4 败目', excerptId: 'excerpt-v6-015', descriptionReviewStatus: 'verified' },

  { artworkId: 'v3-002', characterIds: ['komari'], title: '小鞠的卷首主视觉', sceneDescription: '小鞠知花以第三卷彩页主视觉登场，安静姿态和文艺部气质成为画面中心。', sceneType: 'portrait', sourceChapter: '第 3 卷卷首彩页', excerptId: 'excerpt-v3-002', descriptionReviewStatus: 'verified' },
  { artworkId: 'v1-011', characterIds: ['komari', 'nukumizu'], title: '文艺部里的相遇', sceneDescription: '小鞠知花与温水出现在文艺部相关场景中，画面呈现她不擅交流但被卷入对话的状态。', sceneType: 'club', sourceChapter: '第 1 卷正文', excerptId: 'excerpt-v1-011', descriptionReviewStatus: 'verified' },
  { artworkId: 'v1-014', characterIds: ['komari', 'yanami'], title: '慌张的小鞠', sceneDescription: '小鞠知花在近景中慌张回应，八奈见的存在让文艺部日常变得热闹。', sceneType: 'comedy', sourceChapter: '第 1 卷正文', excerptId: 'excerpt-v1-014', descriptionReviewStatus: 'verified' },
  { artworkId: 'v3-007', characterIds: ['komari', 'shikiya'], title: '被志喜屋指导写法', sceneDescription: '志喜屋梦子与小鞠知花同框，画面对应前辈以独特节奏介入小鞠写作的场景。', sceneType: 'club', sourceChapter: '第 3 卷 1 败目', excerptId: 'excerpt-v3-007', descriptionReviewStatus: 'verified' },
  { artworkId: 'v3-011', characterIds: ['komari', 'nukumizu'], title: '醒来的小鞠', sceneDescription: '小鞠知花与温水同框，静态构图强化她在文艺部线中被温水照看的关系。', sceneType: 'club', sourceChapter: '第 3 卷正文', excerptId: 'excerpt-v3-011', descriptionReviewStatus: 'verified' },
  { artworkId: 'v3-014', characterIds: ['komari'], title: '告白前后的知花', sceneDescription: '小鞠知花的核心剧情图，画面围绕她尚未说出口却已被旁人察觉的恋心。', sceneType: 'relationship', sourceChapter: '第 3 卷正文', excerptId: 'excerpt-v3-014', descriptionReviewStatus: 'verified' },
  { artworkId: 'v3-015', characterIds: ['komari', 'nukumizu'], title: '结果责任的文艺部', sceneDescription: '小鞠知花与温水在文艺部线收束处同框，表现她从沉默到承担的变化。', sceneType: 'club', sourceChapter: '第 3 卷 4 败目', excerptId: 'excerpt-v3-015', descriptionReviewStatus: 'verified' },
  { artworkId: 'sss-028', characterIds: ['komari'], title: '小鞠的猫道乐', sceneDescription: 'SSS 插画呈现小鞠知花偏离主线的轻松侧面，用日常兴趣补足人物质感。', sceneType: 'special', sourceChapter: 'SSS 小鞠的猫道乐', excerptId: 'excerpt-sss-028', descriptionReviewStatus: 'verified' },

  { artworkId: 'v2-009', characterIds: ['nukumizu', 'komari'], title: '小说与观察者', sceneDescription: '温水和彦围绕网络小说与文艺部话题展开观察，小鞠的存在让对话转入创作侧。', sceneType: 'club', sourceChapter: '第 2 卷正文', excerptId: 'excerpt-v2-009', descriptionReviewStatus: 'verified' },
  { artworkId: 'v2-014', characterIds: ['nukumizu'], title: '被前辈叫住', sceneDescription: '温水和彦在学校场景里被月之木前辈牵入对话，体现他总被事件卷入的体质。', sceneType: 'school', sourceChapter: '第 2 卷正文', excerptId: 'excerpt-v2-014', descriptionReviewStatus: 'verified' },
  { artworkId: 'v4-011', characterIds: ['nukumizu', 'shikiya'], title: '优しさを少しだけ', sceneDescription: '温水与志喜屋梦子同框，画面聚焦两人难以用普通速度理解的互动。', sceneType: 'relationship', sourceChapter: '第 4 卷 2 败目', excerptId: 'excerpt-v4-011', descriptionReviewStatus: 'verified' },
  { artworkId: 'v4-014', characterIds: ['nukumizu', 'kaju'], title: '给心命名', sceneDescription: '温水和彦与佳树相关的家庭线插画，呈现日常亲密关系中的微妙情绪。', sceneType: 'family', sourceChapter: '第 4 卷 3 败目', excerptId: 'excerpt-v4-014', descriptionReviewStatus: 'verified' },
  { artworkId: 'v5-010', characterIds: ['nukumizu', 'kaju', 'basori'], title: '还算不上互相欺骗', sceneDescription: '温水、佳树与学生会相关人物交错登场，画面把家庭线和学生会线拉到同一张档案纸上。', sceneType: 'relationship', sourceChapter: '第 5 卷 1 败目', excerptId: 'excerpt-v5-010', descriptionReviewStatus: 'verified' },
  { artworkId: 'v7-003', characterIds: ['shiratama', 'nukumizu'], title: '婚礼潜入彩页', sceneDescription: '白玉莉子与温水和彦同框，第七卷婚礼事件的彩色氛围在此展开。', sceneType: 'relationship', sourceChapter: '第 7 卷卷首彩页', excerptId: 'excerpt-v7-003', descriptionReviewStatus: 'verified' },
  { artworkId: 'v7-013', characterIds: ['nukumizu', 'shiratama'], title: '蛇之道交给我', sceneDescription: '温水与白玉莉子围绕潜入计划行动，画面保留事件调查感。', sceneType: 'relationship', sourceChapter: '第 7 卷 3 败目', excerptId: 'excerpt-v7-013', descriptionReviewStatus: 'verified' },
  { artworkId: 'sss-030', characterIds: ['nukumizu', 'yanami'], title: '便利的男人与想见的女人', sceneDescription: 'SSS 插画把温水和八奈见的日常同盟关系压缩成一幕轻喜剧。', sceneType: 'special', sourceChapter: 'SSS 便利な男と会いたい女', excerptId: 'excerpt-sss-030', descriptionReviewStatus: 'verified' },

  { artworkId: 'v8-002', characterIds: ['basori'], title: '天爱星的卷首主视觉', sceneDescription: '马剃天爱星以第八卷彩页主视觉登场，学生会气质和认真表情成为画面中心。', sceneType: 'portrait', sourceChapter: '第 8 卷卷首彩页', excerptId: 'excerpt-v8-002', descriptionReviewStatus: 'verified' },
  { artworkId: 'v3-013', characterIds: ['basori', 'shikiya'], title: '学生会的提前登场', sceneDescription: '马剃天爱星与学生会相关角色在第三卷黑白图中出现，为后续学生会线埋下伏笔。', sceneType: 'school', sourceChapter: '第 3 卷 3 败目', excerptId: 'excerpt-v3-013', descriptionReviewStatus: 'verified' },
  { artworkId: 'v5-011', characterIds: ['basori', 'shikiya'], title: '学生会役员共', sceneDescription: '马剃天爱星与志喜屋梦子同处学生会场景，严肃与脱拍两种气质形成对照。', sceneType: 'school', sourceChapter: '第 5 卷 Intermission', excerptId: 'excerpt-v5-011', descriptionReviewStatus: 'verified' },
  { artworkId: 'v6-012', characterIds: ['basori', 'yakishio'], title: '青くて赤い春', sceneDescription: '马剃天爱星在学生会与运动系角色的交叉场景中出现，画面连接校园规则与青春冲动。', sceneType: 'school', sourceChapter: '第 6 卷 Intermission', excerptId: 'excerpt-v6-012', descriptionReviewStatus: 'verified' },
  { artworkId: 'v8-009', characterIds: ['basori'], title: '断じて下心はありません', sceneDescription: '马剃天爱星在第八卷黑白图中成为视觉中心，认真与慌张感同时出现。', sceneType: 'comedy', sourceChapter: '第 8 卷 1 败目', excerptId: 'excerpt-v8-009', descriptionReviewStatus: 'verified' },
  { artworkId: 'sss-038', characterIds: ['basori', 'shikiya'], title: '介添え役ならお任せを', sceneDescription: 'SSS 插画呈现天爱星与学生会成员的协作侧面，偏向轻松番外。', sceneType: 'special', sourceChapter: 'SSS 介添え役ならお任せを', excerptId: 'excerpt-sss-038', descriptionReviewStatus: 'verified' },
  { artworkId: 'sss-039', characterIds: ['basori', 'shikiya'], title: '介添え役ならお任せを 侧栏', sceneDescription: '窄幅 SSS 插画补充天爱星与学生会线的版式资料，作为人物档案的边栏素材。', sceneType: 'special', sourceChapter: 'SSS 介添え役ならお任せを', excerptId: 'excerpt-sss-039', descriptionReviewStatus: 'verified' },

  { artworkId: 'v5-002', characterIds: ['kaju'], title: '佳树的卷首主视觉', sceneDescription: '温水佳树以第五卷彩页主视觉登场，完美妹妹形象被推到视觉中心。', sceneType: 'portrait', sourceChapter: '第 5 卷卷首彩页', excerptId: 'excerpt-v5-002', descriptionReviewStatus: 'verified' },
  { artworkId: 'v2-007', characterIds: ['kaju', 'yanami', 'nukumizu'], title: '温水家的作业现场', sceneDescription: '佳树、八奈见与温水同框，家庭空间里混入外来同学，日常秩序被轻轻搅动。', sceneType: 'family', sourceChapter: '第 2 卷正文', excerptId: 'excerpt-v2-007', descriptionReviewStatus: 'verified' },
  { artworkId: 'v3-008', characterIds: ['kaju'], title: '姫宫华恋登场前后', sceneDescription: '佳树在第三卷家庭与学校关系线中出现，画面强调她对哥哥社交状态的敏锐。', sceneType: 'family', sourceChapter: '第 3 卷 2 败目', excerptId: 'excerpt-v3-008', descriptionReviewStatus: 'verified' },
  { artworkId: 'v3-012', characterIds: ['kaju', 'yanami'], title: '浮かれる佳树', sceneDescription: '佳树兴奋地后退行走，八奈见也出现在同一段日常里，轻喜剧节奏鲜明。', sceneType: 'comedy', sourceChapter: '第 3 卷正文', excerptId: 'excerpt-v3-012', descriptionReviewStatus: 'verified' },
  { artworkId: 'v4-010', characterIds: ['kaju', 'shikiya', 'yanami'], title: '咖啡与蛋糕的嗅觉', sceneDescription: '佳树在家庭空间中敏锐察觉他人气息，志喜屋和八奈见相关事件被牵进日常。', sceneType: 'family', sourceChapter: '第 4 卷正文', excerptId: 'excerpt-v4-010', descriptionReviewStatus: 'verified' },
  { artworkId: 'v4-016', characterIds: ['kaju'], title: '十六岁的序章', sceneDescription: '佳树线的黑白插画，聚焦她与成长、家庭位置相关的变化。', sceneType: 'family', sourceChapter: '第 4 卷 4 败目', excerptId: 'excerpt-v4-016', descriptionReviewStatus: 'verified' },
  { artworkId: 'v8-016', characterIds: ['kaju', 'nukumizu'], title: '替佳树盖上被子', sceneDescription: '温水替佳树盖好被子，画面突出兄妹日常中安静而亲密的一面。', sceneType: 'family', sourceChapter: '第 8 卷正文', excerptId: 'excerpt-v8-016', descriptionReviewStatus: 'verified' },

  { artworkId: 'v4-002', characterIds: ['shikiya'], title: '梦子的卷首主视觉', sceneDescription: '志喜屋梦子以第四卷彩页主视觉登场，苍白的丧尸系气质成为页面焦点。', sceneType: 'portrait', sourceChapter: '第 4 卷卷首彩页', excerptId: 'excerpt-v4-002', descriptionReviewStatus: 'verified' },
  { artworkId: 'v3-006', characterIds: ['shikiya', 'yanami', 'komari'], title: '志喜屋来照顾人', sceneDescription: '志喜屋梦子在第三卷开篇附近出现，她的脱拍存在感影响文艺部众人。', sceneType: 'club', sourceChapter: '第 3 卷 1 败目', excerptId: 'excerpt-v3-006', descriptionReviewStatus: 'verified' },
  { artworkId: 'v2-008', characterIds: ['shikiya'], title: '无人中庭的梦子', sceneDescription: '志喜屋梦子在中庭自动贩卖机附近出现，低人气场景强化她幽灵般的登场方式。', sceneType: 'school', sourceChapter: '第 2 卷正文', excerptId: 'excerpt-v2-008', descriptionReviewStatus: 'verified' },
  { artworkId: 'v4-012', characterIds: ['shikiya', 'yanami'], title: '突然失速的教室', sceneDescription: '志喜屋相关事件让教室气氛突然变化，八奈见也被卷入这段学生会支线。', sceneType: 'school', sourceChapter: '第 4 卷正文', excerptId: 'excerpt-v4-012', descriptionReviewStatus: 'verified' },
  { artworkId: 'v5-017', characterIds: ['shikiya'], title: '别向别人买东西', sceneDescription: '志喜屋梦子递出物品并以慢半拍的方式提醒对方，人物的奇妙善意十分突出。', sceneType: 'dialogue', sourceChapter: '第 5 卷正文', excerptId: 'excerpt-v5-017', descriptionReviewStatus: 'verified' },
  { artworkId: 'sss-047', characterIds: ['shikiya'], title: '手冷的人心很暖', sceneDescription: 'SSS 插画补足志喜屋梦子的番外日常，标题本身延续她难以捉摸的氛围。', sceneType: 'special', sourceChapter: 'SSS 手が冷たい人は心が温かいのなら、手が温かい人は（以下略）', excerptId: 'excerpt-sss-047', descriptionReviewStatus: 'verified' },

  { artworkId: 'v7-002', characterIds: ['shiratama'], title: '莉子的卷首主视觉', sceneDescription: '白玉莉子以第七卷彩页主视觉登场，可爱外表与事件核心身份形成反差。', sceneType: 'portrait', sourceChapter: '第 7 卷卷首彩页', excerptId: 'excerpt-v7-002', descriptionReviewStatus: 'verified' },
  { artworkId: 'v7-010', characterIds: ['shiratama', 'nukumizu', 'yanami', 'komari'], title: '其实我和这个人', sceneDescription: '白玉莉子把温水卷入伪装关系，八奈见与小鞠也被牵入第七卷的婚礼事件。', sceneType: 'relationship', sourceChapter: '第 7 卷 2 败目', excerptId: 'excerpt-v7-010', descriptionReviewStatus: 'verified' },
  { artworkId: 'v7-011', characterIds: ['shiratama', 'nukumizu'], title: '鼓起脸抱住手臂', sceneDescription: '白玉莉子抱住温水手臂并露出不满表情，画面强调她主动推进计划的行动力。', sceneType: 'relationship', sourceChapter: '第 7 卷正文', excerptId: 'excerpt-v7-011', descriptionReviewStatus: 'verified' },
  { artworkId: 'v7-014', characterIds: ['shiratama', 'yanami'], title: '莉子的复仇大作战', sceneDescription: '白玉莉子相关事件进入核心阶段，八奈见的参与让潜入计划呈现群像喜剧感。', sceneType: 'relationship', sourceChapter: '第 7 卷 4 败目', excerptId: 'excerpt-v7-014', descriptionReviewStatus: 'verified' },
  { artworkId: 'v7-015', characterIds: ['shiratama', 'yanami'], title: '伪白玉与八奈见', sceneDescription: '八奈见参与白玉莉子的伪装计划，画面用误认和替身制造第七卷的喜剧张力。', sceneType: 'comedy', sourceChapter: '第 7 卷正文', excerptId: 'excerpt-v7-015', descriptionReviewStatus: 'verified' },
  { artworkId: 'v7-016', characterIds: ['shiratama'], title: '被相机切下的一瞬', sceneDescription: '白玉莉子相关的关键瞬间被相机定格，插画服务于婚礼事件的调查线。', sceneType: 'relationship', sourceChapter: '第 7 卷正文', excerptId: 'excerpt-v7-016', descriptionReviewStatus: 'verified' },
  { artworkId: 'v7-017', characterIds: ['shiratama', 'nukumizu'], title: '婚礼会场走廊', sceneDescription: '白玉莉子与温水行动到婚礼会场走廊，场景从校园日常切换为事件现场。', sceneType: 'relationship', sourceChapter: '第 7 卷正文', excerptId: 'excerpt-v7-017', descriptionReviewStatus: 'verified' },
  { artworkId: 'v7-018', characterIds: ['shiratama', 'komari', 'yanami'], title: '小鞠出现', sceneDescription: '白玉莉子事件中小鞠知花现身，八奈见等人共同构成第七卷后段群像。', sceneType: 'relationship', sourceChapter: '第 7 卷正文', excerptId: 'excerpt-v7-018', descriptionReviewStatus: 'verified' },
  { artworkId: 'v8-003', characterIds: ['basori', 'nukumizu'], title: '第八卷学生会彩页', sceneDescription: '马剃天爱星与温水和彦同框，第八卷把学生会、补习和微妙距离推到彩色主视觉中。', sceneType: 'relationship', sourceChapter: '第 8 卷卷首彩页', excerptId: 'excerpt-v8-003', descriptionReviewStatus: 'verified' },
  { artworkId: 'sss-004', characterIds: ['yanami', 'yakishio', 'komari'], title: 'SSS 败犬群像彩页', sceneDescription: '八奈见杏菜、烧盐柠檬与小鞠知花在 SSS 彩页中并列，作为三位核心败犬女主的番外群像。', sceneType: 'special', sourceChapter: 'SSS 卷首彩页', excerptId: 'excerpt-sss-004', descriptionReviewStatus: 'verified' },
];

const artworkReviewById = new Map(artworkReviews.map((review) => [review.artworkId, review]));

function animeProfile(characterId: CharacterId, voiceActor: string): CharacterAnimeProfile {
  if (characterId === 'shiratama') {
    return { status: 'not-covered', voiceActor, videos: [], checkedAt: '2026-07-17' };
  }
  const characterVideos: Partial<Record<CharacterId, CharacterAnimeProfile['videos']>> = {
    yanami: [
      { title: '八奈见杏菜 角色 PV', youtubeId: 'BFomb64KX90', sourceUrl: 'https://www.youtube.com/watch?v=BFomb64KX90' },
      { title: '八奈见杏菜 ED', youtubeId: '2czbGCYz6gk', sourceUrl: 'https://www.youtube.com/watch?v=2czbGCYz6gk' },
    ],
    yakishio: [
      { title: '烧盐柠檬 角色 PV', youtubeId: 'a__tfXSewKM', sourceUrl: 'https://www.youtube.com/watch?v=a__tfXSewKM' },
      { title: '烧盐柠檬 ED', youtubeId: 'GyckNS-qOcM', sourceUrl: 'https://www.youtube.com/watch?v=GyckNS-qOcM' },
    ],
    komari: [
      { title: '小鞠知花 角色 PV', youtubeId: 'XqxGcq6BYTY', sourceUrl: 'https://www.youtube.com/watch?v=XqxGcq6BYTY' },
      { title: '小鞠知花 ED', youtubeId: 'FYuKV7m_CqM', sourceUrl: 'https://www.youtube.com/watch?v=FYuKV7m_CqM' },
    ],
  };
  return {
    status: 'covered',
    voiceActor,
    officialCharacterUrl: `https://makeine-anime.com/character/${characterId === 'nukumizu' ? 'nukumizu' : characterId}/`,
    videos: characterVideos[characterId] ?? [
      { title: '动画主 PV', youtubeId: 'uytJ6_KTCZI', sourceUrl: 'https://www.youtube.com/watch?v=uytJ6_KTCZI' },
      { title: '官方 OP', youtubeId: '7GJOBkIgWHc', sourceUrl: 'https://www.youtube.com/watch?v=7GJOBkIgWHc' },
    ],
    checkedAt: '2026-07-17',
  };
}

const dossierSeed: Record<CharacterId, Omit<CharacterDossier, 'characterId' | 'externalMedia'>> = {
  yanami: {
    dossierNo: 'MK-001',
    affiliation: '石蕗高中 / 2-C',
    grade: '高中二年级',
    birthday: '11 月 29 日',
    keywords: ['青梅竹马', '便当债', '食欲', '败犬同盟'],
    firstFocusVolumeId: 'v1',
    appearanceVolumeIds: ['v1', 'v2', 'v3', 'v4', 'v6', 'v7', 'sss'],
    anime: animeProfile('yanami', '遠野ひかる'),
    spoilerMode: 'full',
    personalitySummary: '她不是单纯的搞笑吃货。八奈见把挫败说得很吵，也把寂寞藏得很快；正因如此，温水才会一次次被她的日常拉进故事中心。',
    originalDescriptions: [
      { id: 'yanami-desc-1', title: '失恋后的第一现场', zh: '原文把八奈见放在餐桌、便当和大量对话里描写，她的开朗不是无伤，而是把伤口转化为可继续生活的能量。', ja: '～１敗目～ プロ幼馴染 八奈見杏菜の負けっぷり', source: '第 1 卷 1 败目', excerptId: 'excerpt-v1-009', reviewStatus: 'verified' },
      { id: 'yanami-desc-2', title: '告别而不是退场', zh: '她对旧恋情喊出的祝福带着不甘，却不是停在原地的怨言，而是把自己重新推回青春里的宣言。', ja: '勝手に幸せになっちまえ！', source: '第 1 卷 4 败目', excerptId: 'excerpt-v1-018', reviewStatus: 'verified' },
      { id: 'yanami-desc-3', title: '日常同盟', zh: '第二卷以后，她与温水的关系更像互相吐槽的同盟，饭量、债务和秘密共享成为两人日常的节拍器。', ja: '八奈見杏菜は匂わせたい', source: '第 2 卷 1 败目', excerptId: 'excerpt-v2-006', reviewStatus: 'verified' },
    ],
    moments: [
      { id: 'yanami-m1', volumeId: 'v1', artworkId: 'v1-009', title: '餐桌前的败北开场', summary: '八奈见在失恋后与温水产生交集，作品从这一场近乎荒诞的餐桌对话正式进入败犬青春。', excerptId: 'excerpt-v1-009', sourceFile: '第 1 卷 EPUB', reviewStatus: 'verified' },
      { id: 'yanami-m2', volumeId: 'v1', artworkId: 'v1-018', title: '把喜欢的人送向幸福', summary: '她用吵闹的方式向过去告别，也让温水第一次真正看见“败犬”背后的疼痛。', excerptId: 'excerpt-v1-018', sourceFile: '第 1 卷 EPUB', reviewStatus: 'verified' },
      { id: 'yanami-m3', volumeId: 'sss', artworkId: 'sss-030', title: '便利男与想见的女人', summary: '番外把八奈见和温水的日常默契喜剧化，证明两人关系已经成为作品的稳定底色。', excerptId: 'excerpt-sss-030', sourceFile: 'SSS EPUB', reviewStatus: 'verified' },
    ],
    connections: [
      { id: 'yanami-nukumizu', characterId: 'nukumizu', label: '饭友与同盟', description: '从便当债开始，逐渐变成互相吐槽、互相兜底的青春同盟。', source: '第 1 卷至 SSS', reviewStatus: 'verified' },
      { id: 'yanami-yakishio', characterId: 'yakishio', label: '败犬同伴', description: '同为失恋后的女主，她们的相处让“失败”变成可以互相理解的共同语言。', source: '第 1 卷卷首彩页与后续群像', reviewStatus: 'verified' },
      { id: 'yanami-komari', characterId: 'komari', label: '文艺部日常', description: '八奈见的外向与小鞠的畏缩形成强烈反差，常常把文艺部空气搅热。', source: '第 1 卷、第 7 卷', reviewStatus: 'verified' },
    ],
    artworkSections: { hero: ['v1-002', 'sss-002'], monochrome: ['v1-009', 'v1-010', 'v1-018', 'v2-006'], ensemble: ['v1-003', 'v1-005', 'v2-007', 'v7-010', 'v7-015', 'sss-004'], archive: ['sss-030'] },
  },
  yakishio: {
    dossierNo: 'MK-002',
    affiliation: '石蕗高中 / 田径部',
    grade: '高中二年级',
    birthday: '8 月 1 日',
    keywords: ['田径王牌', '盛夏', '青梅竹马', '直率'],
    firstFocusVolumeId: 'v1',
    appearanceVolumeIds: ['v1', 'v2', 'v3', 'v5', 'v6', 'v8', 'sss'],
    anime: animeProfile('yakishio', '若山詩音'),
    spoilerMode: 'full',
    personalitySummary: '烧盐的魅力在于她永远先行动再解释。她跑得快，说话直，受伤时也很难停下，这让她的感情线带着明亮的疼。',
    originalDescriptions: [
      { id: 'yakishio-desc-1', title: '运动少女的日常', zh: '原文常把她放在田径部、毛巾、运动包和奔跑场景里，身体性与速度感是她最鲜明的叙事标签。', ja: '焼塩はタオルで身体を拭きながらスポーツバッグを覗き込んできた。', source: '第 1 卷 2 败目', excerptId: 'excerpt-v1-013', reviewStatus: 'verified' },
      { id: 'yakishio-desc-2', title: '没有绕路的感情', zh: '她的恋情失败不是因为不够真诚，而是因为太习惯向前冲，直到必须面对自己已经错过。', ja: '約束された敗北を君に 焼塩檸檬', source: '第 1 卷 2 败目', excerptId: 'excerpt-v1-012', reviewStatus: 'verified' },
      { id: 'yakishio-desc-3', title: '告别的季节', zh: '第六卷把烧盐的形象重新收束：她不只是元气角色，也是会在告别中学会停下的人。', ja: '焼塩檸檬という女', source: '第 6 卷 4 败目', excerptId: 'excerpt-v6-015', reviewStatus: 'verified' },
    ],
    moments: [
      { id: 'yakishio-m1', volumeId: 'v1', artworkId: 'v1-012', title: '约定好的败北', summary: '烧盐的青梅竹马线展开，读者看见她明亮个性背后无可避免的失败。', excerptId: 'excerpt-v1-012', sourceFile: '第 1 卷 EPUB', reviewStatus: 'verified' },
      { id: 'yakishio-m2', volumeId: 'v5', artworkId: 'v5-003', title: '水边的陪伴', summary: '温水与烧盐的距离不再只是旁观和帮助，而是进入更微妙的互相理解。', excerptId: 'excerpt-v5-003', sourceFile: '第 5 卷 EPUB', reviewStatus: 'verified' },
      { id: 'yakishio-m3', volumeId: 'v6', artworkId: 'v6-015', title: '名为烧盐柠檬的少女', summary: '第六卷后段重新审视烧盐，让她从“跑得最快的人”变成能面对告别的人。', excerptId: 'excerpt-v6-015', sourceFile: '第 6 卷 EPUB', reviewStatus: 'verified' },
    ],
    connections: [
      { id: 'yakishio-nukumizu', characterId: 'nukumizu', label: '旁观者与陪跑者', description: '温水常常站在烧盐奔跑轨迹旁边，既被她拖动，也替她保存停下来的瞬间。', source: '第 1、5、6 卷', reviewStatus: 'verified' },
      { id: 'yakishio-yanami', characterId: 'yanami', label: '败犬同盟', description: '两人同样失恋，却一个像夏日跑道，一个像饭桌吵闹，互相映照。', source: '第 1 卷卷首彩页', reviewStatus: 'verified' },
      { id: 'yakishio-komari', characterId: 'komari', label: '文艺部群像', description: '她的外向与小鞠的内向构成败犬群像的两端。', source: '第 1 卷、第 6 卷', reviewStatus: 'verified' },
    ],
    artworkSections: { hero: ['v2-002'], monochrome: ['v1-012', 'v1-013', 'v3-010', 'v5-012', 'v6-015'], ensemble: ['v1-003', 'v1-005', 'v5-003', 'v6-012', 'sss-004'], archive: [] },
  },
  komari: {
    dossierNo: 'MK-003',
    affiliation: '石蕗高中 / 文艺部',
    grade: '高中二年级',
    birthday: '3 月 29 日',
    keywords: ['怕生', '写作', '手机交流', '文艺部'],
    firstFocusVolumeId: 'v3',
    appearanceVolumeIds: ['v1', 'v2', 'v3', 'v6', 'v7', 'sss'],
    anime: animeProfile('komari', '寺澤百花'),
    spoilerMode: 'full',
    personalitySummary: '小鞠最动人的地方是她的“慢”。她说不出口，却不是没有话；她躲在人群后面，却始终在用自己的方式靠近故事。',
    originalDescriptions: [
      { id: 'komari-desc-1', title: '用文字替自己说话', zh: '原文多次让小鞠通过文字、手机和断续的话语表达自己，畏缩感不是缺陷，而是她与世界保持距离的方式。', ja: '書き方……教えようとしたら……そこの少女……逃げ出した', source: '第 3 卷 1 败目', excerptId: 'excerpt-v3-007', reviewStatus: 'verified' },
      { id: 'komari-desc-2', title: '被看见的恋心', zh: '第三卷明确揭开小鞠的暗恋，她的失败不是闹剧，而是文艺部线真正成熟的起点。', ja: '小鞠ちゃんが告白する前から、慎太郎のことを好きだって知ってたわ。', source: '第 3 卷正文', excerptId: 'excerpt-v3-014', reviewStatus: 'verified' },
      { id: 'komari-desc-3', title: '承担结果', zh: '到了第三卷结尾，小鞠不再只是被保护的人，她开始承担选择留下来的后果。', ja: '結果責任についての話をしようか', source: '第 3 卷 4 败目', excerptId: 'excerpt-v3-015', reviewStatus: 'verified' },
    ],
    moments: [
      { id: 'komari-m1', volumeId: 'v1', artworkId: 'v1-011', title: '文艺部里的初始位置', summary: '小鞠以文艺部成员身份进入温水的视野，沉默和防御感构成她最初的轮廓。', excerptId: 'excerpt-v1-011', sourceFile: '第 1 卷 EPUB', reviewStatus: 'verified' },
      { id: 'komari-m2', volumeId: 'v3', artworkId: 'v3-014', title: '告白之前已经被知道', summary: '第三卷让小鞠的恋心浮出水面，她的失败被写成一场迟到但真切的成长。', excerptId: 'excerpt-v3-014', sourceFile: '第 3 卷 EPUB', reviewStatus: 'verified' },
      { id: 'komari-m3', volumeId: 'v3', artworkId: 'v3-015', title: '结果责任', summary: '文艺部线收束时，小鞠开始面对自己的选择，也让温水的位置从旁观变成共同承担。', excerptId: 'excerpt-v3-015', sourceFile: '第 3 卷 EPUB', reviewStatus: 'verified' },
    ],
    connections: [
      { id: 'komari-nukumizu', characterId: 'nukumizu', label: '文艺部搭档', description: '温水是她从沉默走向表达时最常见的见证人。', source: '第 1、3 卷', reviewStatus: 'verified' },
      { id: 'komari-shikiya', characterId: 'shikiya', label: '前辈式干预', description: '志喜屋以独特节奏介入小鞠的写作和社交，带来不稳定但有效的推动。', source: '第 3 卷', reviewStatus: 'verified' },
      { id: 'komari-yanami', characterId: 'yanami', label: '反差日常', description: '八奈见的热闹让小鞠的安静更突出，也让文艺部群像更完整。', source: '第 1、7 卷', reviewStatus: 'verified' },
    ],
    artworkSections: { hero: ['v3-002'], monochrome: ['v1-011', 'v1-014', 'v3-007', 'v3-011', 'v3-014', 'v3-015', 'sss-028'], ensemble: ['v1-004', 'v1-005', 'v7-010', 'v7-018', 'sss-004'], archive: ['v2-009'] },
  },
  nukumizu: {
    dossierNo: 'MK-000',
    affiliation: '石蕗高中 / 文艺部',
    grade: '高中二年级',
    birthday: '12 月 25 日',
    keywords: ['观察者', '吐槽役', '小说', '被卷入体质'],
    firstFocusVolumeId: 'v1',
    appearanceVolumeIds: ['v1', 'v2', 'v3', 'v4', 'v5', 'v7', 'v8', 'sss'],
    anime: animeProfile('nukumizu', '梅田修一朗'),
    spoilerMode: 'full',
    personalitySummary: '温水不是传统意义上主动发光的男主。他更像档案管理员：看见、记录、吐槽，然后在别人快要跌倒时伸手。',
    originalDescriptions: [
      { id: 'nukumizu-desc-1', title: '旁观者被拉进中心', zh: '温水本想维持背景角色的位置，但八奈见的失败让他第一次成为他人青春的现场证人。', ja: 'プロ幼馴染 八奈見杏菜の負けっぷり', source: '第 1 卷 1 败目', excerptId: 'excerpt-v1-009', reviewStatus: 'verified' },
      { id: 'nukumizu-desc-2', title: '文艺部的连接点', zh: '小鞠、八奈见、烧盐、学生会线都通过温水发生交错，他的普通感反而让复杂关系可以落地。', ja: '結果責任についての話をしようか', source: '第 3 卷 4 败目', excerptId: 'excerpt-v3-015', reviewStatus: 'verified' },
      { id: 'nukumizu-desc-3', title: '事件体质', zh: '第七卷婚礼潜入进一步证明，温水越想站在旁边，越会成为问题儿童们借力的位置。', ja: '蛇の道でしたらお任せを', source: '第 7 卷 3 败目', excerptId: 'excerpt-v7-013', reviewStatus: 'verified' },
    ],
    moments: [
      { id: 'nukumizu-m1', volumeId: 'v1', artworkId: 'v1-018', title: '见证八奈见的告别', summary: '温水在屋顶见证八奈见告别旧恋情，旁观者从此被赋予陪伴的职责。', excerptId: 'excerpt-v1-018', sourceFile: '第 1 卷 EPUB', reviewStatus: 'verified' },
      { id: 'nukumizu-m2', volumeId: 'v5', artworkId: 'v5-003', title: '与烧盐的水边时间', summary: '烧盐线中，温水的陪伴不急着下定义，却让对方能够面对自己的情绪。', excerptId: 'excerpt-v5-003', sourceFile: '第 5 卷 EPUB', reviewStatus: 'verified' },
      { id: 'nukumizu-m3', volumeId: 'v7', artworkId: 'v7-013', title: '被白玉拖进事件', summary: '白玉莉子的计划把温水带入婚礼现场，他的吐槽和判断成为事件推进的轴。', excerptId: 'excerpt-v7-013', sourceFile: '第 7 卷 EPUB', reviewStatus: 'verified' },
    ],
    connections: [
      { id: 'nukumizu-yanami', characterId: 'yanami', label: '日常同盟', description: '八奈见让温水从背景走向故事入口。', source: '第 1 卷起', reviewStatus: 'verified' },
      { id: 'nukumizu-kaju', characterId: 'kaju', label: '兄妹', description: '佳树是温水日常里最稳定也最危险的秩序维护者。', source: '第 4、5、8 卷', reviewStatus: 'verified' },
      { id: 'nukumizu-shiratama', characterId: 'shiratama', label: '社长与问题新生', description: '白玉把温水的旁观习惯强行变成行动方案。', source: '第 7 卷', reviewStatus: 'verified' },
    ],
    artworkSections: { hero: ['v5-003'], monochrome: ['v1-018', 'v2-014', 'v3-011', 'v4-011', 'v5-010', 'v7-013', 'sss-030'], ensemble: ['v2-006', 'v2-007', 'v5-003', 'v7-003', 'v7-010'], archive: ['v8-016'] },
  },
  basori: {
    dossierNo: 'MK-008',
    affiliation: '石蕗高中 / 学生会',
    grade: '高中二年级',
    birthday: '未在本站收录卷中确认',
    keywords: ['学生会', '认真', '补习', '第八卷焦点'],
    firstFocusVolumeId: 'v8',
    appearanceVolumeIds: ['v3', 'v5', 'v6', 'v8', 'sss'],
    anime: animeProfile('basori', '諸星すみれ'),
    spoilerMode: 'full',
    personalitySummary: '天爱星的可爱不在软，而在硬。她认真到不懂退路，越想把事情做好，越容易暴露青春里笨拙的一面。',
    originalDescriptions: [
      { id: 'basori-desc-1', title: '学生会的秩序感', zh: '早期插画把她放在学生会线里，严肃姿态和周围角色的脱拍形成鲜明对照。', ja: '生徒会役員共', source: '第 5 卷 Intermission', excerptId: 'excerpt-v5-011', reviewStatus: 'verified' },
      { id: 'basori-desc-2', title: '认真与慌张并存', zh: '第八卷开始聚焦天爱星，她的认真并不冷硬，反而常因太在意正确而显得慌张。', ja: '断じて下心はありません', source: '第 8 卷 1 败目', excerptId: 'excerpt-v8-009', reviewStatus: 'verified' },
      { id: 'basori-desc-3', title: '学生会群像', zh: '她与志喜屋等学生会成员的组合，让学生会线从功能组织变成有喜剧节奏的人物群。', ja: '介添え役ならお任せを', source: 'SSS', excerptId: 'excerpt-sss-038', reviewStatus: 'verified' },
    ],
    moments: [
      { id: 'basori-m1', volumeId: 'v5', artworkId: 'v5-011', title: '学生会役员共', summary: '天爱星在学生会群像中确立严肃认真担当的位置。', excerptId: 'excerpt-v5-011', sourceFile: '第 5 卷 EPUB', reviewStatus: 'verified' },
      { id: 'basori-m2', volumeId: 'v8', artworkId: 'v8-009', title: '第八卷焦点启动', summary: '第八卷将她推到中心，补习、学生会和与温水的距离成为主要看点。', excerptId: 'excerpt-v8-009', sourceFile: '第 8 卷 EPUB', reviewStatus: 'verified' },
      { id: 'basori-m3', volumeId: 'sss', artworkId: 'sss-038', title: '介添え役ならお任せを', summary: '番外补足她在学生会日常中的协作与喜剧面。', excerptId: 'excerpt-sss-038', sourceFile: 'SSS EPUB', reviewStatus: 'verified' },
    ],
    connections: [
      { id: 'basori-nukumizu', characterId: 'nukumizu', label: '补习与误会', description: '温水成为她认真生活里意外出现的变量。', source: '第 8 卷', reviewStatus: 'verified' },
      { id: 'basori-shikiya', characterId: 'shikiya', label: '学生会同僚', description: '严肃的天爱星与脱拍的志喜屋互为对照，学生会线因此更有层次。', source: '第 5 卷、SSS', reviewStatus: 'verified' },
      { id: 'basori-yakishio', characterId: 'yakishio', label: '校园交叉线', description: '学生会与田径部的交叉让天爱星的规则感碰上烧盐的行动力。', source: '第 6 卷', reviewStatus: 'verified' },
    ],
    artworkSections: { hero: ['v8-002'], monochrome: ['v3-013', 'v5-011', 'v6-012', 'v8-009', 'sss-038', 'sss-039'], ensemble: ['v5-010'], archive: [] },
  },
  kaju: {
    dossierNo: 'MK-F01',
    affiliation: '桃园国中 / 温水家',
    grade: '国中三年级',
    birthday: '6 月 6 日',
    keywords: ['妹妹', '家务万能', '兄控', '秩序'],
    firstFocusVolumeId: 'v5',
    appearanceVolumeIds: ['v1', 'v2', 'v3', 'v4', 'v5', 'v8', 'sss'],
    anime: animeProfile('kaju', '田中美海'),
    spoilerMode: 'full',
    personalitySummary: '佳树像温水日常的管理系统。她聪明、周到、行动力强，但所有能力最终都会绕回一个中心：哥哥。',
    originalDescriptions: [
      { id: 'kaju-desc-1', title: '家庭秩序的维护者', zh: '佳树的描写常与家务、作业、房间和哥哥生活习惯相连，她让温水的私人空间变得有秩序。', ja: '私は構わないけど。宿題かなにかなの？', source: '第 2 卷正文', excerptId: 'excerpt-v2-007', reviewStatus: 'verified' },
      { id: 'kaju-desc-2', title: '敏锐的妹妹', zh: '她能迅速察觉哥哥身边的女性气息，这种夸张敏锐感构成佳树线的主要喜剧张力。', ja: '女性の香りがします', source: '第 4 卷正文', excerptId: 'excerpt-v4-010', reviewStatus: 'verified' },
      { id: 'kaju-desc-3', title: '安静的亲密', zh: '第八卷的家庭片段更柔和，佳树与温水的兄妹关系在照顾与被照顾之间展开。', ja: '俺は佳樹に布団をかける', source: '第 8 卷正文', excerptId: 'excerpt-v8-016', reviewStatus: 'verified' },
    ],
    moments: [
      { id: 'kaju-m1', volumeId: 'v2', artworkId: 'v2-007', title: '温水家的作业现场', summary: '八奈见进入温水家，佳树的家庭秩序与哥哥的社交变化第一次正面碰撞。', excerptId: 'excerpt-v2-007', sourceFile: '第 2 卷 EPUB', reviewStatus: 'verified' },
      { id: 'kaju-m2', volumeId: 'v5', artworkId: 'v5-002', title: '第五卷主视觉', summary: '第五卷将佳树推到彩页中心，妹妹线从日常调味转向更明确的档案主题。', excerptId: 'excerpt-v5-002', sourceFile: '第 5 卷 EPUB', reviewStatus: 'verified' },
      { id: 'kaju-m3', volumeId: 'v8', artworkId: 'v8-016', title: '替佳树盖上被子', summary: '温水照顾佳树的安静片段，让兄妹关系从夸张喜剧回到温柔日常。', excerptId: 'excerpt-v8-016', sourceFile: '第 8 卷 EPUB', reviewStatus: 'verified' },
    ],
    connections: [
      { id: 'kaju-nukumizu', characterId: 'nukumizu', label: '兄妹', description: '她把哥哥视为生活核心，也让温水最私人化的一面被读者看见。', source: '第 2、4、5、8 卷', reviewStatus: 'verified' },
      { id: 'kaju-yanami', characterId: 'yanami', label: '闯入家庭的人', description: '八奈见的到来让佳树开始审视哥哥身边的人际关系。', source: '第 2 卷', reviewStatus: 'verified' },
      { id: 'kaju-komari', characterId: 'komari', label: '家庭线与文艺部线', description: '两人同框时，妹妹线和文艺部线短暂交汇。', source: '第 1 卷卷首彩页', reviewStatus: 'verified' },
    ],
    artworkSections: { hero: ['v5-002'], monochrome: ['v2-007', 'v3-008', 'v3-012', 'v4-010', 'v4-014', 'v4-016', 'v8-016'], ensemble: ['v1-004', 'v5-010'], archive: [] },
  },
  shikiya: {
    dossierNo: 'MK-SC2',
    affiliation: '石蕗高中 / 学生会',
    grade: '高中三年级',
    birthday: '未在本站收录卷中确认',
    keywords: ['学生会', '丧尸系', '慢半拍', '直球'],
    firstFocusVolumeId: 'v4',
    appearanceVolumeIds: ['v2', 'v3', 'v4', 'v5', 'sss'],
    anime: animeProfile('shikiya', '安済知佳'),
    spoilerMode: 'full',
    personalitySummary: '志喜屋像一段延迟加载的台词。她行动慢、语速慢，却经常把别人绕开的真心直接放到桌面上。',
    originalDescriptions: [
      { id: 'shikiya-desc-1', title: '无人中庭的登场方式', zh: '她常被安排在空旷、低人气的地点出现，像从校园角落里慢慢浮出来的异常事件。', ja: '人気のない中庭の自販機の陰。', source: '第 2 卷正文', excerptId: 'excerpt-v2-008', reviewStatus: 'verified' },
      { id: 'shikiya-desc-2', title: '照顾人的前辈', zh: '第三卷中她以奇妙方式介入小鞠的写作，虽然节奏脱拍，却确实推动了对方。', ja: '志喜屋夢子はお世話します', source: '第 3 卷 1 败目', excerptId: 'excerpt-v3-006', reviewStatus: 'verified' },
      { id: 'shikiya-desc-3', title: '慢半拍的善意', zh: '第五卷的提醒台词把她的怪异和善意放在一起，说明她并非难以接近，只是表达路径不同。', ja: 'これあげるから……人から買っちゃ……ダメだよ……？', source: '第 5 卷正文', excerptId: 'excerpt-v5-017', reviewStatus: 'verified' },
    ],
    moments: [
      { id: 'shikiya-m1', volumeId: 'v3', artworkId: 'v3-006', title: '梦子来照顾人', summary: '志喜屋用独特方式介入文艺部，将小鞠的写作线推向新的方向。', excerptId: 'excerpt-v3-006', sourceFile: '第 3 卷 EPUB', reviewStatus: 'verified' },
      { id: 'shikiya-m2', volumeId: 'v4', artworkId: 'v4-002', title: '第四卷主视觉', summary: '第四卷将志喜屋的丧尸系气质放到彩页中心，正式把学生会线推到前台。', excerptId: 'excerpt-v4-002', sourceFile: '第 4 卷 EPUB', reviewStatus: 'verified' },
      { id: 'shikiya-m3', volumeId: 'v5', artworkId: 'v5-017', title: '别向别人买', summary: '她用慢半拍的提醒表达善意，让人物从“神秘”变成可被理解的前辈。', excerptId: 'excerpt-v5-017', sourceFile: '第 5 卷 EPUB', reviewStatus: 'verified' },
    ],
    connections: [
      { id: 'shikiya-nukumizu', characterId: 'nukumizu', label: '不稳定距离', description: '温水很难预测她，却能读出她脱拍行动背后的善意。', source: '第 4、5 卷', reviewStatus: 'verified' },
      { id: 'shikiya-komari', characterId: 'komari', label: '前辈与后辈', description: '志喜屋以反常规方式照顾小鞠，成为文艺部线的重要外力。', source: '第 3 卷', reviewStatus: 'verified' },
      { id: 'shikiya-basori', characterId: 'basori', label: '学生会同僚', description: '一个慢半拍，一个过分认真，学生会线因此有了稳定反差。', source: '第 5 卷、SSS', reviewStatus: 'verified' },
    ],
    artworkSections: { hero: ['v4-002'], monochrome: ['v2-008', 'v3-006', 'v3-007', 'v4-011', 'v5-011', 'v5-017', 'sss-047'], ensemble: ['v4-010', 'v4-012', 'sss-038', 'sss-039'], archive: [] },
  },
  shiratama: {
    dossierNo: 'MK-007',
    affiliation: '石蕗高中 / 文艺部',
    grade: '高中一年级',
    birthday: '未在本站收录卷中确认',
    keywords: ['文艺部新生', '婚礼事件', '伪装关系', '问题儿童'],
    firstFocusVolumeId: 'v7',
    appearanceVolumeIds: ['v7', 'v8'],
    anime: animeProfile('shiratama', '动画第一季尚未覆盖'),
    spoilerMode: 'full',
    personalitySummary: '白玉莉子的档案必须带着“危险的可爱”阅读。她不是只负责卖萌的新生，而是能把整个文艺部拖进事件中心的行动派。',
    originalDescriptions: [
      { id: 'shiratama-desc-1', title: '伪装关系的开端', zh: '她主动把温水拉进“其实我和这个人”的设定中，人物从登场开始就带着计划性。', ja: '実は私とこの人は', source: '第 7 卷 2 败目', excerptId: 'excerpt-v7-010', reviewStatus: 'verified' },
      { id: 'shiratama-desc-2', title: '主动推进计划', zh: '抱住温水手臂的黑白图不是普通亲密，而是她为了计划推进主动制造关系证据。', ja: '白玉さんはふくれっ面をすると、俺の腕をさらにギュッと抱きしめる。', source: '第 7 卷正文', excerptId: 'excerpt-v7-011', reviewStatus: 'verified' },
      { id: 'shiratama-desc-3', title: '婚礼事件核心', zh: '第七卷后段的走廊、相机和伪装场景都围绕她展开，白玉线具有明显事件剧结构。', ja: '白玉リコ・リベンジ大作戦', source: '第 7 卷 4 败目', excerptId: 'excerpt-v7-014', reviewStatus: 'verified' },
    ],
    moments: [
      { id: 'shiratama-m1', volumeId: 'v7', artworkId: 'v7-010', title: '其实我和这个人', summary: '白玉用伪装关系把温水拉进婚礼事件，文艺部新生的行动力第一次爆发。', excerptId: 'excerpt-v7-010', sourceFile: '第 7 卷 EPUB', reviewStatus: 'verified' },
      { id: 'shiratama-m2', volumeId: 'v7', artworkId: 'v7-011', title: '抱住手臂的证据', summary: '她以可爱外表包装强推进，伪装关系因此从口头设定变成可见行动。', excerptId: 'excerpt-v7-011', sourceFile: '第 7 卷 EPUB', reviewStatus: 'verified' },
      { id: 'shiratama-m3', volumeId: 'v7', artworkId: 'v7-017', title: '婚礼会场走廊', summary: '事件从校园移动到会场，白玉线的调查与喜剧双重结构在走廊场景里汇合。', excerptId: 'excerpt-v7-017', sourceFile: '第 7 卷 EPUB', reviewStatus: 'verified' },
    ],
    connections: [
      { id: 'shiratama-nukumizu', characterId: 'nukumizu', label: '社长与问题新生', description: '温水被白玉的计划拖入现场，负责吐槽也负责兜底。', source: '第 7 卷', reviewStatus: 'verified' },
      { id: 'shiratama-yanami', characterId: 'yanami', label: '伪装协力', description: '八奈见参与白玉的伪装计划，让事件从单人行动变成群像喜剧。', source: '第 7 卷', reviewStatus: 'verified' },
      { id: 'shiratama-komari', characterId: 'komari', label: '文艺部后辈线', description: '白玉作为新生进入文艺部，小鞠等既有成员被迫面对新的问题。', source: '第 7 卷', reviewStatus: 'verified' },
    ],
    artworkSections: { hero: ['v7-002'], monochrome: ['v7-010', 'v7-011', 'v7-013', 'v7-014', 'v7-015', 'v7-016', 'v7-017', 'v7-018'], ensemble: ['v7-003'], archive: [] },
  },
};

export const volumes = generated.volumes as Volume[];
export const excerpts = generated.excerpts as Excerpt[];
export const artworks: Artwork[] = (generated.artworks as Artwork[]).map((artwork): Artwork => {
  const review = artworkReviewById.get(artwork.id);
  if (!review) {
    return {
      ...artwork,
      characterIds: [],
      alt: `${artwork.id.toUpperCase()} 插画，未进行人物标注`,
    };
  }
  return {
    ...artwork,
    characterIds: review.characterIds,
    title: review.title,
    sceneDescription: review.sceneDescription,
    sceneType: review.sceneType,
    sourceChapter: review.sourceChapter,
    excerptId: review.excerptId ?? artwork.excerptId,
    descriptionReviewStatus: review.descriptionReviewStatus,
    reviewedCharacterIds: review.characterIds,
    alt: `${review.sceneDescription} 人物：${review.characterIds.map((id) => baseCharacterData[id].name).join('、')}`,
  };
});

export const archiveMeta = {
  collectionLabel: generated.collectionLabel,
  publishedStatus: generated.publishedStatus,
  excerptCount: generated.excerpts.length,
  sourceNote: '资料核对：用户提供的原作 EPUB、动画官网公开资料与 Aniplex 官方 YouTube 视频。运行时不抓取外部内容。',
  illustrator: 'いみぎむる（Imigimuru）',
  author: '雨森たきび',
} as const;

export const featuredArtworkRows = [
  ['v1-002', 'v1-003', 'v1-004', 'v1-005', 'v2-002', 'v3-002', 'v4-002', 'v5-002'],
  ['v5-003', 'v7-002', 'v7-003', 'v8-002', 'v8-003', 'sss-002', 'sss-004'],
] as const;

export const featuredArtworkIds = featuredArtworkRows.flat();

export const characterById = new Map(characters.map((character) => [character.id, character]));
export const volumeById = new Map(volumes.map((volume) => [volume.id, volume]));
export const artworkById: Map<string, Artwork> = new Map(artworks.map((artwork) => [artwork.id, artwork]));
export const excerptById = new Map(excerpts.map((excerpt) => [excerpt.id, excerpt]));

export const externalArtworks: ExternalArtwork[] = Object.keys(dossierSeed).flatMap((id) => {
  const characterId = id as CharacterId;
  const anime = dossierSeed[characterId].anime;
  return anime.videos.map((video, index) => ({
    id: `${characterId}-official-video-${index + 1}`,
    characterId,
    kind: 'video',
    title: video.title,
    sourceUrl: video.sourceUrl,
    author: 'Aniplex 公式 YouTube',
    copyrightNote: '官方公开视频使用 youtube-nocookie.com 点击后嵌入；本站不下载、不截取、不重新托管视频画面。',
  }));
});

export const characterDossiers: CharacterDossier[] = (Object.entries(dossierSeed) as Array<[CharacterId, Omit<CharacterDossier, 'characterId' | 'externalMedia'>]>)
  .map(([characterId, dossier]) => ({
    characterId,
    ...dossier,
    externalMedia: externalArtworks.filter((media) => media.characterId === characterId),
  }));

export const dossierByCharacterId = new Map(characterDossiers.map((dossier) => [dossier.characterId, dossier]));

export function getCharacter(id: string) {
  return characterById.get(id as CharacterId);
}

export function getCharacterDossier(id: string) {
  return dossierByCharacterId.get(id as CharacterId);
}

export function getVolume(id: string) {
  return volumeById.get(id);
}

export function getArtwork(id: string) {
  return artworkById.get(id);
}

export function getArtworksForCharacter(id: CharacterId) {
  const dossier = dossierByCharacterId.get(id);
  if (!dossier) return [];
  const ids = [
    ...dossier.artworkSections.hero,
    ...dossier.artworkSections.monochrome,
    ...dossier.artworkSections.ensemble,
    ...dossier.artworkSections.archive,
  ];
  return Array.from(new Set(ids))
    .map((artworkId) => artworkById.get(artworkId))
    .filter((artwork): artwork is Artwork => Boolean(artwork));
}

export function getArtworksForVolume(id: string) {
  return artworks.filter((artwork) => artwork.volumeId === id);
}
