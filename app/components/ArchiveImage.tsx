import NextImage, { type ImageProps } from 'next/image';
import { assetPath } from '@/lib/asset-path';

/** Keep archive data portable between local preview and project GitHub Pages. */
export default function ArchiveImage({ src, ...props }: ImageProps) {
  return <NextImage {...props} src={typeof src === 'string' ? assetPath(src) : src} />;
}
