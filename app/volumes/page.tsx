import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { archiveMeta, volumes } from '@/lib/archive';

export const metadata: Metadata = {
  title: '卷宗索引',
  description: '第 1–8 卷与 SSS 卷的封面、插画及双语短摘录。',
};

export default function VolumesPage() {
  return (
    <div className="index-page">
      <header className="page-hero" data-index="02">
        <div className="page-shell">
          <p className="eyebrow">Volume files / {archiveMeta.collectionLabel}</p>
          <h1>从书脊进入，<br />把插画放回原文。</h1>
          <p className="page-hero__lede">
            当前收录来自用户提供的九个 EPUB；最新出版状态为 {archiveMeta.publishedStatus}，未提供的卷不伪造画廊内容。
          </p>
        </div>
      </header>
      <section className="index-content">
        <div className="page-shell volume-index-grid">
          {volumes.map((volume) => (
            <Link className="volume-index-item" href={`/volumes/${volume.id}/`} key={volume.id}>
              <div className="volume-index-item__cover">
                {volume.coverSrc && <Image src={volume.coverSrc} alt={`${volume.label}封面`} fill sizes="154px" />}
              </div>
              <div className="volume-index-item__copy">
                <span>FILE / {volume.number}</span>
                <strong>{volume.label}</strong>
                <p>{volume.description}</p>
                <span className="text-link">进入卷宗 <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
