import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const prefix = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
const errors = new Set();
const resources = new Set();
const pages = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(filename);
    else if (entry.name.endsWith('.html')) pages.push(filename);
  }
}
await walk(root);

for (const filename of pages) {
  const html = await readFile(filename, 'utf8');
  const references = [
    ...Array.from(html.matchAll(/\b(?:src|href)="([^"<>]+)"/g), (match) => match[1]),
    ...Array.from(html.matchAll(/url\((?:&quot;|["'])?([^)'"\s]+)(?:&quot;|["'])?\)/g), (match) => match[1]),
  ];
  for (const reference of references) {
    if (!reference.startsWith('/') || reference.startsWith('//')) continue;
    const pathname = decodeURIComponent(reference.split(/[?#]/)[0]);
    if (prefix && pathname !== prefix && !pathname.startsWith(`${prefix}/`)) {
      errors.add(`${path.relative(root, filename)}: missing ${prefix} prefix: ${reference}`);
      continue;
    }
    const relative = pathname.slice(prefix.length).replace(/^\/+/, '');
    const target = path.resolve(root, relative);
    if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
      errors.add(`Unsafe export URL: ${reference}`);
      continue;
    }
    resources.add(pathname);
    try {
      if ((await stat(target)).isDirectory()) await stat(path.join(target, 'index.html'));
    } catch { errors.add(`${path.relative(root, filename)}: missing file: ${reference}`); }
  }
}

for (const route of ['', 'characters', 'characters/yanami', 'characters/shiratama', 'volumes/v1', 'gallery']) {
  if (!pages.includes(path.join(root, route, 'index.html'))) errors.add(`Missing route: /${route}`);
}
if (errors.size) {
  console.error([...errors].join('\n'));
  process.exitCode = 1;
} else {
  await writeFile(path.join(root, 'release.json'), JSON.stringify({
    commit: process.env.GITHUB_SHA ?? 'local', basePath: prefix,
    pages: pages.length, checkedResources: resources.size,
  }, null, 2));
  console.log(`Export verified: ${pages.length} HTML pages, ${resources.size} local URLs, basePath=${prefix || '/'}`);
}
