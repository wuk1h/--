# 败犬青春档案 / MAKEINE ARCHIVE

以《败犬女主太多了！》官方 EPUB 插画为核心的静态艺术图鉴。站点采用校园剪贴簿式视觉语言，收录角色、卷宗、双语摘录与可筛选插画，并保留 GitHub Pages 所需的静态导出能力。

## 内容范围

- 本地素材：用户提供的第 1–8 卷与 SSS，共 9 个 EPUB。
- 出版状态：页面标注为 `9+1+1` 册；这不代表本站已经收录全部已出版卷。
- 核心角色：八奈见杏菜、烧盐柠檬、小鞠知花、温水和彦、马剃天爱星、温水佳树、志喜屋梦子、白玉莉子。
- 人物图片全部来自提供的官方 EPUB。自动别名匹配只写入 `candidateCharacterIds`；公开 `characterIds` 仅来自人工核对映射，图片记录必须保持 `verified` 状态。
- 萌娘百科仅用于作品和角色资料核对，不在运行时抓取内容，也不复用其图片。

## 内容管线

`scripts/build_archive.py` 读取 EPUB 的 `container.xml`、OPF manifest、spine 和 XHTML 图片引用，按阅读顺序提取封面、彩页、正文插画与相邻双语文本。管线会排除小图标、重复图片，以及从“小学館ｅＢｏｏｋｓ”spine 标记开始的广告、二维码和出版尾页。

生成结果：

- `lib/archive.generated.json`：卷宗、插画和摘录清单
- `public/archive/volumes/`：WebP 展示图与缩略图
- 每张插画包含原始尺寸、方向、焦点、低清占位图、章节来源和复核状态

EPUB 默认从 `C:\Users\wukaix\Desktop\败犬\日文` 读取，也可显式指定：

```powershell
python scripts\build_archive.py --source "D:\path\to\epubs"
```

## 开发与验证

```powershell
npm install
npm run dev
npm run verify
```

`npm run verify` 依次执行内容资源校验、TypeScript、ESLint、Vitest 和 Next.js 生产构建。静态站点输出到 `dist/`。

主要技术：Next.js 15、React 19、TypeScript、Tailwind CSS 4、GSAP ScrollTrigger、`@gsap/react`、Lucide React。

## 美术素材

`public/archive/backgrounds/` 中的三张无人背景通过指定图像 API 生成：放学后校园走廊、夕阳文艺部活动室、抽象水族馆光影。生成过程未上传 EPUB 插画，背景不包含人物、文字、校徽、商标或水印。

## 版权说明

本站为非官方本地重构项目。原作：雨森焚火；插画：いみぎむる（伊右群）；出版：小学馆 GAGAGA 文库。官方插画仅用于用户提供素材的本地展示与整理。
