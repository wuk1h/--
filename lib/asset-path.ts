/** Next prefixes Link routes, but public/ images and CSS URLs need this explicitly. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, '') ?? '';

export function assetPath(src: string): string {
  if (!basePath || !src.startsWith('/') || src.startsWith('//')) return src;
  if (src === basePath || src.startsWith(`${basePath}/`)) return src;
  return `${basePath}${src}`;
}
