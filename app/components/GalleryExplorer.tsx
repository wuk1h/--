'use client';

import Image from './ArchiveImage';
import { useEffect, useMemo, useState } from 'react';
import {
  characterById,
  characters,
  volumeById,
  volumes,
  type Artwork,
  type CharacterId,
} from '@/lib/archive';
import { ArtworkLightbox } from './ArtworkLightbox';

export function GalleryExplorer({ artworks }: { artworks: Artwork[] }) {
  const [volume, setVolume] = useState('all');
  const [character, setCharacter] = useState<'all' | CharacterId>('all');
  const [color, setColor] = useState('all');
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered = useMemo(
    () => artworks.filter((artwork) =>
      (volume === 'all' || artwork.volumeId === volume)
      && (character === 'all' || artwork.characterIds.includes(character))
      && (color === 'all' || artwork.colorMode === color)),
    [artworks, character, color, volume],
  );

  const activeIndex = activeId ? filtered.findIndex((artwork) => artwork.id === activeId) : -1;
  const activeArtwork = activeIndex >= 0 ? filtered[activeIndex] : undefined;

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('artwork');
    if (requested && artworks.some((artwork) => artwork.id === requested)) setActiveId(requested);
  }, [artworks]);

  return (
    <>
      <div className="gallery-controls" aria-label="插画筛选">
        <div className="gallery-control">
          <label htmlFor="filter-volume">卷宗</label>
          <select id="filter-volume" value={volume} onChange={(event) => setVolume(event.target.value)}>
            <option value="all">全部卷宗</option>
            {volumes.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}
          </select>
        </div>
        <div className="gallery-control">
          <label htmlFor="filter-character">角色</label>
          <select
            id="filter-character"
            value={character}
            onChange={(event) => setCharacter(event.target.value as 'all' | CharacterId)}
          >
            <option value="all">全部角色</option>
            {characters.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </div>
        <div className="gallery-control">
          <label htmlFor="filter-color">图像类型</label>
          <select id="filter-color" value={color} onChange={(event) => setColor(event.target.value)}>
            <option value="all">彩色与黑白</option>
            <option value="color">彩色</option>
            <option value="mono">黑白</option>
          </select>
        </div>
        <div className="gallery-count">显示 {filtered.length} / {artworks.length} 张</div>
      </div>
      <div className="gallery-grid">
        {filtered.map((artwork) => (
          <button
            className="gallery-tile"
            type="button"
            key={artwork.id}
            onClick={() => setActiveId(artwork.id)}
            aria-label={`打开 ${artwork.id} 插画`}
          >
            <Image
              src={artwork.thumbnailSrc}
              alt={artwork.alt}
              width={artwork.width}
              height={artwork.height}
              loading="lazy"
              sizes="(max-width: 760px) 50vw, 20vw"
            />
            <span className="gallery-tile__meta">
              {volumeById.get(artwork.volumeId)?.label} / {artwork.id.toUpperCase()}
              {artwork.characterIds.length > 0 && ` / ${artwork.characterIds.map((id) => characterById.get(id)?.name).join('、')}`}
            </span>
          </button>
        ))}
      </div>
      {activeArtwork && (
        <ArtworkLightbox
          artwork={activeArtwork}
          onClose={() => setActiveId(null)}
          onPrevious={() => setActiveId(filtered[(activeIndex - 1 + filtered.length) % filtered.length].id)}
          onNext={() => setActiveId(filtered[(activeIndex + 1) % filtered.length].id)}
        />
      )}
    </>
  );
}
