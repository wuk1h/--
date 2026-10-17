import type { Metadata } from 'next';
import Image from '@/app/components/ArchiveImage';
import { notFound } from 'next/navigation';
import { getArtworksForVolume, getVolume, volumes } from '@/lib/archive';
import { ArtworkMosaic } from '@/app/components/ArtworkMosaic';
import { SectionIntro } from '@/app/components/SectionIntro';

export function generateStaticParams() {
  return volumes.map((volume) => ({ id: volume.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const volume = getVolume(id);
  return volume ? { title: volume.label, description: volume.description } : { title: '卷宗未找到' };
}

export default async function VolumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const volume = getVolume(id);
  if (!volume) notFound();
  const artworks = getArtworksForVolume(volume.id);
  const contextCount = artworks.filter((artwork) => artwork.excerptId).length;

  return (
    <div className="detail-page">
      <header className="volume-detail-hero">
        <div className="volume-detail-hero__background">
          <Image src="/archive/backgrounds/literature-room.webp" alt="" fill priority sizes="100vw" />
        </div>
        <div className="volume-detail-hero__cover">
          {volume.coverSrc && <Image src={volume.coverSrc} alt={`${volume.label}封面`} fill priority sizes="340px" />}
        </div>
        <div className="volume-detail-hero__copy">
          <p className="eyebrow">VOLUME FILE / {volume.number}</p>
          <h1>{volume.label}</h1>
          <p>{volume.description} 其中 {contextCount} 张已关联相邻章节的中日双语短摘录。</p>
          <p className="eyebrow">SOURCE EPUB / {volume.sourceFile}</p>
        </div>
      </header>
      <section className="detail-section">
        <div className="page-shell">
          <SectionIntro
            index={volume.number}
            eyebrow="Artwork sequence / spine order"
            title={`${artworks.length} 张图像，按 EPUB 阅读顺序排列。`}
            description="卷首、封面与附录没有可靠正文时不会强行绑定摘录；正文图像可在灯箱中切换中文与日文。"
          />
          <ArtworkMosaic artworks={artworks} />
        </div>
      </section>
    </div>
  );
}
