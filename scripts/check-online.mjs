const input = process.argv[2];
if (!input || !/^https?:\/\//.test(input)) throw new Error('Usage: npm run check:online -- https://host/base/');
const root = new URL(input.endsWith('/') ? input : `${input}/`);
const routes = ['', 'characters/', 'characters/yanami/', 'characters/shiratama/', 'volumes/', 'volumes/v1/', 'gallery/'];
const checked = new Set();

async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(20000), cache: 'no-store' });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}

for (const route of routes) {
  const url = new URL(route, root);
  const response = await get(url);
  if (!response.headers.get('content-type')?.includes('text/html')) throw new Error(`Not HTML: ${url}`);
  const html = await response.text();
  if (!html.includes('MAKEINE ARCHIVE')) throw new Error(`Unexpected page: ${url}`);
  // Verify actual images, scripts and styles; a host returning index.html for everything must fail.
  for (const extension of ['webp', 'js', 'css']) {
    const match = html.match(new RegExp(`(?:src|href)="([^"<>]+\\.${extension}(?:\\?[^"<>]*)?)"`));
    if (!match) throw new Error(`No ${extension} asset in ${url}`);
    const asset = new URL(match[1].replaceAll('&amp;', '&'), url);
    if (asset.origin !== root.origin || !asset.pathname.startsWith(root.pathname)) throw new Error(`Asset outside site: ${asset}`);
    if (checked.has(asset.href)) continue;
    const resource = await get(asset);
    const type = resource.headers.get('content-type') ?? '';
    if (type.includes('text/html')) throw new Error(`Asset returned HTML: ${asset}`);
    await resource.arrayBuffer();
    checked.add(asset.href);
  }
  console.log(`OK ${url}`);
}
const release = await (await get(new URL('release.json', root))).json();
if (process.env.GITHUB_SHA && release.commit !== process.env.GITHUB_SHA) throw new Error(`Stale release: ${release.commit}`);
console.log(`Online smoke passed: ${routes.length} routes, ${checked.size} assets; commit=${release.commit}`);
