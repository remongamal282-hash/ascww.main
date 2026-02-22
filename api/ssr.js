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

const extractItems = (payload) => {
  const payloadObject = payload && typeof payload === 'object' ? payload : {};
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payloadObject.data)) return payloadObject.data;
  if (Array.isArray(payloadObject.value)) return payloadObject.value;
  if (Array.isArray(payloadObject.items)) return payloadObject.items;
  return [];
};

const normalizeRouteBase = (value, fallback) => {
  const raw = String(value || '').trim();
  if (!raw) return fallback;
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  return withSlash.replace(/\/+$/, '') || fallback;
};

const getImagePath = (item, type) => {
  const imageKey = type === 'project' ? 'project_images' : 'news_images';
  const images = Array.isArray(item?.[imageKey]) ? item[imageKey] : [];
  const mainImage = images.find((image) => Number(image?.main_image) === 1);
  const fallback = images[0];
  return String(mainImage?.path || fallback?.path || '').trim();
};

const getRouteId = (item, type) => {
  const directId = item?.id ?? item?.slug;
  if (directId !== undefined && directId !== null && String(directId).trim() !== '') {
    return String(directId).trim();
  }

  if (type !== 'project') return null;
  const title = String(item?.title || '').trim();
  const createdAt = String(item?.created_at || '').trim();
  const updatedAt = String(item?.updated_at || '').trim();
  const fallbackId = [title, createdAt, updatedAt].filter(Boolean).join('|').trim();
  return fallbackId || null;
};

const getEntityConfig = (type, apiBase, siteUrl, id, routeBaseInput) => {
  if (type === 'project') {
    const routeBase = normalizeRouteBase(routeBaseInput, '/projects-company');
    return {
      listUrls: [`${apiBase}/projects`, `${apiBase}/projects/home`],
      imageBase: `${apiBase}/projects/image/`,
      meta: {
        title: 'شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد',
        description: 'أرشيف المشروعات الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.',
        image: `${siteUrl}/images/ascww-logo.png`,
        url: `${siteUrl}${routeBase}/${encodeURIComponent(id)}`,
      },
    };
  }

  const routeBase = normalizeRouteBase(routeBaseInput, '/news');
  return {
    listUrls: [`${apiBase}/news`, `${apiBase}/news/home`],
    imageBase: `${apiBase}/news/image/`,
    meta: {
      title: 'شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد',
      description: 'أرشيف الأخبار الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.',
      image: `${siteUrl}/images/ascww-logo.png`,
      url: `${siteUrl}${routeBase}/${encodeURIComponent(id)}`,
    },
  };
};

export default async function handler(request, response) {
  const rawId = request?.query?.id ?? '';
  const id = decodeURIComponent(String(rawId)).trim();
  const rawType = String(request?.query?.type ?? 'news').trim().toLowerCase();
  const type = rawType === 'project' ? 'project' : 'news';
  const routeBase = request?.query?.routeBase ?? request?.query?.routebase ?? '';

  const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://backend.ascww.org/api';
  const SITE_URL =
    process.env.VITE_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');

  const entityConfig = getEntityConfig(type, API_BASE_URL, SITE_URL, id, routeBase);
  const defaultMeta = entityConfig.meta;
  let meta = { ...defaultMeta };

  if (id) {
    try {
      for (const url of entityConfig.listUrls) {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            Accept: 'application/json',
          },
        });

        if (!res.ok) continue;
        const payload = await res.json();
        const items = extractItems(payload);
        const item = items.find((entry) => {
          if (!entry || typeof entry !== 'object') return false;
          const entryRouteId = getRouteId(entry, type);
          return Boolean(entryRouteId && id === entryRouteId);
        });

        if (!item) continue;
        const imagePath = getImagePath(item, type);
        const image = imagePath
          ? `${entityConfig.imageBase}${encodeURIComponent(imagePath)}`
          : defaultMeta.image;

        meta = {
          title: String(item.title || defaultMeta.title),
          description: stripHtml(String(item.description || defaultMeta.description)).slice(0, 200),
          image,
          url: defaultMeta.url,
        };
        break;
      }
    } catch {
      // keep default metadata
    }
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
    html = '<!doctype html><html><head></head><body><div id="root"></div></body></html>';
  }

  html = html.replace(/<title>.*?<\/title>/is, '');
  html = html.replace(/<meta[^>]+property="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/<meta[^>]+name="twitter:[^"]*"[^>]*>/g, '');

  const safeTitle = escapeHtmlAttr(meta.title);
  const safeDescription = escapeHtmlAttr(meta.description);
  const safeImage = escapeHtmlAttr(meta.image);
  const safeUrl = escapeHtmlAttr(meta.url);
  const safeImageAlt = escapeHtmlAttr(`صورة ${meta.title}`);

  const metaTags = `
    <title>${safeTitle}</title>
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:secure_url" content="${safeImage}" />
    <meta property="og:image:alt" content="${safeImageAlt}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
    <meta name="twitter:image:alt" content="${safeImageAlt}" />
  `;

  html = html.replace('</head>', `${metaTags}</head>`);

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return response.status(200).send(html);
}
