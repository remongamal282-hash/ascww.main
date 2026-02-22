import fs from 'fs';
import path from 'path';

const SITE_TITLE = 'شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد';
const HOME_DESCRIPTION = 'البوابة الإلكترونية لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد: خدمات المياه، الصرف الصحي، التوعية، المناقصات، والتواصل مع المواطنين.';
const NEWS_DESCRIPTION = 'أرشيف الأخبار الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
const PROJECTS_DESCRIPTION = 'أرشيف المشروعات الرسمي لشركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد.';
const LOGO_PATH = '/images/ascww-logo.png';

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  name: SITE_TITLE,
  email: 'media-water@ascww.com.eg',
  telephone: '2331604',
  sameAs: [
    'https://www.facebook.com/ASCWWeg',
    'https://api.whatsapp.com/send?phone=01280733990',
    'https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw',
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'أسيوط',
    addressCountry: 'EG',
  },
};

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
  const normalized = withSlash.replace(/\/+$/, '');
  return normalized || '/';
};

const normalizeSiteUrl = (value) => {
  try {
    const parsed = new URL(String(value));
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return null;
  }
};

const readHeaderValue = (headers, name) => {
  if (!headers || typeof headers !== 'object') return '';
  const direct = headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
  const value = Array.isArray(direct) ? direct[0] : direct;
  return String(value || '')
    .split(',')[0]
    .trim();
};

const resolveSiteUrl = (request) => {
  const headers = request?.headers;
  const forwardedHost = readHeaderValue(headers, 'x-forwarded-host');
  const host = readHeaderValue(headers, 'host');
  const hostValue = forwardedHost || host;
  if (hostValue) {
    const forwardedProto = readHeaderValue(headers, 'x-forwarded-proto').toLowerCase();
    const isLocal = hostValue.includes('localhost') || hostValue.startsWith('127.0.0.1');
    const proto = forwardedProto === 'http' || forwardedProto === 'https'
      ? forwardedProto
      : isLocal
        ? 'http'
        : 'https';
    const dynamicUrl = normalizeSiteUrl(`${proto}://${hostValue}`);
    if (dynamicUrl) return dynamicUrl;
  }

  const envSiteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL || '');
  if (envSiteUrl) return envSiteUrl;
  if (process.env.VERCEL_URL) {
    const vercelUrl = normalizeSiteUrl(`https://${process.env.VERCEL_URL}`);
    if (vercelUrl) return vercelUrl;
  }
  return 'http://localhost:5173';
};

const buildPageUrl = (siteUrl, routeBase, id = '') => {
  const normalizedBase = normalizeRouteBase(routeBase, '/');
  const trimmedId = String(id || '').trim();
  if (!trimmedId) {
    return normalizedBase === '/' ? `${siteUrl}/` : `${siteUrl}${normalizedBase}`;
  }
  return `${siteUrl}${normalizedBase}/${encodeURIComponent(trimmedId)}`;
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
  if (type === 'home') {
    const routeBase = normalizeRouteBase(routeBaseInput, '/');
    return {
      listUrls: [],
      imageBase: '',
      ogType: 'website',
      twitterCard: 'summary',
      imageWidth: '400',
      imageHeight: '328',
      meta: {
        title: SITE_TITLE,
        description: HOME_DESCRIPTION,
        image: `${siteUrl}${LOGO_PATH}`,
        url: buildPageUrl(siteUrl, routeBase, ''),
      },
    };
  }

  if (type === 'project') {
    const routeBase = normalizeRouteBase(routeBaseInput, '/projects-company');
    return {
      listUrls: [`${apiBase}/projects`, `${apiBase}/projects/home`],
      imageBase: `${apiBase}/projects/image/`,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      imageWidth: '1200',
      imageHeight: '630',
      meta: {
        title: SITE_TITLE,
        description: PROJECTS_DESCRIPTION,
        image: `${siteUrl}${LOGO_PATH}`,
        url: buildPageUrl(siteUrl, routeBase, id),
      },
    };
  }

  const routeBase = normalizeRouteBase(routeBaseInput, '/news');
  return {
    listUrls: [`${apiBase}/news`, `${apiBase}/news/home`],
    imageBase: `${apiBase}/news/image/`,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    imageWidth: '1200',
    imageHeight: '630',
    meta: {
      title: SITE_TITLE,
      description: NEWS_DESCRIPTION,
      image: `${siteUrl}${LOGO_PATH}`,
      url: buildPageUrl(siteUrl, routeBase, id),
    },
  };
};

const loadHtmlTemplate = () => {
  const possiblePaths = [
    path.join(process.cwd(), 'dist', 'index.html'),
    path.join(process.cwd(), 'index.html'),
    path.join(process.cwd(), 'public', 'index.html'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, 'utf-8');
    }
  }

  return '<!doctype html><html><head></head><body><div id="root"></div></body></html>';
};

export default async function handler(request, response) {
  const rawId = request?.query?.id ?? '';
  const id = decodeURIComponent(String(rawId)).trim();
  const rawType = String(request?.query?.type ?? 'news').trim().toLowerCase();
  const type = rawType === 'project' || rawType === 'home' ? rawType : 'news';
  const routeBase = request?.query?.routeBase ?? request?.query?.routebase ?? '';

  const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://backend.ascww.org/api';
  const siteUrl = resolveSiteUrl(request);

  const entityConfig = getEntityConfig(type, API_BASE_URL, siteUrl, id, routeBase);
  const defaultMeta = entityConfig.meta;
  let meta = { ...defaultMeta };

  if (id && entityConfig.listUrls.length > 0) {
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

  let html = loadHtmlTemplate();
  html = html.replace(/<title>.*?<\/title>/is, '');
  html = html.replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '');
  html = html.replace(/<meta[^>]+name=["']description["'][^>]*>/gi, '');
  html = html.replace(/<meta[^>]+property=["']og:[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<meta[^>]+name=["']twitter:[^"']*["'][^>]*>/gi, '');
  html = html.replace(/<script[^>]+type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '');

  const safeTitle = escapeHtmlAttr(meta.title);
  const safeDescription = escapeHtmlAttr(meta.description);
  const safeImage = escapeHtmlAttr(meta.image);
  const safeUrl = escapeHtmlAttr(meta.url);
  const safeImageAlt = escapeHtmlAttr(`صورة ${meta.title}`);

  const orgJsonLd = {
    ...ORG_SCHEMA,
    url: `${siteUrl}/`,
    logo: `${siteUrl}${LOGO_PATH}`,
  };
  const safeOrgJsonLd = JSON.stringify(orgJsonLd).replace(/</g, '\\u003c');

  const metaTags = `
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeUrl}" />
    <meta property="og:type" content="${entityConfig.ogType}" />
    <meta property="og:locale" content="ar_EG" />
    <meta property="og:site_name" content="${escapeHtmlAttr(SITE_TITLE)}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta property="og:image" content="${safeImage}" />
    <meta property="og:image:url" content="${safeImage}" />
    <meta property="og:image:secure_url" content="${safeImage}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="${entityConfig.imageWidth}" />
    <meta property="og:image:height" content="${entityConfig.imageHeight}" />
    <meta property="og:image:alt" content="${safeImageAlt}" />
    <meta name="twitter:card" content="${entityConfig.twitterCard}" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    <meta name="twitter:image" content="${safeImage}" />
    <meta name="twitter:image:src" content="${safeImage}" />
    <meta name="twitter:image:alt" content="${safeImageAlt}" />
    <script type="application/ld+json">${safeOrgJsonLd}</script>
  `;

  html = html.replace('</head>', `${metaTags}</head>`);

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  return response.status(200).send(html);
}
