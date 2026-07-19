import type { Metadata } from 'next';
import './globals.css';
import { ArchiveHeader } from './components/ArchiveHeader';
import { SiteFooter } from './components/SiteFooter';

export const metadata: Metadata = {
  title: {
    default: '败犬青春档案 | MAKEINE ARCHIVE',
    template: '%s | MAKEINE ARCHIVE',
  },
  description: '以官方轻小说插画与双语原文构成的《败犬女主太多了！》动态艺术图鉴。',
  keywords: ['败犬女主太多了', 'MAKEINE', '轻小说', '角色图鉴', '官方插画'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">跳至正文</a>
        <ArchiveHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
