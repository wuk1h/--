import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const data = JSON.parse(readFileSync(resolve(root, 'lib/archive.generated.json'), 'utf8'));
const archiveSource = readFileSync(resolve(root, 'lib/archive.ts'), 'utf8');
const characterIds = new Set([
  'yanami', 'yakishio', 'komari', 'nukumizu', 'basori', 'kaju', 'shikiya', 'shiratama',
]);
const volumeIds = new Set(data.volumes.map((volume) => volume.id));
const artworkIds = new Set();
const excerptIds = new Set(data.excerpts.map((excerpt) => excerpt.id));
const publishedReviewIds = new Set(Array.from(archiveSource.matchAll(/artworkId: '([^']+)'/g), (match) => match[1]));
const errors = [];
const hashes = new Map();

for (const artwork of data.artworks) {
  if (artworkIds.has(artwork.id)) errors.push(`duplicate artwork id: ${artwork.id}`);
  artworkIds.add(artwork.id);
  if (!volumeIds.has(artwork.volumeId)) errors.push(`unknown volume: ${artwork.id}`);
  if (artwork.reviewStatus !== 'verified') errors.push(`unverified artwork: ${artwork.id}`);
  if (artwork.chapter.includes('eBooks')) errors.push(`publisher back matter published: ${artwork.id}`);

  for (const id of artwork.characterIds) {
    if (!characterIds.has(id)) errors.push(`unknown character ${id}: ${artwork.id}`);
  }
  for (const id of artwork.candidateCharacterIds ?? []) {
    if (!characterIds.has(id)) errors.push(`unknown candidate character ${id}: ${artwork.id}`);
  }
  for (const src of [artwork.src, artwork.thumbnailSrc]) {
    if (!existsSync(resolve(root, 'public', src.replace(/^\//, '')))) {
      errors.push(`missing asset ${src}: ${artwork.id}`);
    }
  }
  const sourcePath = resolve(root, 'public', artwork.src.replace(/^\//, ''));
  if (existsSync(sourcePath)) {
    const hash = createHash('sha256').update(readFileSync(sourcePath)).digest('hex');
    const existing = hashes.get(hash);
    if (existing && publishedReviewIds.has(existing) && publishedReviewIds.has(artwork.id)) {
      errors.push(`duplicate published artwork content: ${existing} and ${artwork.id}`);
    }
    hashes.set(hash, artwork.id);
  }
  if (artwork.excerptId && !excerptIds.has(artwork.excerptId)) {
    errors.push(`missing excerpt ${artwork.excerptId}: ${artwork.id}`);
  }
}

for (const reviewId of publishedReviewIds) {
  if (!artworkIds.has(reviewId)) errors.push(`review references missing artwork: ${reviewId}`);
}

for (const volume of data.volumes) {
  if (!volume.coverSrc) errors.push(`missing cover: ${volume.id}`);
  if (!volume.artworkIds.length) errors.push(`empty volume: ${volume.id}`);
}

for (const id of characterIds) {
  if (!archiveSource.includes(`characterId: '${id}'`)) {
    errors.push(`missing character dossier: ${id}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${data.volumes.length} volumes, ${data.artworks.length} artworks, ${data.excerpts.length} excerpts, ${publishedReviewIds.size} reviewed artworks.`);
