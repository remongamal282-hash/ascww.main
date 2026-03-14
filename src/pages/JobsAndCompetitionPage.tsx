import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { CareerItem } from '../types';
import {
    CAREERS_ENDPOINT,
    CAREER_FILE_ENDPOINT,
    CAREER_IMAGE_ENDPOINT,
    extractPlainTextFromHtml,
    formatArabicDate,
} from '../utils/helpers';

const isImageFile = (path: string) => /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(path);

const sanitizeHtml = (html: string) => {
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
    return doc.body.innerHTML;
};

function setMetaTag(
    selector: string,
    attrName: 'name' | 'property',
    attrValue: string,
    content: string
) {
    let element = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
    }
    element.setAttribute('content', content);
}

function JobsAndCompetitionPage() {
    const [allItems, setAllItems] = useState<CareerItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadCareers = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(CAREERS_ENDPOINT, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Careers request failed with status ${response.status}`);
                }

                const payload = (await response.json()) as unknown;
                const payloadObject = (payload && typeof payload === 'object' ? payload : {}) as {
                    data?: unknown;
                    value?: unknown;
                    items?: unknown;
                };

                const rawItems = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payloadObject.data)
                        ? payloadObject.data
                        : Array.isArray(payloadObject.value)
                            ? payloadObject.value
                            : Array.isArray(payloadObject.items)
                                ? payloadObject.items
                                : [];

                const validItems = rawItems
                    .filter((item): item is CareerItem => typeof item === 'object' && item !== null)
                    .filter((item) => Number(item.active ?? 1) !== 0)
                    .sort((first, second) => {
                        const firstDate = new Date(first.created_at || first.updated_at || '').getTime();
                        const secondDate = new Date(second.created_at || second.updated_at || '').getTime();
                        if (!Number.isNaN(secondDate - firstDate) && secondDate !== firstDate) {
                            return secondDate - firstDate;
                        }
                        return Number(second.id ?? 0) - Number(first.id ?? 0);
                    });

                if (!active) return;
                setAllItems(validItems);
            } catch {
                if (!active) return;
                setError('فشل تحميل بيانات مسابقات الوظائف. يرجى المحاولة مرة أخرى.');
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCareers();
        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    const summaryText = useMemo(() => {
        const firstItem = allItems.find((item) => Number(item.type_id) === 1);
        if (!firstItem) return 'تابع أحدث الإعلانات والنتائج الخاصة بمسابقات الوظائف.';
        const extracted = extractPlainTextFromHtml(firstItem.description || '').slice(0, 180);
        return extracted || 'تابع أحدث الإعلانات والنتائج الخاصة بمسابقات الوظائف.';
    }, [allItems]);

    const currentJob = useMemo(() => {
        return allItems.find((item) => Number(item.type_id) === 1) || null;
    }, [allItems]);

    useEffect(() => {
        const pageUrl = window.location.href;
        const imageUrl = `${window.location.origin}/images/ascww-logo.png`;
        const title = 'مسابقات و وظائف';

        document.title = `${title} | شركة مياه أسيوط`;
        setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
        setMetaTag('meta[property="og:description"]', 'property', 'og:description', summaryText);
        setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
        setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
        setMetaTag('meta[property="og:image"]', 'property', 'og:image', imageUrl);
        setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
        setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
        setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', summaryText);
        setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
    }, [summaryText]);

    return (
        <>
            <Header />
            <main className="container mx-auto max-w-6xl px-4 py-8" dir="rtl">
                <div className="mb-8 text-center">
                    <p className="mx-auto max-w-2xl text-xl text-gray-600">
                        تابع أحدث الوظائف  الخاصة بالشركة.
                    </p>
                </div>

                {loading ? (
                    <div className="flex h-64 flex-col items-center justify-center">
                        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
                        <p className="font-medium text-gray-500">جاري تحميل مسابقات الوظائف...</p>
                    </div>
                ) : error ? (
                    <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 p-8 text-red-500">
                        <p className="text-lg font-medium text-red-800">{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-6 rounded-lg border border-red-200 bg-white px-6 py-2 text-red-700 shadow-sm transition-colors hover:bg-red-50"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                ) : (
                    <>
                        {currentJob ? (() => {
                            const filePath = String(currentJob.file_path || '').trim();
                            const imagePath = String(currentJob.image_path || '').trim();
                            const fileUrl = filePath
                                ? `${CAREER_FILE_ENDPOINT}/${encodeURIComponent(filePath)}`
                                : '';
                            const imageUrl = imagePath && isImageFile(imagePath)
                                ? `${CAREER_IMAGE_ENDPOINT}/${encodeURIComponent(imagePath)}`
                                : '';
                            const descriptionHtml = sanitizeHtml(String(currentJob.description || '').trim());

                            return (
                                <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                                    {imageUrl ? (
                                        <div className="h-56 w-full overflow-hidden bg-slate-100">
                                            <img
                                                src={imageUrl}
                                                alt={currentJob.title || 'صورة إعلان'}
                                                className="h-full w-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>
                                    ) : null}
                                    <div className="space-y-4 p-6">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold text-slate-900">{currentJob.title}</h2>
                                            <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                                                {currentJob.created_at ? (
                                                    <span>تاريخ النشر: {formatArabicDate(currentJob.created_at)}</span>
                                                ) : null}
                                            </div>
                                        </div>
                                        {descriptionHtml ? (
                                            <div
                                                className="prose prose-sm max-w-none text-slate-700"
                                                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                                            />
                                        ) : null}
                                        {fileUrl ? (
                                            <div className="overflow-hidden rounded-xl border border-slate-200">
                                                <iframe
                                                    title={currentJob.title || 'ملف الإعلان'}
                                                    src={fileUrl}
                                                    className="h-[520px] w-full"
                                                />
                                            </div>
                                        ) : null}
                                        {fileUrl ? (
                                            <div className="flex flex-wrap gap-3">
                                                <a
                                                    className="inline-flex items-center justify-center rounded-lg bg-[#0a3555] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#082b47]"
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    تحميل الملف
                                                </a>
                                                <a
                                                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    فتح الملف
                                                </a>
                                            </div>
                                        ) : null}
                                    </div>
                                </article>
                            );
                        })() : (
                            <section className="mx-auto mt-4 max-w-3xl overflow-hidden rounded-2xl border-2 border-[#d7b05a]/40 bg-gradient-to-b from-[#0a3555]/5 to-white p-3 text-center shadow-sm sm:p-4">
                                <img
                                    src="/images/jobs.webp"
                                    alt="لا توجد وظائف حالياً"
                                    className="mx-auto h-auto max-h-[420px] w-full rounded-xl object-contain shadow-[0_14px_30px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/10"
                                    loading="lazy"
                                />
                            </section>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}

export default JobsAndCompetitionPage;
