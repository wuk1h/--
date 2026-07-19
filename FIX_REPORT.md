# 修复清单报告

> 基于代码审查报告（CODE_AUDIT_REPORT.md）与 UI/UX 审查报告（UI_AUDIT_REPORT.md）的全部问题，逐一修复并记录。

---

## P0 关键修复（7 项）

### 1. [M-01] Audio 对象内存泄漏
- **文件**: `app/context/MusicContext.tsx`
- **问题**: 切歌时 `useEffect` 创建新 `Audio` 对象但旧对象未完全释放，仅调用 `pause()` 而未清空 `src`
- **修复**: 在 cleanup 中添加 `audio.src = ''; audio.load();` 强制释放底层媒体资源

### 2. [P-01] heroChars 非空断言崩溃风险
- **文件**: `app/page.tsx`
- **问题**: `characters.find((c) => c.id === id)!` 使用非空断言，若角色 ID 不存在则运行时崩溃
- **修复**: 改为 `.filter(Boolean)` 过滤，Hero 区域使用 `{heroChars[0] && ...}` 条件渲染

### 3. [N-04] 角色匹配逻辑失效
- **文件**: `app/novel/page.tsx`
- **问题**: 用中文名 `c.name` 匹配日文原文 `snippet.text`，几乎永远不匹配
- **修复**: 优先用 `c.nameJp`（日文名）匹配日文原文，中文名作为兜底

### 4. [RG-01] RelationGraph 节点查找空值崩溃
- **文件**: `app/makeine/components/RelationGraph.tsx`
- **问题**: `relationNodes.find((n) => n.id === id)!` 非空断言
- **修复**: 改为安全查找，找不到时返回降级默认节点（`{ id, label: id, type: 'rival', x: 50, y: 50, color: '#999' }`）

### 5. [C-01/C-02/C-03] 色彩系统统一
- **文件**: `app/globals.css`, `app/page.tsx`
- **问题**: 三套断连的色彩系统（首页粉彩 / 小说页暗金 / globals.css 蓝紫未用），暗色模式失效
- **修复**:
  - 在 `globals.css` 建立语义化 CSS 变量：`--warm-*`（粉彩）、`--gold-*`（暗金）、`--foreground/-muted/-faint`、`--border` 等
  - 暗色模式 `.dark` 正确映射所有变量
  - `body::before` 渐变改为粉彩/暗金，匹配实际页面美学
  - 首页根容器 `color` 和 `background` 改用 CSS 变量

### 6. [Font] 最小字号提升到 12px
- **文件**: `app/page.tsx`, `app/novel/page.tsx`, `CharacterCard.tsx`, `SceneTimeline.tsx`, `ChibiWall.tsx`, `RelationGraph.tsx`
- **问题**: 全站 18 处使用 `text-[10px]`、`text-[11px]`、`text-[11.5px]`，低于可读性下限
- **修复**: 全部替换为 `text-xs`（12px），统一排版层级

### 7. [V-05] VolArc 移动端固定尺寸溢出
- **文件**: `app/novel/page.tsx` → `app/novel/components/VolArc.tsx`
- **问题**: 3D 弧形画廊使用固定 `height: 460px`、`radius: 360`、`perspective: 1400`，移动端溢出
- **修复**: 桌面端（`md:`）保留 3D 弧形；移动端切换为水平滚动卡片列表，宽度自适应

---

## P1 重要修复（4 项）

### 8. [N-01] novel/page.tsx 单文件 496 行拆分
- **文件**: `app/novel/page.tsx` → 6 个文件
- **问题**: 单文件包含 7 个内联组件，难以维护
- **修复**: 拆分为：
  - `app/novel/types.ts` — ActiveItem 共享类型
  - `app/novel/components/HeroSection.tsx`
  - `app/novel/components/SectionHeading.tsx`
  - `app/novel/components/VolArc.tsx`
  - `app/novel/components/PlateWall.tsx`（含 PlateCard）
  - `app/novel/components/SceneModal.tsx`
  - `page.tsx` 从 496 行缩减到 ~125 行

### 9. [ND-01] novelPlates 数据冗余消除
- **文件**: `lib/makeine-novel-data.ts`, `scripts/generate_novel_data.py`
- **问题**: `novelVolumes[].plates[]` 和扁平 `novelPlates[]` 存储完全相同的路径数据
- **修复**: 删除 270+ 行静态数组，改为派生导出 `novelVolumes.flatMap(...)`；同步更新生成脚本

### 10. [P-02] InfoChip/Section 提取为共享组件
- **文件**: `app/components/InfoChip.tsx`（新建）, `app/components/Section.tsx`（新建）, `app/page.tsx`
- **问题**: 首页内联定义 InfoChip 和 Section 组件，无法复用
- **修复**: 提取为独立组件文件，`page.tsx` 通过 import 引入

### 11. [M-04] localStorage 写入防抖
- **文件**: `app/context/MusicContext.tsx`
- **问题**: 每次 `currentIndex/volume/isMuted` 状态变化都同步写入 localStorage
- **修复**: 添加 300ms 防抖定时器，减少 I/O 开销

---

## P2 中低优先级修复（4 项）

### 12. [N-07] PlateWall 渲染期间计数器突变
- **文件**: `app/novel/components/PlateWall.tsx`
- **问题**: `let counter = {}` 在 `.map()` 渲染过程中被突变，违反 React 纯渲染原则
- **修复**: 使用 `useMemo` 预计算每张图的卷内序号

### 13. [MP-01] MusicPlayer 引用不存在的默认封面
- **文件**: `app/components/MusicPlayer.tsx`
- **问题**: `currentTrack.cover || '/default-cover.jpg'` 引用了不存在的文件
- **修复**: 改为条件渲染——有封面时用 `<Image>`，无封面时用渐变背景 + 图标占位

### 14. [NB-01] Navbar 活跃链接检测过于粗糙
- **文件**: `app/components/Navbar.tsx`
- **问题**: `pathname.startsWith(item.href.slice(0, -1))` 对哈希链接误判、对路径型链接可能误匹配
- **修复**: 新增 `isActive()` 函数，仅对 `/` 开头的路径型链接做精确 `startsWith` 匹配

### 15. [ChibiWall] 旋转角度单一
- **文件**: `app/makeine/components/ChibiWall.tsx`
- **问题**: 旋转角度仅在 `-2deg` 和 `2deg` 间交替，缺乏随机感
- **修复**: 改为基于索引的伪随机模式 `(((i * 37) % 7) - 3) * 0.8`，生成 `-2.4° ~ +2.4°` 范围内的稳定随机角度

---

## 修改文件清单

| 文件 | 操作 | 修复项 |
|------|------|--------|
| `app/context/MusicContext.tsx` | 修改 | M-01, M-04 |
| `app/page.tsx` | 修改 | P-01, C-01, Font, P-02 |
| `app/novel/page.tsx` | 重写 | N-01, N-04, V-05, Font |
| `app/novel/types.ts` | 新建 | N-01 |
| `app/novel/components/HeroSection.tsx` | 新建 | N-01 |
| `app/novel/components/SectionHeading.tsx` | 新建 | N-01 |
| `app/novel/components/VolArc.tsx` | 新建 | N-01, V-05 |
| `app/novel/components/PlateWall.tsx` | 新建 | N-01, N-07 |
| `app/novel/components/SceneModal.tsx` | 新建 | N-01 |
| `app/makeine/components/RelationGraph.tsx` | 修改 | RG-01, Font |
| `app/makeine/components/CharacterCard.tsx` | 修改 | Font |
| `app/makeine/components/SceneTimeline.tsx` | 修改 | Font |
| `app/makeine/components/ChibiWall.tsx` | 修改 | Font, ChibiWall |
| `app/components/MusicPlayer.tsx` | 修改 | MP-01 |
| `app/components/Navbar.tsx` | 修改 | NB-01 |
| `app/components/InfoChip.tsx` | 新建 | P-02 |
| `app/components/Section.tsx` | 新建 | P-02 |
| `app/globals.css` | 修改 | C-01/C-02/C-03 |
| `lib/makeine-novel-data.ts` | 修改 | ND-01 |
| `scripts/generate_novel_data.py` | 修改 | ND-01 |

**合计**: 修改 13 个文件，新建 7 个文件，覆盖全部 15 项修复。

---

## 构建验证

（构建结果将在下方补充）
