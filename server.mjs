import http from 'node:http';
import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const baseRoot = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(baseRoot, 'dist');
// If dist exists, serve from dist with fallback to baseRoot for static media assets
const root = existsSync(path.join(distDir, 'index.html')) ? distDir : baseRoot;
const port = Number(process.env.PORT || 8787);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.svg': 'image/svg+xml',
};

http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405);
      res.end();
      return;
    }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let targetPath = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));

    // Fallback to baseRoot if not found in dist (e.g. static assets, __l5e)
    if (!existsSync(targetPath) && root === distDir) {
      targetPath = path.resolve(baseRoot, '.' + pathname);
    }

    // SPA fallback: if not a file and not an asset, serve index.html
    if (!existsSync(targetPath) && !path.extname(pathname)) {
      targetPath = path.resolve(root, 'index.html');
    }

    let info;
    try {
      info = await stat(targetPath);
    } catch {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    if (!info.isFile()) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const headers = {
      'Content-Type': mime[path.extname(targetPath)] || 'application/octet-stream',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    };

    const range = req.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      let start = 0,
        end = info.size - 1;
      if (match) {
        if (match[1]) {
          start = Number(match[1]);
          if (match[2]) end = Math.min(Number(match[2]), end);
        } else if (match[2]) start = Math.max(0, info.size - Number(match[2]));
      }
      if (!match || start > end || start >= info.size) {
        res.writeHead(416, { 'Content-Range': `bytes */${info.size}` });
        res.end();
        return;
      }
      res.writeHead(206, {
        ...headers,
        'Content-Range': `bytes ${start}-${end}/${info.size}`,
        'Content-Length': end - start + 1,
      });
      if (req.method === 'HEAD') res.end();
      else createReadStream(targetPath, { start, end }).pipe(res);
    } else {
      res.writeHead(200, { ...headers, 'Content-Length': info.size });
      if (req.method === 'HEAD') res.end();
      else createReadStream(targetPath).pipe(res);
    }
  } catch {
    res.writeHead(500);
    res.end('Unable to read file');
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://localhost:${port}`));
