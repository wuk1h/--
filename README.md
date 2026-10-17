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

原始 EPUB 不上传仓库，重新提取时必须显式指定本地素材目录（需要 Python 和 Pillow）：

```powershell
python scripts\build_archive.py --source "D:\path\to\epubs"
```

## 开发与验证

```powershell
npm ci
npm run dev
npm run verify
npm start
```

`npm run verify` 依次执行内容资源校验、TypeScript、ESLint、Vitest、Next.js 生产构建和导出资源检查。静态站点输出到 `dist/`。`npm start` 使用内置静态服务器在 `http://127.0.0.1:4173/` 预览；不要用 `next start` 运行静态导出。构建期间请停止开发服务器，两者共用 `dist/`。

## GitHub Pages 发布

原仓库保留为 [wuk1h/--](https://github.com/wuk1h/--)。预计站点地址为 [败犬青春档案](https://wuk1h.github.io/--/)，是否上线以 Actions 的部署和在线检查结果为准。

首次发布需在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。此设置不会由普通构建脚本自动开启。

- `main` 分支推送后执行完整验证，再上传、部署和在线检查；PR 只验证，不发布。
- 工作流按仓库名设置 `NEXT_PUBLIC_BASE_PATH=/--`。Next 的页面链接和自定义公共图片/背景使用同一前缀。
- `npm run check:export` 检查所有导出 HTML 的本地链接和资源是否存在，生成 `dist/release.json`。
- `npm run check:online -- https://wuk1h.github.io/--/` 验证首页、索引、详情、画廊及图片、JS、CSS。
- 使用自定义域名或修改仓库名时，需要对应调整构建前缀并重新构建；不能只移动已生成的文件。

Windows 下模拟项目子路径：

```powershell
$env:NEXT_PUBLIC_BASE_PATH = '/--'
npm run verify
npm start
# 访问 http://127.0.0.1:4173/--/
# 恢复本地根路径构建前运行：Remove-Item Env:NEXT_PUBLIC_BASE_PATH
```

## 仓库与本机文件边界

仓库保留源代码、内容清单、站点实际使用的 WebP 素材和便携启动器源码。`release/` 发布包、`downloads/` 视频下载、便携服务器二进制、`.workbuddy/` 私人日志、缓存和旧审计文件不再纳入版本控制；本机文件不删除。新的 `.gitignore` 不会清除旧提交里的大文件，历史瘦身是另外的操作，不在本次普通更新中强推历史。

所有密钥只能放在未追踪的本地环境或 GitHub Secrets 中；不要将个人路径、下载素材、API 密钥和调试日志加入提交。

主要技术：Next.js 15、React 19、TypeScript、Tailwind CSS 4、GSAP ScrollTrigger、`@gsap/react`、Lucide React。

## 美术素材

`public/archive/backgrounds/` 中的三张无人背景通过指定图像 API 生成：放学后校园走廊、夕阳文艺部活动室、抽象水族馆光影。生成过程未上传 EPUB 插画，背景不包含人物、文字、校徽、商标或水印。

## 版权说明

本站为非官方粉丝档案项目。原作：雨森焚火；插画：いみぎむる（伊右群）；出版：小学馆 GAGAGA 文库。EPUB 插画及原文的版权属于原权利人，不因个人、非商业用途而自动获得公开传播授权；公开部署前应确认相关使用权限。仓库公开不表示其素材可自由再分发。

动画播放器只使用已核实官方视频的原生嵌入，点击后加载，不下载或重新托管视频。目前清单使用官方 YouTube 回退；代码支持 B 站入口不等于已经找到合格的官方 B 站视频。来源链接与版权说明随页面保留。
