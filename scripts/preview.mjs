import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
};

export function createPreviewServer({ directory = 'dist', basePath = '' } = {}) {
  const root = path.resolve(directory);
  const prefix = basePath.replace(/\/$/, '');
  return createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (prefix && pathname !== prefix && !pathname.startsWith(`${prefix}/`)) {
        response.writeHead(404).end('Outside the configured base path');
        return;
      }
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' }).end();
        return;
      }
      const relative = pathname.slice(prefix.length).replace(/^\/+/, '');
      let file = path.resolve(root, relative);
      if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
        response.writeHead(403).end();
        return;
      }
      try {
        if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
        const body = await readFile(file);
        response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' });
        response.end(request.method === 'HEAD' ? undefined : body);
      } catch {
        const body = await readFile(path.join(root, '404.html')).catch(() => Buffer.from('Not found'));
        response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(request.method === 'HEAD' ? undefined : body);
      }
    } catch {
      response.writeHead(400).end('Invalid request');
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  const port = Number(process.env.PORT ?? 4173);
  const server = createPreviewServer({ basePath });
  server.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}${basePath}/`));
}
