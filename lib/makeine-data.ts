// 《败犬女主太多了！》角色图鉴数据
// 资料来源：百度百科 / 萌娘百科 / anibase，核对作者雨森焚火、插画伊右群

export interface Character {
  id: string;
  name: string;
  nameJp: string;
  romaji: string;
  role: string;
  height: string;
  birthday: string;
  zodiac: string;
  club: string;
  grade: string;
  hairColor: string;
  accentColor: string;
  symbol: 'utensils' | 'footprints' | 'book' | 'glasses' | 'crown' | 'heart' | 'ghost' | 'sparkles';
  personality: string[];
  hobbies: string[];
  feature: string;
  crush: string;
  losingTo: string;
  quote: string;
  description: string;
  popularity?: string;
}

export const characters: Character[] = [
  {
    id: 'yanami',
    name: '八奈见杏菜',
    nameJp: '八奈見杏菜',
    romaji: 'Yanami Anna',
    role: '败北女主① · 人气第1',
    height: '156cm',
    birthday: '11月29日',
    zodiac: '射手座',
    club: '（无社团）',
    grade: '石蕗高中 2年',
    hairColor: '#7EC8E3',
    accentColor: '#FFB7C5',
    symbol: 'utensils',
    personality: ['阳光', '贪吃', '健谈', '冒失', '坚强'],
    hobbies: ['吃', '做便当', '活跃气氛'],
    feature: '蓝色翘发梢 + 随性健谈 + 贪吃属性',
    crush: '袴田草介（青梅竹马）',
    losingTo: '姬宫华恋',
    quote: '他明明说过要娶我当新娘，这不过分吗？',
    description:
      '贪吃的阳光少女，全班治愈担当。暗恋青梅竹马袴田草介，亲眼见草介喜欢上转学的姬宫华恋，含笑成全。家庭餐厅被甩后被温水目击，因没钱让温水代垫，做便当赔偿。动画人气投票第1——"明明叫败北女主，结果人气赢了所有人"。',
    popularity: '人气投票 第1位',
  },
  {
    id: 'yakishio',
    name: '烧盐柠檬',
    nameJp: '焼塩檸檬',
    romaji: 'Yakishio Remon',
    role: '败北女主② · 田径元气',
    height: '163cm',
    birthday: '8月1日',
    zodiac: '狮子座',
    club: '田径部主将',
    grade: '石蕗高中 2年',
    hairColor: '#FF9F6B',
    accentColor: '#FF9F6B',
    symbol: 'footprints',
    personality: ['元气', '运动全能', '灿烂笑容', '直率', '不敢面对感情'],
    hobbies: ['跑步', '田径', '和朋友玩'],
    feature: '浅褐色晒黑肤色 + 名字梗（烧+柠檬）+ 百米王牌',
    crush: '绫野光希（青梅竹马）',
    losingTo: '朝云千早',
    quote: '温温，跟我约会吧。',
    description:
      '田径部主将，充满朝气的元气少女，体育祭会被全校推上神坛的类型。喜欢青梅竹马绫野光希，但光希一直把她当最要好的伙伴。鼓起勇气告白后祝福光希和千早，"笑着掉眼泪"被评全剧最揪心片段。第6卷约温水去水族馆，以退社为赌注赛跑。',
    popularity: '人气投票 第2位',
  },
  {
    id: 'komari',
    name: '小鞠知花',
    nameJp: '小鞠知花',
    romaji: 'Komari Chika',
    role: '败北女主③ · 文艺阴角',
    height: '148cm',
    birthday: '3月29日',
    zodiac: '白羊座',
    club: '文艺部副社长',
    grade: '石蕗高中 2年',
    hairColor: '#6B4226',
    accentColor: '#7EC8E3',
    symbol: 'book',
    personality: ['极度怕生', '口吃', '腐女', '好强', '自卑与自傲'],
    hobbies: ['文学', '腐', '研究学校自来水'],
    feature: '阴角文学少女 + 用手机打字交流 + 对自来水讲究 + 姓氏双关（小鞠/困扰）',
    crush: '玉木慎太郎（社长）',
    losingTo: '月之木古都',
    quote: '温、温水就总是让我烦躁、让我感到不爽、让我很在意。',
    description:
      '文艺部成员，极度怕生的宅系文学少女，说话磕绊，跟人对上视线就紧张到变石像。用手机快速打字回复对方。喜欢社长玉木慎太郎，合宿时鼓起勇气告白被温柔拒绝。作者称其为"女版温水"，刻画最立体的角色之一。',
  },
  {
    id: 'nukumizu',
    name: '温水和彦',
    nameJp: '温水和彦',
    romaji: 'Nukumizu Kazuhiko',
    role: '男主角 · 旁观者',
    height: '170cm',
    birthday: '12月25日',
    zodiac: '摩羯座',
    club: '文艺社社长',
    grade: '石蕗高中 2年',
    hairColor: '#3D3530',
    accentColor: '#A8C97F',
    symbol: 'glasses',
    personality: ['达观', '孤独', '旁观者', '嘴笨', '原则清晰'],
    hobbies: ['读小说', '观察他人'],
    feature: '班级背景人物 + 偶然目击败北现场 + 被卷入 + 石蕗祭后任文艺社社长',
    crush: '——',
    losingTo: '——',
    quote: '但愿这些因为败北而闪耀的少女们都能幸福。',
    description:
      '石蕗高中二年级，达观的孤独少年，过着"阴角"生活并刻意远离人际交往。偶然目击八奈见被甩，被卷入败北女主们的青春。主要扮演旁观者，从被动接受转为主动介入。《这本轻小说真厉害！2025》男性角色部门第1名。',
    popularity: '男性角色 第1位',
  },
  {
    id: 'basori',
    name: '马剃天爱星',
    nameJp: '馬剃天愛星',
    romaji: 'Basori Tiara',
    role: '大器晚成女主',
    height: '——',
    birthday: '——',
    zodiac: '——',
    club: '学生会副会长 → 会长',
    grade: '石蕗高中 2年',
    hairColor: '#FFD66B',
    accentColor: '#FFD66B',
    symbol: 'crown',
    personality: ['固执', '认真', '成绩不好', '直率'],
    hobbies: ['学生会工作'],
    feature: '学生会副会长 + 成绩不好被温水教读书 + 第8卷指名温水做推荐人',
    crush: '温水和彦（渐近）',
    losingTo: '——',
    quote: '就现在——推选我，只支持我一个人好吗？',
    description:
      '学生会前副会长，第8卷通过温水帮助成为会长。校园门口检查时没收月之木同人志，以此请温水帮忙。温水偷回同人志失败时捡到试卷，发现她成绩不好，于是教她读书。大器晚成的女主角。',
  },
  {
    id: 'kaju',
    name: '温水佳树',
    nameJp: '温水佳樹',
    romaji: 'Nukumizu Kaju',
    role: '完美妹妹',
    height: '147cm',
    birthday: '6月6日',
    zodiac: '双子座',
    club: '——',
    grade: '桃园国中 3年',
    hairColor: '#8B5A3C',
    accentColor: '#FFB7C5',
    symbol: 'heart',
    personality: ['完美', '兄控', '能干'],
    hobbies: ['照顾哥哥'],
    feature: '无所不能的完美妹妹 + 兄控 + 本命巧克力',
    crush: '温水和彦（哥哥）',
    losingTo: '——',
    quote: '（送出本命巧克力并亲了哥哥的脸颊）',
    description:
      '桃园国中三年级，无所不能的完美妹妹，兄控。第5卷情人节事件中，哥哥误以为佳树喜欢的人是橘学弟，后弄清真相。事件结束后佳树给哥哥送出本命巧克力，并亲了哥哥的脸颊。',
  },
  {
    id: 'shikiya',
    name: '志喜屋梦子',
    nameJp: '志喜屋夢子',
    romaji: 'Shikiya Yumeko',
    role: '丧尸系辣妹',
    height: '——',
    birthday: '——',
    zodiac: '——',
    club: '学生会前书记',
    grade: '石蕗高中 3年',
    hairColor: '#E8A0BF',
    accentColor: '#E8A0BF',
    symbol: 'ghost',
    personality: ['丧尸系', '辣妹', '不坦率'],
    hobbies: ['观察月之木'],
    feature: '丧尸系辣妹 + 不懂如何坦率 + 推到月之木男友引发误会',
    crush: '——',
    losingTo: '——',
    quote: '——',
    description:
      '学生会前书记，丧尸系辣妹。不明白如何变得像月之木一样坦率，推到了月之木男友玉木，正好被月之木看见，二人关系变差。后在温水策划下向月之木透露内心，二人化解矛盾——本意并非夺取月之木的男友。',
  },
  {
    id: 'shiratama',
    name: '白玉璃子',
    nameJp: '白玉璃子',
    romaji: 'Shiratama Riko',
    role: '心机学妹',
    height: '——',
    birthday: '——',
    zodiac: '——',
    club: '文艺社',
    grade: '石蕗高中 1年',
    hairColor: '#F5E6D3',
    accentColor: '#A8C97F',
    symbol: 'sparkles',
    personality: ['心机', '可爱', '问题儿童'],
    hobbies: ['惹麻烦'],
    feature: '心机可爱学妹 + 停学中问题儿童 + 婚礼会场潜入任务',
    crush: '——',
    losingTo: '——',
    quote: '……社长给人的感觉好成熟喔。',
    description:
      '石蕗高中一年级新生，心机可爱学妹。在小拔老师介绍下来到文艺社，看似拯救废社危机的天使，实则是因惹麻烦而停学中的超级问题儿童。第7卷卷入婚礼会场潜入任务"白玉莉子·卷土重来大作战"。',
  },
];

export interface Scene {
  id: string;
  vol: string;
  title: string;
  characters: string[];
  quote: string;
  description: string;
  accentColor: string;
}

export const scenes: Scene[] = [
  {
    id: 'scene-1',
    vol: '第1卷',
    title: '家庭餐厅的败北',
    characters: ['八奈见', '袴田', '温水'],
    quote: '他明明说过要娶我当新娘，这不过分吗？ — 那是多久前的事？ — 大概四、五岁吧。',
    description:
      '平常担任班上背景人物的温水，偶然目击人气女同学八奈见被青梅竹马袴田甩掉的失恋现场。八奈见劝说袴田去向将要转学的姬宫表白，自己含笑退出。一切由此开始。',
    accentColor: '#FFB7C5',
  },
  {
    id: 'scene-2',
    vol: '第1卷',
    title: '便当赔偿',
    characters: ['八奈见', '温水'],
    quote: '代垫太多了，我做便当赔偿吧。',
    description:
      '八奈见吃饭没钱让温水代垫，因代垫太多提出做便当赔偿。这份便当成为败北女主与温水羁绊的开端，"女生可以分成两大类：不是青梅竹马，就是偷腥猫"。',
    accentColor: '#7EC8E3',
  },
  {
    id: 'scene-3',
    vol: '第2卷',
    title: '烧盐的告白与祝福',
    characters: ['烧盐', '绫野', '朝云', '温水'],
    quote: '（鼓起勇气告白后，祝福光希和千早）',
    description:
      '烧盐不敢面对对绫野的感情，被温水说服好好去谈话。她表达了心意，然后祝福光希和朝云，结束这段不敢诉说的感情。那张"笑着掉眼泪"的脸庞，被许多观众评为全剧最揪心片段。',
    accentColor: '#FF9F6B',
  },
  {
    id: 'scene-4',
    vol: '第3卷',
    title: '合宿告白被拒',
    characters: ['小鞠', '玉木'],
    quote: '让我稍微考虑一下。 ——（随后被温柔拒绝）',
    description:
      '文艺社合宿，小鞠鼓起勇气向社长玉木慎太郎告白，得到"让我考虑一下"后因害怕看学姐眼神而拔腿就跑，最终被温柔拒绝。第3卷是一封"感谢与道别的情书"。',
    accentColor: '#A8C97F',
  },
  {
    id: 'scene-5',
    vol: '第6卷',
    title: '水族馆约会 · 百米赌约',
    characters: ['烧盐', '温水'],
    quote: '温温，跟我约会吧。',
    description:
      '春天，烧盐在温水耳边悄声说"跟我约会吧"。二人在竹岛水族馆初次约会，还要和那群难伺候的女孩子打攻防战。最后烧盐提出以退社为赌注的百米赛跑——浅褐色少女掀起春日里的波澜。',
    accentColor: '#FF9F6B',
  },
  {
    id: 'scene-6',
    vol: '第7卷',
    title: '婚礼会场潜入',
    characters: ['白玉', '文艺社众'],
    quote: '白玉莉子·卷土重来大作战！',
    description:
      '心机可爱学妹白玉璃子登场。我们都被这惹人怜爱的外貌完全骗倒了——原本以为是拯救废社危机的天使，没想到竟是停学中的超级问题儿童。文艺社被卷入婚礼会场潜入任务。',
    accentColor: '#A8C97F',
  },
  {
    id: 'scene-7',
    vol: '第8卷',
    title: '学生会选举',
    characters: ['马剃', '温水', '八奈见'],
    quote: '温水君，来堂堂正正比一场吧。',
    description:
      '学生会选举时期，马剃指名温水做她的推荐人。八奈见也已当上推荐人，与温水势均力敌。大器晚成的女主角马剃天爱星在此卷发光，"你还能忍得住不支持她吗？"',
    accentColor: '#FFD66B',
  },
];

// 败北关系图节点
export interface RelationNode {
  id: string;
  label: string;
  type: 'heroine' | 'protagonist' | 'winner' | 'rival';
  x: number; // 0-100 百分比定位
  y: number;
  color: string;
}

export interface RelationEdge {
  from: string;
  to: string;
  label: string;
  type: 'crush' | 'couple' | 'rejected' | 'approach';
}

export const relationNodes: RelationNode[] = [
  { id: 'nukumizu', label: '温水和彦', type: 'protagonist', x: 50, y: 50, color: '#A8C97F' },
  { id: 'yanami', label: '八奈见', type: 'heroine', x: 22, y: 22, color: '#7EC8E3' },
  { id: 'hakamada', label: '袴田草介', type: 'winner', x: 10, y: 50, color: '#B8B8B8' },
  { id: 'himemiya', label: '姬宫华恋', type: 'winner', x: 18, y: 78, color: '#FFB7C5' },
  { id: 'yakishio', label: '烧盐柠檬', type: 'heroine', x: 50, y: 12, color: '#FF9F6B' },
  { id: 'ayano', label: '绫野光希', type: 'winner', x: 78, y: 12, color: '#B8B8B8' },
  { id: 'asagumo', label: '朝云千早', type: 'winner', x: 90, y: 30, color: '#FFB7C5' },
  { id: 'komari', label: '小鞠知花', type: 'heroine', x: 78, y: 50, color: '#7EC8E3' },
  { id: 'tamaki', label: '玉木慎太郎', type: 'winner', x: 90, y: 78, color: '#B8B8B8' },
  { id: 'tsukinoki', label: '月之木古都', type: 'winner', x: 70, y: 88, color: '#FFB7C5' },
  { id: 'basori', label: '马剃天爱星', type: 'rival', x: 30, y: 88, color: '#FFD66B' },
  { id: 'kaju', label: '温水佳树', type: 'rival', x: 12, y: 30, color: '#FFB7C5' },
];

export const relationEdges: RelationEdge[] = [
  { from: 'yanami', to: 'hakamada', label: '暗恋', type: 'crush' },
  { from: 'hakamada', to: 'himemiya', label: '情侣', type: 'couple' },
  { from: 'yanami', to: 'himemiya', label: '败给', type: 'rejected' },
  { from: 'yakishio', to: 'ayano', label: '暗恋', type: 'crush' },
  { from: 'ayano', to: 'asagumo', label: '情侣', type: 'couple' },
  { from: 'yakishio', to: 'asagumo', label: '败给', type: 'rejected' },
  { from: 'komari', to: 'tamaki', label: '暗恋', type: 'crush' },
  { from: 'tamaki', to: 'tsukinoki', label: '情侣', type: 'couple' },
  { from: 'komari', to: 'tsukinoki', label: '败给', type: 'rejected' },
  { from: 'basori', to: 'nukumizu', label: '渐近', type: 'approach' },
  { from: 'kaju', to: 'nukumizu', label: '兄控', type: 'approach' },
  { from: 'nukumizu', to: 'yanami', label: '羁绊', type: 'approach' },
];

export const workInfo = {
  title: '败犬女主太多了！',
  titleJp: '負けヒロインが多すぎる！',
  titleEn: 'too many losing heroines!',
  author: '雨森焚火',
  illustrator: '伊右群',
  publisher: '小学馆 GAGAGA文库',
  startDate: '2021年7月',
  volumes: '8卷 + SSS卷（连载中）',
  animeYear: '2024年动画化',
  tagline: '被败北女角所环绕的谜样青春，在此揭幕！',
};
