'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Artwork } from '@/lib/archive';
import { ArtworkLightbox } from './ArtworkLightbox';

export function ArtworkMosaic({ artworks, limit }: { artworks: Artwork[]; limit?: number }) {
  const visible = limit ? artworks.slice(0, limit) : artworks;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="artwork-mosaic">
        {visible.map((artwork, index) => (
          <button
            className="artwork-mosaic__item"
            key={artwork.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`查看 ${artwork.id} 插画详情`}
          >
            <Image
              src={artwork.thumbnailSrc}
              alt={artwork.alt}
              width={artwork.width}
              height={artwork.height}
              sizes="(max-width: 760px) 50vw, 25vw"
            />
            <span>{artwork.id.toUpperCase()}</span>
          </button>
        ))}
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
