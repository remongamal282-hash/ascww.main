import type { NewsItem } from '../types';

export const API_BASE_ENDPOINT = import.meta.env.VITE_API_BASE_URL || '/api';
export const ADMIN_INFO_ENDPOINT = `${API_BASE_ENDPOINT}/admin-info`;
export const ADMIN_IMAGE_ENDPOINT = `${API_BASE_ENDPOINT}/image`;
export const NEWS_ENDPOINT = `${API_BASE_ENDPOINT}/news/home`;
export const NEWS_IMAGE_ENDPOINT = `${API_BASE_ENDPOINT}/news/image`;
export const NEWS_ARCHIVE_PATH = '/news-company';
export const BOSS_SINGLE_LINE_PHRASE = 'تحية تقدير وإعزاز لكل مواطن يساعد ويساهم في تحقيق هذا الهدف المنشود';

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
