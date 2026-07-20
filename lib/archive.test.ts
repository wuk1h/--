import { describe, expect, it } from 'vitest';
import {
  artworkById,
  artworkReviews,
  artworks,
  characterDossiers,
  characters,
  excerpts,
  featuredArtworkIds,
  featuredArtworkRows,
  volumes,
} from './archive';

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
      expect(artwork.chapter).not.toMatch(/eBooks/);
    }
  });

  it('keeps excerpts short and bilingual where available', () => {
    expect(excerpts.length).toBeGreaterThan(150);
    for (const excerpt of excerpts) {
      expect(excerpt.zh.length).toBeLessThanOrEqual(281);
      expect(excerpt.ja.length).toBeLessThanOrEqual(281);
    }
  });

  it('keeps the homepage featured rows stable and verified', () => {
    expect(featuredArtworkRows.map((row) => row.length)).toEqual([8, 7]);
    expect(new Set(featuredArtworkIds).size).toBe(15);

    for (const artworkId of featuredArtworkIds) {
      const artwork = artworkById.get(artworkId);
      expect(artwork).toBeDefined();
      expect(artwork?.reviewStatus).toBe('verified');
      expect(artwork?.characterIds.length).toBeGreaterThan(0);
      expect(artwork?.descriptionReviewStatus).toBe('verified');
    }
  });

  it('has expanded verified dossiers for every core character', () => {
    expect(characterDossiers).toHaveLength(8);

    for (const dossier of characterDossiers) {
      expect(dossier.spoilerMode).toBe('full');
      expect(dossier.moments).toHaveLength(3);
      expect(dossier.connections.length).toBeGreaterThanOrEqual(3);
      expect(dossier.originalDescriptions.length).toBeGreaterThanOrEqual(3);
      expect(dossier.artworkSections.monochrome.length).toBeGreaterThan(0);

      for (const moment of dossier.moments) {
        expect(moment.reviewStatus).toBe('verified');
        expect(artworkById.get(moment.artworkId)).toBeDefined();
        expect(excerpts.find((excerpt) => excerpt.id === moment.excerptId)).toBeDefined();
      }
      for (const connection of dossier.connections) {
        expect(connection.reviewStatus).toBe('verified');
      }
    }
  });

  it('publishes only reviewed character artwork descriptions', () => {
    expect(artworkReviews.length).toBeGreaterThan(45);
    for (const review of artworkReviews) {
      expect(review.descriptionReviewStatus).toBe('verified');
      expect(review.sceneDescription.length).toBeGreaterThan(12);
      expect(artworkById.get(review.artworkId)).toBeDefined();
      for (const id of review.characterIds) {
        expect(characters.some((character) => character.id === id)).toBe(true);
      }
    }
  });

  it('keeps Shiratama out of anime video embeds until covered', () => {
    const shiratama = characterDossiers.find((dossier) => dossier.characterId === 'shiratama');
    expect(shiratama?.anime.status).toBe('not-covered');
    expect(shiratama?.anime.videos).toEqual([]);
  });
});
