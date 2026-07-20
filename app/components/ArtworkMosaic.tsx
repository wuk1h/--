'use client';

import Image from 'next/image';
import { useState } from 'react';
import { volumeById, type Artwork } from '@/lib/archive';
import { ArtworkLightbox } from './ArtworkLightbox';

export function ArtworkMosaic({
  artworks,
  limit,
  showDetails = false,
}: {
  artworks: Artwork[];
  limit?: number;
  showDetails?: boolean;
}) {
  const visible = limit ? artworks.slice(0, limit) : artworks;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className={showDetails ? 'artwork-mosaic artwork-mosaic--with-copy' : 'artwork-mosaic'}>
        {visible.map((artwork, index) => {
          const volume = volumeById.get(artwork.volumeId);
          return (
            <button
              className="artwork-mosaic__item"
              key={artwork.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`查看 ${artwork.title ?? artwork.id} 插画详情`}
            >
              <Image
                src={artwork.thumbnailSrc}
                alt={artwork.alt}
                width={artwork.width}
                height={artwork.height}
                sizes="(max-width: 760px) 50vw, 25vw"
              />
              <span className="artwork-mosaic__code">{artwork.id.toUpperCase()}</span>
              {showDetails && (
                <span className="artwork-mosaic__caption">
                  <strong>{artwork.title ?? '未进行人物标注'}</strong>
                  <small>{volume?.label ?? artwork.volumeId} / {artwork.sourceChapter ?? artwork.chapter}</small>
                </span>
              )}
            </button>
          );
        })}
      </div>
      {activeIndex !== null && visible[activeIndex] && (
        <ArtworkLightbox
          artwork={visible[activeIndex]}
          onClose={() => setActiveIndex(null)}
          onPrevious={() => setActiveIndex((activeIndex - 1 + visible.length) % visible.length)}
          onNext={() => setActiveIndex((activeIndex + 1) % visible.length)}
        />
      )}
    </>
  );
}
