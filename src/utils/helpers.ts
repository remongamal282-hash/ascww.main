import type { NewsItem, ProjectItem, TenderItem } from '../types';
import { ROUTES } from '../constants/routes';

export const API_BASE_ENDPOINT = import.meta.env.VITE_API_BASE_URL || '/api';
export const ADMIN_INFO_ENDPOINT = `${API_BASE_ENDPOINT}/admin-info`;
export const ADMIN_IMAGE_ENDPOINT = `${API_BASE_ENDPOINT}/image`;
export const NEWS_ENDPOINT = `${API_BASE_ENDPOINT}/news/home`;
export const NEWS_IMAGE_ENDPOINT = `${API_BASE_ENDPOINT}/news/image`;
export const NEWS_ARCHIVE_PATH = ROUTES.newsArchive;
export const PROJECTS_ENDPOINT = `${API_BASE_ENDPOINT}/projects/home`;
export const PROJECT_IMAGE_ENDPOINT = `${API_BASE_ENDPOINT}/projects/image`;
export const PROJECTS_ARCHIVE_PATH = ROUTES.projectsArchive;
export const TENDERS_ENDPOINT = `${API_BASE_ENDPOINT}/tenders`;
export const TENDER_FILE_ENDPOINT = `${API_BASE_ENDPOINT}/tenders/file`;
export const TENDERS_ARCHIVE_PATH = ROUTES.tendersArchive;
export const CAREERS_ENDPOINT = `${API_BASE_ENDPOINT}/careers`;
export const CAREER_FILE_ENDPOINT = `${API_BASE_ENDPOINT}/careers/file`;
export const CAREER_IMAGE_ENDPOINT = `${API_BASE_ENDPOINT}/careers/image`;
export const CAREERS_PCR_ENDPOINT = `${API_BASE_ENDPOINT}/careers/pcr`;
export const CAREERS_GER_ENDPOINT = `${API_BASE_ENDPOINT}/careers/ger`;
export const CAREERS_WED_ENDPOINT = `${API_BASE_ENDPOINT}/careers/wed`;
export const CAREERS_WTR_ENDPOINT = `${API_BASE_ENDPOINT}/careers/wtr`;
export const CAREERS_PED_ENDPOINT = `${API_BASE_ENDPOINT}/careers/ped`;
export const CAREERS_PTR_ENDPOINT = `${API_BASE_ENDPOINT}/careers/ptr`;
export const CAREERS_ID_ENDPOINT = `${API_BASE_ENDPOINT}/careers/id`;
export const CAREERS_AN_ENDPOINT = `${API_BASE_ENDPOINT}/careers/an`;
export const BOSS_SINGLE_LINE_PHRASE = 'تحية تقدير وإعزاز لكل مواطن يساعد ويساهم في تحقيق هذا الهدف المنشود';

const buildDetailsPath = (pattern: string, id: string) => pattern.replace(':id', encodeURIComponent(id));

export const extractPlainTextFromHtml = (html?: string) => {
    if (!html) return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return (doc.body.textContent || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
};

export const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).trim()}...`;
};

export const formatArabicDate = (value?: string) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

export const getLatestNewsImagePath = (newsItem: NewsItem) => {
    const images = newsItem.news_images || [];
    const mainImage = images.find((image) => Number(image.main_image) === 1);
    const fallbackImage = images[0];
    return (mainImage?.path || fallbackImage?.path || '').trim();
};

export const getNewsDetailsPath = (newsItem: NewsItem) => {
    const id = newsItem.id ?? newsItem.slug;
    if (id === undefined || id === null || `${id}`.trim() === '') return NEWS_ARCHIVE_PATH;
    return buildDetailsPath(ROUTES.newsDetails, String(id));
};

export const getProjectImagePath = (projectItem: ProjectItem) => {
    const images = projectItem.project_images || [];
    const mainImage = images.find((image) => Number(image.main_image) === 1);
    const fallbackImage = images[0];
    return (mainImage?.path || fallbackImage?.path || '').trim();
};

export const getProjectRouteId = (projectItem: ProjectItem) => {
    const directId = projectItem.id ?? projectItem.slug;
    if (directId !== undefined && directId !== null && `${directId}`.trim() !== '') {
        return String(directId).trim();
    }

    const title = String(projectItem.title || '').trim();
    const createdAt = String(projectItem.created_at || '').trim();
    const updatedAt = String(projectItem.updated_at || '').trim();
    const fallbackId = [title, createdAt, updatedAt].filter(Boolean).join('|').trim();
    return fallbackId || null;
};

export const getProjectDetailsPath = (projectItem: ProjectItem) => {
    const routeId = getProjectRouteId(projectItem);
    if (!routeId) return PROJECTS_ARCHIVE_PATH;
    return buildDetailsPath(ROUTES.projectDetails, routeId);
};

export const getTenderRouteId = (tenderItem: TenderItem) => {
    const directId = tenderItem.id ?? tenderItem.slug;
    if (directId !== undefined && directId !== null && `${directId}`.trim() !== '') {
        return String(directId).trim();
    }

    const title = String(tenderItem.title || '').trim();
    const createdAt = String(tenderItem.created_at || '').trim();
    const expiresAt = String(tenderItem.expiration_date || '').trim();
    const fallbackId = [title, createdAt, expiresAt].filter(Boolean).join('|').trim();
    return fallbackId || null;
};

export const getTenderDetailsPath = (tenderItem: TenderItem) => {
    const routeId = getTenderRouteId(tenderItem);
    if (!routeId) return TENDERS_ARCHIVE_PATH;
    return buildDetailsPath(ROUTES.tenderDetails, routeId);
};

const isImageFile = (path: string) => /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(path);

export const getTenderImagePath = (tenderItem: TenderItem) => {
    const files = tenderItem.tender_files || [];
    const typedImage = files.find((file) => String(file.type || '').toLowerCase() === 'image' && String(file.path || '').trim());
    if (typedImage?.path) return typedImage.path.trim();

    const fallbackImage = files.find((file) => {
        const path = String(file.path || '').trim();
        return path && isImageFile(path);
    });

    return (fallbackImage?.path || '').trim();
};

export const sanitizeBossSpeechHtml = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    doc.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach((node) => node.remove());
    doc.body.querySelectorAll('*').forEach((element) => {
        Array.from(element.attributes).forEach((attribute) => {
            const attributeName = attribute.name.toLowerCase();
            const attributeValue = attribute.value.trim().toLowerCase();
            if (attributeName.startsWith('on')) {
                element.removeAttribute(attribute.name);
            }
            if (attributeName === 'style') {
                element.removeAttribute(attribute.name);
            }
            if ((attributeName === 'href' || attributeName === 'src') && attributeValue.startsWith('javascript:')) {
                element.removeAttribute(attribute.name);
            }
        });
    });

    // Remove empty paragraphs added by editors (e.g. <p><br></p>) to avoid large visual gaps.
    doc.body.querySelectorAll('p').forEach((paragraph) => {
        const hasMedia = paragraph.querySelector('img, video, iframe, object, embed');
        const text = (paragraph.textContent || '').replace(/\u00a0/g, ' ').trim();
        if (!hasMedia && text.length === 0) {
            paragraph.remove();
        }
    });

    doc.body.querySelectorAll('p').forEach((paragraph) => {
        const text = (paragraph.textContent || '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
        if (!text.includes(BOSS_SINGLE_LINE_PHRASE)) return;

        paragraph.classList.add('boss-speech-single-line-row');
        paragraph.innerHTML = paragraph.innerHTML.replace(
            BOSS_SINGLE_LINE_PHRASE,
            `<span class="boss-speech-single-line">${BOSS_SINGLE_LINE_PHRASE}</span>`
        );
    });

    return doc.body.innerHTML;
};
