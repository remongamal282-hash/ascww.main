import fs from 'fs';
import path from 'path';

const stripHtml = (html = '') =>
  html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const escapeHtmlAttr = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const getImagePath = (newsItem) => {
  const images = Array.isArray(newsItem?.news_images) ? newsItem.news_images : [];
  const mainImage = images.find((image) => Number(image?.main_image) === 1);
  const fallback = images[0];
  return String(mainImage?.path || fallback?.path || '').trim();
};

export default async function handler(request, response) {
  const rawId = request?.query?.id ?? '';
  const id = decodeURIComponent(String(rawId)).trim();

  const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://backend.ascww.org/api';
  const NEWS_URL = `${API_BASE_URL}/news/home`;
  const NEWS_IMAGE_BASE = `${API_BASE_URL}/news/image/`;
  const SITE_URL =
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');

  const defaultMeta = {
    title: 'شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد',
    description: 'أرشيف الأخبار الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.',
    image: `${SITE_URL}/logo.png`,
    url: `${SITE_URL}/news/${encodeURIComponent(id)}`,
  };

  let meta = { ...defaultMeta };

  try {
    const res = await fetch(NEWS_URL, {
      headers: {
        'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
        Accept: 'application/json',
      },
    });

    if (res.ok) {
      const payload = await res.json();
      const payloadObject = payload && typeof payload === 'object' ? payload : {};
      const rawNewsItems = Array.isArray(payload)
        ? payload
        : Array.isArray(payloadObject.data)
          ? payloadObject.data
          : Array.isArray(payloadObject.value)
            ? payloadObject.value
            : Array.isArray(payloadObject.items)
              ? payloadObject.items
              : [];

      const item = rawNewsItems.find((entry) => {
        if (!entry || typeof entry !== 'object') return false;
        const entryId = String(entry.id ?? '').trim();
        const entrySlug = String(entry.slug ?? '').trim();
        return id === entryId || id === entrySlug;
      });

      if (item) {
        const imagePath = getImagePath(item);
        const image = imagePath
          ? `${NEWS_IMAGE_BASE}${encodeURIComponent(imagePath)}`
          : defaultMeta.image;

        meta = {
          title: String(item.title || defaultMeta.title),
          description: stripHtml(String(item.description || defaultMeta.description)).slice(0, 200),
          image,
          url: `${SITE_URL}/news/${encodeURIComponent(id)}`,
        };
      }
    }
  } catch {
    // keep default metadata
  }

  let html = null;
  const possiblePaths = [
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(process.cwd(), 'index.html'),
    path.join(process.cwd(), 'public', 'index.html'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      html = fs.readFileSync(p, 'utf-8');
      break;
    }
  }

  if (!html) {
    html = `<!doctype html><html><head></head><body><div id="root"></div></body></html>`;
  }

  html = html.replace(/<title>.*?<\/title>/is, '');
  html = html.replace(/<meta[^>]+property="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/<meta[^>]+name="twitter:[^"]*"[^>]*>/g, '');

  const safeTitle = escapeHtmlAttr(meta.title);
  const safeDescription = escapeHtmlAttr(meta.description);
  const safeImage = escapeHtmlAttr(meta.image);
  const safeUrl = escapeHtmlAttr(meta.url);

  const metaTags = `
    <title>${safeTitle}</title>
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:secure_url" content="${safeImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
  `;

  html = html.replace('</head>', `${metaTags}</head>`);

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return response.status(200).send(html);
}
