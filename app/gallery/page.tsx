import type { Metadata } from 'next';
import { artworks } from '@/lib/archive';
import { GalleryExplorer } from '@/app/components/GalleryExplorer';

export const metadata: Metadata = {
  title: '插画档案',
  description: `按卷宗、角色和彩色或黑白筛选 ${artworks.length} 张原作图像。`,
};

export default function GalleryPage() {
  return (
    <div className="gallery-page">
      <header className="page-hero" data-index="03">
        <div className="page-shell">
          <p className="eyebrow">Artwork explorer / source verified</p>
          <h1>{artworks.length} 张图像，<br />每张都有出处。</h1>
          <p className="page-hero__lede">
            角色筛选只使用高置信映射。未确认人物的图像仍可按卷宗浏览，但不会显示猜测标签。
          </p>
        </div>
      </header>
      <GalleryExplorer artworks={artworks} />
    </div>
  );
}
