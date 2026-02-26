import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HTMLFlipBook from 'react-pageflip';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

const API_BASE_ENDPOINT = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.DEV ? '/api' : 'https://backend.ascww.org/api');
const contractsPdfUrl = `${API_BASE_ENDPOINT}/tenders/download/standard-cnp-regulation`;
const contractsPdfDownloadUrl = contractsPdfUrl;
const INITIAL_RENDER_PAGES = 6;
const BACKGROUND_FLUSH_INTERVAL = 4;
const PAGE_CHUNK_SIZE = 6;
GlobalWorkerOptions.workerSrc = workerSrc;

type PdfDoc = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<{
    getViewport: (params: { scale: number }) => { width: number; height: number };
    render: (params: { canvas: HTMLCanvasElement; canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => { promise: Promise<void> };
  }>;
  destroy?: () => void;
  cleanup?: () => void;
};

type FlipBookRef = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
  };
};

type BookPageProps = {
  imageUrl: string;
  pageNumber: number;
  totalPages: number;
  isBlank?: boolean;
  isCover?: boolean;
};

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(({
  imageUrl,
  pageNumber,
  totalPages,
  isBlank = false,
  isCover = false,
}, ref) => {
  if (isBlank) {
    return <div ref={ref} className="h-full w-full rounded-md bg-[#f2eee3]" />;
  }

  return (
    <div
      ref={ref}
      className={`relative h-full w-full overflow-hidden rounded-md ${isCover ? 'bg-[#eadfc8]' : 'bg-[#f4f2ea]'}`}
    >
      {imageUrl ? (
        <img
          alt={`صفحة ${pageNumber}`}
          className="h-full w-full object-contain"
          draggable={false}
          src={imageUrl}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#faf8f2] to-[#efe9da]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0a3555]/15 border-t-[#d7b05a]" />
        </div>
      )}
    </div>
  );
});

BookPage.displayName = 'BookPage';

function ContractsRegulationPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loadedPagesCount, setLoadedPagesCount] = useState(0);
  const [pageImages, setPageImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChunkLoading, setIsChunkLoading] = useState(false);
  const flipBookRef = useRef<FlipBookRef | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<PdfDoc | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastSoundAtRef = useRef(0);
  const pageObjectUrlsRef = useRef<string[]>([]);
  const pageImagesRef = useRef<string[]>([]);
  const loadedPagesCountRef = useRef(0);
  const totalPagesRef = useRef(0);
  const aliveRef = useRef(true);

  const bookPages = useMemo(() => {
    if (pageImages.length === 0 || loadedPagesCount === 0) return [];
    const loadedOnly = pageImages.slice(0, loadedPagesCount);
    if (loadedOnly.length % 2 === 0) return loadedOnly;
    return [...loadedOnly, ''];
  }, [pageImages, loadedPagesCount]);

  const canFlipPrev = currentPage > 1;
  const canFlipNext = totalPages > 0 && (currentPage < loadedPagesCount || (loadedPagesCount < totalPages && !isChunkLoading));

  const releaseObjectUrls = () => {
    if (pageObjectUrlsRef.current.length === 0) return;
    pageObjectUrlsRef.current.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    pageObjectUrlsRef.current = [];
  };

  useEffect(() => {
    pageImagesRef.current = pageImages;
  }, [pageImages]);

  useEffect(() => {
    loadedPagesCountRef.current = loadedPagesCount;
  }, [loadedPagesCount]);

  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);

  const playFlipSound = () => {
    if (!isSoundEnabled) return;
    const now = performance.now();
    if (now - lastSoundAtRef.current < 120) return;
    lastSoundAtRef.current = now;

    const AudioContextCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return;

    const context = audioContextRef.current ?? new AudioContextCtor();
    audioContextRef.current = context;
    const duration = 0.12;
    const sampleSize = Math.floor(context.sampleRate * duration);
    const buffer = context.createBuffer(1, sampleSize, context.sampleRate);
    const channel = buffer.getChannelData(0);

    for (let i = 0; i < sampleSize; i += 1) {
      const decay = 1 - i / sampleSize;
      channel[i] = (Math.random() * 2 - 1) * decay * decay;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();

    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = 860;
    filter.Q.value = 0.8;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    source.stop(context.currentTime + duration);
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const handlePdfDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch(contractsPdfDownloadUrl);
      if (!response.ok) throw new Error(`Download failed with status ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'standard-contracts-and-procurement-regulation.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = contractsPdfDownloadUrl;
      fallbackLink.rel = 'noopener noreferrer';
      fallbackLink.target = '_blank';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
    } finally {
      setIsDownloading(false);
    }
  };

  const renderPdfPageToImageUrl = async (doc: PdfDoc, pageNumber: number) => {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 0.66 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return '';

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    const imageDataUrl = await new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(canvas.toDataURL('image/jpeg', 0.62));
          return;
        }
        const blobUrl = URL.createObjectURL(blob);
        pageObjectUrlsRef.current.push(blobUrl);
        resolve(blobUrl);
      }, 'image/webp', 0.62);
    });

    return imageDataUrl;
  };

  const loadPageRange = async (fromPage: number, toPage: number) => {
    const doc = pdfDocRef.current;
    if (!doc) return;
    if (fromPage > toPage) return;

    setIsChunkLoading(true);
    const nextImages = [...pageImagesRef.current];
    let nextLoadedCount = loadedPagesCountRef.current;

    try {
      for (let pageNumber = fromPage; pageNumber <= toPage; pageNumber += 1) {
        if (!aliveRef.current) return;
        if (nextImages[pageNumber - 1]) {
          nextLoadedCount = Math.max(nextLoadedCount, pageNumber);
          continue;
        }

        const imageDataUrl = await renderPdfPageToImageUrl(doc, pageNumber);
        if (!aliveRef.current) return;
        if (!imageDataUrl) continue;

        nextImages[pageNumber - 1] = imageDataUrl;
        nextLoadedCount = Math.max(nextLoadedCount, pageNumber);

        if (pageNumber % BACKGROUND_FLUSH_INTERVAL === 0 || pageNumber === toPage) {
          pageImagesRef.current = [...nextImages];
          loadedPagesCountRef.current = nextLoadedCount;
          setPageImages([...nextImages]);
          setLoadedPagesCount(nextLoadedCount);
        }

        if (pageNumber % 4 === 0) {
          await new Promise((resolve) => window.setTimeout(resolve, 0));
        }
      }

      pageImagesRef.current = [...nextImages];
      loadedPagesCountRef.current = nextLoadedCount;
      setPageImages([...nextImages]);
      setLoadedPagesCount(nextLoadedCount);
    } finally {
      if (aliveRef.current) {
        setIsChunkLoading(false);
      }
    }
  };

  useEffect(() => {
    aliveRef.current = true;
    let loadingTask: ReturnType<typeof getDocument> | null = null;

    const loadPdf = async () => {
      setIsLoadingDocument(true);
      setLoadingError(null);
      setTotalPages(0);
      setLoadedPagesCount(0);
      setCurrentPage(1);
      setPageImages([]);
      releaseObjectUrls();

      try {
        const response = await fetch(contractsPdfUrl);
        if (!response.ok) {
          throw new Error(`PDF request failed with status ${response.status}`);
        }

        const pdfBytes = new Uint8Array(await response.arrayBuffer());
        loadingTask = getDocument({ data: pdfBytes });
        const doc = await loadingTask.promise;
        if (!aliveRef.current) return;

        const typedDoc = doc as unknown as PdfDoc;
        pdfDocRef.current = typedDoc;
        setTotalPages(typedDoc.numPages);
        totalPagesRef.current = typedDoc.numPages;
        const placeholders = Array.from({ length: typedDoc.numPages }, () => '');
        pageImagesRef.current = placeholders;
        loadedPagesCountRef.current = 0;
        setPageImages(placeholders);
        setLoadedPagesCount(0);

        await loadPageRange(1, Math.min(INITIAL_RENDER_PAGES, typedDoc.numPages));
        if (!aliveRef.current) return;
        setIsLoadingDocument(false);
      } catch {
        if (!aliveRef.current) return;
        setIsLoadingDocument(false);
        setLoadingError('تعذر تحميل ملف اللائحة. يمكنك استخدام زر تحميل PDF.');
      }
    };

    void loadPdf();

    return () => {
      aliveRef.current = false;
      void loadingTask?.destroy();
      pdfDocRef.current?.cleanup?.();
      pdfDocRef.current?.destroy?.();
      pdfDocRef.current = null;
      releaseObjectUrls();
    };
  }, []);

  const handleFlip = (event: { data?: number }) => {
    const nextPage = Number(event?.data ?? 0) + 1;
    setCurrentPage(nextPage);
    playFlipSound();

    const loadedCount = loadedPagesCountRef.current;
    const allCount = totalPagesRef.current;
    if (nextPage + 1 >= loadedCount && loadedCount < allCount && !isChunkLoading) {
      const nextStart = loadedCount + 1;
      const nextEnd = Math.min(nextStart + PAGE_CHUNK_SIZE - 1, allCount);
      void loadPageRange(nextStart, nextEnd);
    }
  };

  const flipPrev = () => {
    if (!canFlipPrev) return;
    flipBookRef.current?.pageFlip().flipPrev();
  };

  const flipNext = async () => {
    if (!canFlipNext) return;

    const loadedCount = loadedPagesCountRef.current;
    const allCount = totalPagesRef.current;

    if (currentPage >= loadedCount && loadedCount < allCount) {
      const nextStart = loadedCount + 1;
      const nextEnd = Math.min(nextStart + PAGE_CHUNK_SIZE - 1, allCount);
      await loadPageRange(nextStart, nextEnd);
      if (!aliveRef.current) return;
    }

    flipBookRef.current?.pageFlip().flipNext();
  };

  const toggleSound = () => {
    setIsSoundEnabled((prev) => !prev);
  };

  const toggleFullscreen = async () => {
    const element = stageRef.current;
    if (!element) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    } catch {
      // Ignore fullscreen API errors on unsupported browsers.
    }
  };

  return (
    <>
      <Header />
      <main
        className="bg-[radial-gradient(circle_at_20%_10%,_rgba(89,173,121,0.2),_transparent_45%),linear-gradient(180deg,#f2f8f3_0%,#e9f3ea_100%)]"
        dir="rtl"
      >
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="text-xl font-extrabold sm:text-2xl">
                اللائحة الموحدة للعقود والمشتريات
              </h1>
            </div>

            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <div className="rounded-3xl bg-gradient-to-l from-[#08253c] via-[#0f3b5e] to-[#0a3555] p-1">
                <div className="relative overflow-visible rounded-[22px] bg-[linear-gradient(160deg,#0b2a44_0%,#08223a_42%,#061a2e_100%)] p-3 sm:p-4 lg:p-5">
                  <div className="pointer-events-none absolute -right-20 top-8 h-48 w-48 rounded-full bg-[#d7b05a]/15 blur-3xl" />
                  <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#1170b0]/25 blur-3xl" />

                  <div className="relative z-10 flex flex-wrap items-center justify-end gap-3 pb-4">
                    <button
                      className="inline-flex items-center rounded-xl bg-[#d7b05a] px-4 py-2 text-sm font-bold text-[#0a3555] transition hover:bg-[#c79d41]"
                      disabled={isDownloading}
                      onClick={handlePdfDownload}
                      type="button"
                    >
                      {isDownloading ? 'جارٍ التحميل...' : 'تحميل PDF'}
                    </button>
                  </div>

                  <div className="w-full rounded-2xl border border-white/25 bg-[#0a2237]/65 p-0">
                    <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-white/10 px-3 py-2 text-white">
                      <span className="text-xs font-bold sm:text-sm">
                        {isLoadingDocument
                          ? 'جاري تجهيز الملف...'
                          : loadingError
                            ? 'تعذر العرض'
                            : isChunkLoading
                              ? `الصفحة ${currentPage} من ${totalPages} (جاري تجهيز صفحات إضافية...)`
                              : `الصفحة ${currentPage} من ${totalPages} (تم تجهيز ${loadedPagesCount} صفحة)`}
                      </span>
                    </div>

                    {isLoadingDocument ? (
                      <div className="flex h-[420px] items-center justify-center rounded-xl border border-white/20 bg-white/90">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0a3555]/20 border-t-[#d7b05a]" />
                      </div>
                    ) : loadingError ? (
                      <div className="rounded-xl border border-red-300/40 bg-red-50/95 px-4 py-5 text-center text-sm font-semibold text-red-700">
                        {loadingError}
                      </div>
                    ) : (
                      <div className="flipbook-stage h-[66vh] sm:h-[70vh] lg:h-[74vh]" ref={stageRef}>
                        <div className="absolute left-3 top-3 z-40 flex items-center gap-1 rounded-md border border-[#0a3555]/20 bg-[#b8d7b4]/95 px-1.5 py-1 shadow-[0_6px_14px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                          <button
                            aria-label={isSoundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
                            className="inline-flex h-7 w-7 items-center justify-center rounded text-[#173d2a] transition hover:bg-white/60 active:scale-95"
                            onClick={toggleSound}
                            title={isSoundEnabled ? 'كتم صوت التقليب' : 'تشغيل صوت التقليب'}
                            type="button"
                          >
                            {isSoundEnabled ? (
                              <svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 14V10H8L13 6V18L8 14H4Z" fill="currentColor" />
                                <path d="M16 9C17.2 10.1 17.2 13.9 16 15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                                <path d="M18.5 7C20.7 9.1 20.7 14.9 18.5 17" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                              </svg>
                            ) : (
                              <svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 14V10H8L13 6V18L8 14H4Z" fill="currentColor" />
                                <path d="M17 9L21 15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
                                <path d="M21 9L17 15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
                              </svg>
                            )}
                          </button>
                          <button
                            aria-label={isFullscreen ? 'إغلاق ملء الشاشة' : 'ملء الشاشة'}
                            className="inline-flex h-7 w-7 items-center justify-center rounded text-[#173d2a] transition hover:bg-white/60 active:scale-95"
                            onClick={toggleFullscreen}
                            title={isFullscreen ? 'إغلاق ملء الشاشة' : 'ملء الشاشة'}
                            type="button"
                          >
                            {isFullscreen ? (
                              <svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 3H3V9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                                <path d="M15 3H21V9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                                <path d="M9 21H3V15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                                <path d="M15 21H21V15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                              </svg>
                            ) : (
                              <svg fill="none" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 3H3V8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                                <path d="M16 3H21V8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                                <path d="M8 21H3V16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                                <path d="M16 21H21V16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                              </svg>
                            )}
                          </button>
                        </div>
                        <button
                          aria-label="الصفحة السابقة"
                          className="flipbook-stage-nav flipbook-stage-nav--left"
                          disabled={!canFlipPrev}
                          onClick={flipPrev}
                          type="button"
                        >
                          <span className="inline-block rotate-180" dir="ltr">❯</span>
                        </button>
                        <button
                          aria-label="الصفحة التالية"
                          className="flipbook-stage-nav flipbook-stage-nav--right"
                          disabled={!canFlipNext}
                          onClick={() => { void flipNext(); }}
                          type="button"
                        >
                          <span dir="ltr">❯</span>
                        </button>

                        <div className="flipbook-stage-glass h-full">
                          <div className="book-viewer-shell relative h-full w-full rounded-xl">
                            <HTMLFlipBook
                              autoSize
                              className="mx-auto h-full w-full"
                              clickEventForward
                              disableFlipByClick={false}
                              drawShadow
                              flippingTime={920}
                              height={900}
                              maxHeight={2000}
                              maxShadowOpacity={0.68}
                              maxWidth={2600}
                              minHeight={420}
                              minWidth={360}
                              mobileScrollSupport
                              onFlip={handleFlip}
                              showCover
                              showPageCorners
                              size="stretch"
                              startPage={0}
                              startZIndex={0}
                              style={{ margin: '0 auto' }}
                              swipeDistance={22}
                              useMouseEvents
                              usePortrait
                              width={900}
                              ref={flipBookRef}
                            >
                              {bookPages.map((imageUrl, index) => (
                                <BookPage
                                  imageUrl={imageUrl}
                                  isBlank={imageUrl === ''}
                                  isCover={index === 0 || index === bookPages.length - 1}
                                  key={`${index}-${imageUrl ? 'loaded' : 'placeholder'}`}
                                  pageNumber={Math.min(index + 1, totalPages)}
                                  totalPages={totalPages}
                                />
                              ))}
                            </HTMLFlipBook>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ContractsRegulationPage;
