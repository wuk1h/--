import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const data = JSON.parse(readFileSync(resolve(root, 'lib/archive.generated.json'), 'utf8'));
const characterIds = new Set([
  'yanami', 'yakishio', 'komari', 'nukumizu', 'basori', 'kaju', 'shikiya', 'shiratama',
]);
const volumeIds = new Set(data.volumes.map((volume) => volume.id));
const artworkIds = new Set();
const excerptIds = new Set(data.excerpts.map((excerpt) => excerpt.id));
const errors = [];
const backMatterMarkers = ['小学館ｅＢｏｏｋｓ', '小学館eBooks'];

for (const artwork of data.artworks) {
  if (artworkIds.has(artwork.id)) errors.push(`duplicate artwork id: ${artwork.id}`);
  artworkIds.add(artwork.id);
  if (!volumeIds.has(artwork.volumeId)) errors.push(`unknown volume: ${artwork.id}`);
  if (artwork.reviewStatus !== 'verified') errors.push(`unverified artwork: ${artwork.id}`);
  if (backMatterMarkers.some((marker) => artwork.chapter.includes(marker))) {
    errors.push(`publisher back matter published: ${artwork.id}`);
  }
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
  if (artwork.excerptId && !excerptIds.has(artwork.excerptId)) {
    errors.push(`missing excerpt ${artwork.excerptId}: ${artwork.id}`);
  }
}

for (const volume of data.volumes) {
  if (!volume.coverSrc) errors.push(`missing cover: ${volume.id}`);
  if (!volume.artworkIds.length) errors.push(`empty volume: ${volume.id}`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${data.volumes.length} volumes, ${data.artworks.length} artworks, ${data.excerpts.length} excerpts.`);
