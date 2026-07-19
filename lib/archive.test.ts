import { describe, expect, it } from 'vitest';
import { artworks, characters, excerpts, featuredArtworkIds, featuredArtworkRows, volumes } from './archive';

describe('archive content', () => {
  it('has all supplied volumes and corrected core characters', () => {
    expect(volumes.map((volume) => volume.id)).toEqual([
      'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'sss',
    ]);
    expect(characters).toHaveLength(8);
    expect(characters.find((character) => character.id === 'shiratama')?.name).toBe('白玉莉子');
  });

  it('publishes only verified artwork with valid dimensions', () => {
    expect(artworks.length).toBeGreaterThan(180);
    for (const artwork of artworks) {
      expect(artwork.reviewStatus).toBe('verified');
      expect(artwork.width).toBeGreaterThan(0);
      expect(artwork.height).toBeGreaterThan(0);
      expect(artwork.chapter).not.toMatch(/小学館(?:ｅＢｏｏｋｓ|eBooks)/);
    }
  });

  it('keeps excerpts short and bilingual where available', () => {
    expect(excerpts.length).toBeGreaterThan(150);
    for (const excerpt of excerpts) {
      expect(excerpt.zh.length).toBeLessThanOrEqual(281);
      expect(excerpt.ja.length).toBeLessThanOrEqual(281);
    }
  });

  it('publishes only manually curated character-artwork relationships', () => {
    expect(artworks.filter((artwork) => artwork.characterIds.length > 0).map((artwork) => artwork.id)).toEqual([
      'v1-002', 'v1-003', 'v1-004', 'v1-005',
      'v2-002', 'v3-002', 'v4-002', 'v5-002', 'v5-003',
      'v7-002', 'v7-003', 'v8-002', 'v8-003', 'sss-002', 'sss-004',
    ]);
  });

  it('uses every curated relationship artwork once in the featured rows', () => {
    const curatedArtworkIds = artworks
      .filter((artwork) => artwork.characterIds.length > 0)
      .map((artwork) => artwork.id);

    expect(featuredArtworkRows.map((row) => row.length)).toEqual([8, 7]);
    expect(new Set(featuredArtworkIds).size).toBe(15);
    expect(featuredArtworkIds).toEqual(curatedArtworkIds);

    for (const artworkId of featuredArtworkIds) {
      const artwork = artworks.find((candidate) => candidate.id === artworkId);
      expect(artwork).toBeDefined();
      expect(artwork?.reviewStatus).toBe('verified');
      expect(artwork?.characterIds.length).toBeGreaterThan(0);
    }
  });
});
