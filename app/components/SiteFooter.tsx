import Link from 'next/link';
import { archiveMeta } from '@/lib/archive';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <strong>败犬青春档案</strong>
          <p>非官方粉丝艺术图鉴。人物与原作插画版权归原作者及出版方所有。</p>
        </div>
        <div className="site-footer__meta">
          <span>原作 / {archiveMeta.author}</span>
          <span>插画 / {archiveMeta.illustrator}</span>
          <span>资料核对 / 萌娘百科、原作 EPUB</span>
        </div>
        <nav aria-label="页脚导航">
          <Link href="/characters/">角色</Link>
          <Link href="/volumes/">卷宗</Link>
          <Link href="/gallery/">插画</Link>
        </nav>
      </div>
    </footer>
  );
}
