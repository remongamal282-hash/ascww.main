import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import HTMLFlipBook from 'react-pageflip';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import labPdfUrl from '../../lab1.pdf?url';

const labImages = [
  { src: '/images/Labofcompany/lab-1.webp', alt: 'صور المعمل المركزي - 1' },
  { src: '/images/Labofcompany/lab-2.webp', alt: 'صور المعمل المركزي - 2' },
  { src: '/images/Labofcompany/lab-3.webp', alt: 'صور المعمل المركزي - 3' },
  { src: '/images/Labofcompany/lab-4.webp', alt: 'صور المعمل المركزي - 4' },
];
const slideLabImage = '/images/Labofcompany/slide-lab.webp';
const FAST_OPEN_PAGES = 6;
const INITIAL_BACKGROUND_PAGES = 6;
const BACKGROUND_FLUSH_INTERVAL = 4;
const PAGE_CHUNK_SIZE = 6;
GlobalWorkerOptions.workerSrc = workerSrc;

type PdfDoc = {
  numPages: number;
  getPage: (pageNumber: number) => Promise<{
    getViewport: (params: { scale: number }) => { width: number; height: number };
    render: (params: {
      canvas: HTMLCanvasElement;
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
    }) => { promise: Promise<void> };
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
  isBlank?: boolean;
  isCover?: boolean;
};

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(({
  imageUrl,
  pageNumber,
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

const trimCanvasWhiteMargins = (source: HTMLCanvasElement) => {
  const ctx = source.getContext('2d', { willReadFrequently: true });
  if (!ctx) return source;

  const { width, height } = source;
  if (width < 2 || height < 2) return source;

  const pixels = ctx.getImageData(0, 0, width, height).data;
  const sampleStep = 2;
  const isNonWhite = (r: number, g: number, b: number, a: number) => a > 20 && (r < 245 || g < 245 || b < 245);

  const rowHasContent = (y: number) => {
    for (let x = 0; x < width; x += sampleStep) {
      const idx = (y * width + x) * 4;
      if (isNonWhite(pixels[idx], pixels[idx + 1], pixels[idx + 2], pixels[idx + 3])) return true;
    }
    return false;
  };

  const colHasContent = (x: number, top: number, bottom: number) => {
    for (let y = top; y <= bottom; y += sampleStep) {
      const idx = (y * width + x) * 4;
      if (isNonWhite(pixels[idx], pixels[idx + 1], pixels[idx + 2], pixels[idx + 3])) return true;
    }
    return false;
  };

  let top = 0;
  let bottom = height - 1;
  let left = 0;
  let right = width - 1;

  while (top < bottom && !rowHasContent(top)) top += 1;
  while (bottom > top && !rowHasContent(bottom)) bottom -= 1;
  while (left < right && !colHasContent(left, top, bottom)) left += 1;
  while (right > left && !colHasContent(right, top, bottom)) right -= 1;

  if (top === 0 && bottom === height - 1 && left === 0 && right === width - 1) return source;

  const pad = 8;
  const cropTop = Math.max(0, top - pad);
  const cropBottom = Math.min(height - 1, bottom + pad);
  const cropLeft = Math.max(0, left - pad);
  const cropRight = Math.min(width - 1, right + pad);
  const cropWidth = cropRight - cropLeft + 1;
  const cropHeight = cropBottom - cropTop + 1;

  if (cropWidth < 2 || cropHeight < 2) return source;

  const trimmed = document.createElement('canvas');
  trimmed.width = cropWidth;
  trimmed.height = cropHeight;
  const trimmedCtx = trimmed.getContext('2d');
  if (!trimmedCtx) return source;

  trimmedCtx.drawImage(
    source,
    cropLeft,
    cropTop,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight,
  );

  return trimmed;
};

function LabOfCompanyWaterPage() {
  const [selectedLabImage, setSelectedLabImage] = useState(labImages[0]);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [loadingPdfError, setLoadingPdfError] = useState<string | null>(null);
  const [pdfTotalPages, setPdfTotalPages] = useState(0);
  const [loadedPdfPagesCount, setLoadedPdfPagesCount] = useState(0);
  const [pdfPageImages, setPdfPageImages] = useState<string[]>([]);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [isPdfSoundEnabled, setIsPdfSoundEnabled] = useState(true);
  const [isPdfFullscreen, setIsPdfFullscreen] = useState(false);
  const [isPdfChunkLoading, setIsPdfChunkLoading] = useState(false);
  const pdfFlipBookRef = useRef<FlipBookRef | null>(null);
  const pdfStageRef = useRef<HTMLDivElement | null>(null);
  const pdfDocRef = useRef<PdfDoc | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastSoundAtRef = useRef(0);
  const pageObjectUrlsRef = useRef<string[]>([]);
  const pageImagesRef = useRef<string[]>([]);
  const loadedPagesCountRef = useRef(0);
  const totalPagesRef = useRef(0);
  const aliveRef = useRef(true);

  const bookPages = useMemo(() => {
    if (pdfPageImages.length === 0 || loadedPdfPagesCount === 0) return [];
    const loadedOnly = pdfPageImages.slice(0, loadedPdfPagesCount);
    if (loadedOnly.length % 2 === 0) return loadedOnly;
    return [...loadedOnly, ''];
  }, [pdfPageImages, loadedPdfPagesCount]);

  const canFlipPrev = currentPdfPage > 1;
  const canFlipNext = pdfTotalPages > 0
    && (currentPdfPage < loadedPdfPagesCount || (loadedPdfPagesCount < pdfTotalPages && !isPdfChunkLoading));

  const releaseObjectUrls = () => {
    if (pageObjectUrlsRef.current.length === 0) return;
    pageObjectUrlsRef.current.forEach((url) => {
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    pageObjectUrlsRef.current = [];
  };

  useEffect(() => {
    pageImagesRef.current = pdfPageImages;
  }, [pdfPageImages]);

  useEffect(() => {
    loadedPagesCountRef.current = loadedPdfPagesCount;
  }, [loadedPdfPagesCount]);

  useEffect(() => {
    totalPagesRef.current = pdfTotalPages;
  }, [pdfTotalPages]);

  const playFlipSound = () => {
    if (!isPdfSoundEnabled) return;
    const now = performance.now();
    if (now - lastSoundAtRef.current < 120) return;
    lastSoundAtRef.current = now;

    const AudioContextCtor = window.AudioContext
      || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
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
      setIsPdfFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const handlePdfDownload = async () => {
    if (isDownloadingPdf) return;
    setIsDownloadingPdf(true);

    try {
      const response = await fetch(labPdfUrl);
      if (!response.ok) throw new Error(`Download failed with status ${response.status}`);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = 'lab1.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      const fallbackLink = document.createElement('a');
      fallbackLink.href = labPdfUrl;
      fallbackLink.rel = 'noopener noreferrer';
      fallbackLink.target = '_blank';
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const renderPdfPageToImageUrl = async (doc: PdfDoc, pageNumber: number) => {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
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
    const exportCanvas = trimCanvasWhiteMargins(canvas);

    const imageDataUrl = await new Promise<string>((resolve) => {
      exportCanvas.toBlob((blob) => {
        if (!blob) {
          resolve(exportCanvas.toDataURL('image/jpeg', 0.9));
          return;
        }
        const blobUrl = URL.createObjectURL(blob);
        pageObjectUrlsRef.current.push(blobUrl);
        resolve(blobUrl);
      }, 'image/webp', 0.9);
    });

    return imageDataUrl;
  };

  const loadPageRange = async (fromPage: number, toPage: number) => {
    const doc = pdfDocRef.current;
    if (!doc || fromPage > toPage) return;

    setIsPdfChunkLoading(true);
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
          setPdfPageImages([...nextImages]);
          setLoadedPdfPagesCount(nextLoadedCount);
        }

        if (pageNumber % 4 === 0) {
          await new Promise((resolve) => window.setTimeout(resolve, 0));
        }
      }

      pageImagesRef.current = [...nextImages];
      loadedPagesCountRef.current = nextLoadedCount;
      setPdfPageImages([...nextImages]);
      setLoadedPdfPagesCount(nextLoadedCount);
    } finally {
      if (aliveRef.current) {
        setIsPdfChunkLoading(false);
      }
    }
  };

  useEffect(() => {
    aliveRef.current = true;
    let loadingTask: ReturnType<typeof getDocument> | null = null;

    const loadPdf = async () => {
      setIsLoadingPdf(true);
      setLoadingPdfError(null);
      setPdfTotalPages(0);
      setLoadedPdfPagesCount(0);
      setCurrentPdfPage(1);
      setPdfPageImages([]);
      releaseObjectUrls();

      try {
        let doc: unknown;
        try {
          loadingTask = getDocument({
            url: labPdfUrl,
            disableRange: false,
            disableStream: false,
          });
          doc = await loadingTask.promise;
        } catch {
          const response = await fetch(labPdfUrl);
          if (!response.ok) {
            throw new Error(`PDF request failed with status ${response.status}`);
          }
          const pdfBytes = new Uint8Array(await response.arrayBuffer());
          loadingTask = getDocument({ data: pdfBytes });
          doc = await loadingTask.promise;
        }
        if (!aliveRef.current) return;

        const typedDoc = doc as unknown as PdfDoc;
        pdfDocRef.current = typedDoc;
        setPdfTotalPages(typedDoc.numPages);
        totalPagesRef.current = typedDoc.numPages;
        const placeholders = Array.from({ length: typedDoc.numPages }, () => '');
        pageImagesRef.current = placeholders;
        loadedPagesCountRef.current = 0;
        setPdfPageImages(placeholders);
        setLoadedPdfPagesCount(0);

        const firstPaintEnd = Math.min(FAST_OPEN_PAGES, typedDoc.numPages);
        await loadPageRange(1, firstPaintEnd);
        if (!aliveRef.current) return;
        setIsLoadingPdf(false);

        const backgroundEnd = Math.min(INITIAL_BACKGROUND_PAGES, typedDoc.numPages);
        if (firstPaintEnd < backgroundEnd) {
          void loadPageRange(firstPaintEnd + 1, backgroundEnd).catch(() => {
            // Ignore background preload failures; page-demand loading still works.
          });
        }
      } catch {
        if (!aliveRef.current) return;
        setIsLoadingPdf(false);
        setLoadingPdfError('تعذر تحميل ملف المعمل. يمكنك استخدام زر تحميل PDF.');
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
    setCurrentPdfPage(nextPage);
    playFlipSound();

    const loadedCount = loadedPagesCountRef.current;
    const allCount = totalPagesRef.current;
    if (nextPage + 1 >= loadedCount && loadedCount < allCount && !isPdfChunkLoading) {
      const nextStart = loadedCount + 1;
      const nextEnd = Math.min(nextStart + PAGE_CHUNK_SIZE - 1, allCount);
      void loadPageRange(nextStart, nextEnd);
    }
  };

  const flipPrev = () => {
    if (!canFlipPrev) return;
    pdfFlipBookRef.current?.pageFlip().flipPrev();
  };

  const flipNext = async () => {
    if (!canFlipNext) return;

    const loadedCount = loadedPagesCountRef.current;
    const allCount = totalPagesRef.current;
    if (currentPdfPage >= loadedCount && loadedCount < allCount) {
      const nextStart = loadedCount + 1;
      const nextEnd = Math.min(nextStart + PAGE_CHUNK_SIZE - 1, allCount);
      await loadPageRange(nextStart, nextEnd);
      if (!aliveRef.current) return;
    }

    pdfFlipBookRef.current?.pageFlip().flipNext();
  };

  const toggleSound = () => {
    setIsPdfSoundEnabled((prev) => !prev);
  };

  const toggleFullscreen = async () => {
    const element = pdfStageRef.current;
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
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
              <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
                <h1 className="text-2xl font-extrabold sm:text-3xl">المعمل المركزي</h1>
                <p className="mt-2 text-sm font-semibold text-white/90 sm:text-base">
                  شركه مياه الشرب والصرف الصحي بأسيوط و الوادي الجديد / المعمل
                </p>
              </div>

	              <div className="space-y-6 px-4 py-6 sm:px-8 sm:py-8">
	                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
	                  <img
	                    src={slideLabImage}
	                    alt="المعمل المركزي لمياه الشركة"
	                    loading="lazy"
	                    className="h-full w-full object-cover"
	                  />
	                </section>

	                <article className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-6">
	                  <h2 className="text-xl font-extrabold text-[#0a3555]">تحليل العينات</h2>
                  <p className="mt-3 text-justify leading-8 text-slate-700">
                    يتم متابعة جودة المياه المنتجة من المحطات بكافة انواعها (مرشحة ونقالى و زلطية وجوفية ومعالجة
                    حديد ومنجنيز ) بأخذ عينات دورية من تلك المحطات وتحليلها بمعامل الشركة وذلك للوقوف على جودة المياه
                    المنتجة و التأكد من مدى مطابقتها للمواصفات و المعايير الواردة بقرار وزارة الصحة رقم 458 لسنة 2007
                    وانواع التحاليل كالتالى :
                  </p>
                  <ul className="mt-4 space-y-2 text-slate-700">
                    <li className="rounded-lg bg-white px-4 py-2 leading-7">
                      تحاليل فيزيائية : الرقم الهيدروجينى : العكارة , اللون , الطعم ,الرائحة
                    </li>
                    <li className="rounded-lg bg-white px-4 py-2 leading-7">
                      تحاليل كيميائية : حديد ، منجيز ، امونيا , عسر كلى ، عسر كالسيوم , عسر ماغنسيوم , القلوية الكلية
                      , الاملاح الذائبة الكلية
                    </li>
                    <li className="rounded-lg bg-white px-4 py-2 leading-7">تحاليل ميكروبيولوجية</li>
                    <li className="rounded-lg bg-white px-4 py-2 leading-7">فحص ميكروسكوبى</li>
                  </ul>
                </article>

                <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm sm:p-5">
                  <h3 className="mb-4 text-lg font-extrabold text-[#0a3555] sm:text-xl">صور المعمل المركزى</h3>
                  <div className="grid gap-4 lg:grid-cols-[1.65fr_1fr]">
                    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.14)]">
                      <img
                        src={selectedLabImage.src}
                        alt={selectedLabImage.alt}
                        loading="lazy"
                        className="h-[240px] w-full object-cover transition duration-500 group-hover:scale-[1.02] sm:h-[280px] lg:h-[320px]"
                      />
                    </article>

                    <div className="grid h-full grid-cols-2 grid-rows-2 gap-3">
                      {labImages.map((image) => (
                        <button
                          key={image.src}
                          type="button"
                          onClick={() => setSelectedLabImage(image)}
                          className={`group relative h-full min-h-[105px] overflow-hidden rounded-xl border bg-white text-right shadow-sm transition ${
                            selectedLabImage.src === image.src
                              ? 'border-[#0a3555] ring-2 ring-[#0a3555]/25'
                              : 'border-slate-200 hover:border-[#0a3555]/45'
                          }`}
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm sm:p-5">
                  <h3 className="mb-4 text-lg font-extrabold text-[#0a3555] sm:text-xl">ملف المعمل المركزى (PDF)</h3>
                  <div className="rounded-3xl bg-gradient-to-l from-[#08253c] via-[#0f3b5e] to-[#0a3555] p-1">
                    <div className="relative overflow-visible rounded-[22px] bg-[linear-gradient(160deg,#0b2a44_0%,#08223a_42%,#061a2e_100%)] p-3 sm:p-4 lg:p-5">
                      <div className="pointer-events-none absolute -right-20 top-8 h-48 w-48 rounded-full bg-[#d7b05a]/15 blur-3xl" />
                      <div className="pointer-events-none absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-[#1170b0]/25 blur-3xl" />

                      <div className="relative z-10 flex flex-wrap items-center justify-end gap-3 pb-4">
                        <button
                          className="inline-flex items-center rounded-xl bg-[#d7b05a] px-4 py-2 text-sm font-bold text-[#0a3555] transition hover:bg-[#c79d41]"
                          disabled={isDownloadingPdf}
                          onClick={handlePdfDownload}
                          type="button"
                        >
                          {isDownloadingPdf ? 'جارٍ التحميل...' : 'تحميل PDF'}
                        </button>
                      </div>

                      <div className="w-full rounded-2xl border border-white/25 bg-[#0a2237]/65 p-0">
                        <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-white/10 px-3 py-2 text-white">
                          <span className="text-xs font-bold sm:text-sm">
                            {isLoadingPdf
                              ? 'جاري تجهيز الملف...'
                              : loadingPdfError
                                ? 'تعذر العرض'
                                : isPdfChunkLoading
                                  ? `الصفحة ${currentPdfPage} من ${pdfTotalPages} (جاري تجهيز صفحات إضافية...)`
                                  : `الصفحة ${currentPdfPage} من ${pdfTotalPages} (تم تجهيز ${loadedPdfPagesCount} صفحة)`}
                          </span>
                        </div>

                        {isLoadingPdf ? (
                          <div className="flex h-[560px] items-center justify-center rounded-xl border border-white/20 bg-white/90">
                            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0a3555]/20 border-t-[#d7b05a]" />
                          </div>
                        ) : loadingPdfError ? (
                          <div className="rounded-xl border border-red-300/40 bg-red-50/95 px-4 py-5 text-center text-sm font-semibold text-red-700">
                            {loadingPdfError}
                          </div>
                        ) : (
                          <div className="mx-auto w-full max-w-[1240px]">
                            <div className="flipbook-stage h-[72vh] sm:h-[80vh] lg:h-[86vh]" ref={pdfStageRef}>
                            <div className="absolute left-3 top-3 z-40 flex items-center gap-1 rounded-md border border-[#0a3555]/20 bg-[#b8d7b4]/95 px-1.5 py-1 shadow-[0_6px_14px_rgba(0,0,0,0.2)] backdrop-blur-sm">
                              <button
                                aria-label={isPdfSoundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
                                className="inline-flex h-7 w-7 items-center justify-center rounded text-[#173d2a] transition hover:bg-white/60 active:scale-95"
                                onClick={toggleSound}
                                title={isPdfSoundEnabled ? 'كتم صوت التقليب' : 'تشغيل صوت التقليب'}
                                type="button"
                              >
                                {isPdfSoundEnabled ? (
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
                                aria-label={isPdfFullscreen ? 'إغلاق ملء الشاشة' : 'ملء الشاشة'}
                                className="inline-flex h-7 w-7 items-center justify-center rounded text-[#173d2a] transition hover:bg-white/60 active:scale-95"
                                onClick={toggleFullscreen}
                                title={isPdfFullscreen ? 'إغلاق ملء الشاشة' : 'ملء الشاشة'}
                                type="button"
                              >
                                {isPdfFullscreen ? (
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
                              <div className="book-viewer-shell relative mx-auto h-full w-full max-w-[1080px] rounded-xl sm:max-w-[1140px]">
                                <HTMLFlipBook
                                  autoSize
                                  className="mx-auto h-full w-full"
                                  clickEventForward
                                  disableFlipByClick={false}
                                  drawShadow
                                  flippingTime={920}
                                  height={720}
                                  maxHeight={1600}
                                  maxShadowOpacity={0.68}
                                  maxWidth={2200}
                                  minHeight={360}
                                  minWidth={420}
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
                                  width={980}
                                  ref={pdfFlipBookRef}
                                >
                                  {bookPages.map((imageUrl, index) => (
                                    <BookPage
                                      imageUrl={imageUrl}
                                      isBlank={imageUrl === ''}
                                      isCover={index === 0 || index === bookPages.length - 1}
                                      key={`${index}-${imageUrl ? 'loaded' : 'placeholder'}`}
                                      pageNumber={Math.min(index + 1, pdfTotalPages)}
                                    />
                                  ))}
                                </HTMLFlipBook>
                              </div>
                            </div>
                          </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default LabOfCompanyWaterPage;
