import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ssrHandler from './api/ssr.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');
const PORT = Number(process.env.PORT || 3000);
const BACKEND_BASE = process.env.BACKEND_BASE_URL || 'https://backend.ascww.org';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
};

const send = (res, statusCode, body, contentType = 'text/plain; charset=utf-8') => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', contentType);
  res.end(body);
};

const serveFile = (res, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      send(res, 404, 'Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    send(res, 200, data, mime);
  });
};

const createSsrResponseAdapter = (res) => {
  const adapter = {
    statusCode: 200,
    setHeader: (key, value) => {
      res.setHeader(key, value);
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    send(payload) {
      res.statusCode = this.statusCode;
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
      }
      res.end(payload);
      return this;
    },
  };
  return adapter;
};

const proxyApiRequest = async (req, res, requestUrl) => {
  const targetUrl = `${BACKEND_BASE}${requestUrl.pathname}${requestUrl.search}`;
  const method = req.method || 'GET';
  const headers = { ...req.headers };
  delete headers.host;

  try {
    const upstream = await fetch(targetUrl, {
      method,
      headers,
      body: method === 'GET' || method === 'HEAD' ? undefined : req,
      duplex: method === 'GET' || method === 'HEAD' ? undefined : 'half',
    });

    res.statusCode = upstream.status;
    upstream.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'content-encoding') return;
      res.setHeader(key, value);
    });

    if (!upstream.body) {
      res.end();
      return;
    }
    for await (const chunk of upstream.body) {
      res.write(chunk);
    }
    res.end();
  } catch (error) {
    send(res, 502, `API proxy failed: ${String(error)}`);
  }
};

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || `localhost:${PORT}`;
  const requestUrl = new URL(req.url || '/', `http://${host}`);
  const pathname = requestUrl.pathname;

  if (pathname.startsWith('/api/')) {
    await proxyApiRequest(req, res, requestUrl);
    return;
  }

  const newsMatch = pathname.match(/^\/news\/([^/]+)$/);
  if (newsMatch) {
    const id = newsMatch[1];
    const ssrReq = { query: { id } };
    const ssrRes = createSsrResponseAdapter(res);
    await ssrHandler(ssrReq, ssrRes);
    return;
  }

  const normalizedPath = pathname === '/' ? '/index.html' : pathname;
  const requestedFile = path.normalize(path.join(distDir, normalizedPath));
  const isInsideDist = requestedFile.startsWith(distDir);
  const hasExtension = path.extname(requestedFile) !== '';

  if (isInsideDist && hasExtension && fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    serveFile(res, requestedFile);
    return;
  }

  if (fs.existsSync(indexPath)) {
    serveFile(res, indexPath);
    return;
  }

  send(res, 500, 'Build files not found. Run `npm run build` first.');
});

server.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
  console.log('SSR enabled for /news/:id');
  console.log(`API proxy enabled for /api/* -> ${BACKEND_BASE}/api/*`);
});
