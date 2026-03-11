import { useCallback, useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';

const trainingSlides = [
  { src: '/images/training/47.webp', alt: 'قاعة التدريب رقم 1' },
  { src: '/images/training/48.webp', alt: 'قاعة التدريب رقم 2' },
  { src: '/images/training/49.webp', alt: 'قاعة التدريب رقم 3' },
  { src: '/images/training/50.webp', alt: 'قاعة التدريب رقم 4' },
];
const SLIDE_INTERVAL_MS = 4000;

const trainingTabs = [
  {
    id: 'goals',
    title: 'أهدافنا الاستراتيجية',
    description:
      'إعداد الكوادر الإدارية والفنية المتخصصة كل في مجاله\nتنمية الموارد البشرية بمساعدتها على اكتساب وتحسين المهارات والكفاءات للقيام بالواجبات الحالية والمستقبلية\nتمكين الشركة من العمل طبقا لمعايير الجودة المطلوبة\nتعزيز فرص النمو والتطور لدى موظفي الشركة من أجل تنمية طاقاتهم',
  },
  {
    id: 'values',
    title: 'قيمنا',
    description:
      'الولاء والانتماء . المصداقية . الالتزام وبناء الثقة . الشفافية',
  },
  {
    id: 'mission',
    title: 'رسالتنا',
    description:
      'الإشراف الكامل على مختلف صور التدريب\nحسن اختيار الكوادر المسئولة عن إدارة منظومة التدريب.',
  },
  {
    id: 'vision',
    title: 'رؤيتنا',
    description:
      'الوصول إلى مستوى أداء عالمى فى إطار منظومة من القيم السائدة',
  },
];

const trainingShowcaseItems = [
  {
    id: 'training-specialist',
    title: 'اخصائى تدريب',
    image: '/images/training/61.webp',
    points: [
      'قياس مردود التدريب والعائد على الاستثمار',
      'برنامج المحاسب المحترف الشامل',
      'التحويل الرقمى وكيفية تطبيق من خلال البرامج',
      'مهارات اعداد المواد التفاعلية للتدريب الالكتروني',
      'التسويق الالكتروني',
    ],
  },
  {
    id: 'item-2-mechanic',
    title: 'فنى حملة',
    image: '/images/training/64.webp',
    points: [
      'دورة الزيت',
      'الدوائر الاساسية فى المركبات',
      'انواع المركبات و مكوناتها والاعطال الشائعة',
      'انواع المركبات ومكوناتها والاعطال الشائعة',
    ],
  },
  {
    id: 'community-awareness',
    title: 'ادارة التوعية -المشاركه الاجتماعيه',
    image: '/images/training/56.webp',
    points: [
      'كيفية اعداد البحوث الكمية والنوعية واعداد المسوح المجتمعية الميداني',
      'مهارات الارشاد والتوعية',
      'الاتصال والتواصل المجتمعى والمشاركة المجتمعية',
    ],
  },
  {
    id: 'admin',
    title: 'إدارى',
    image: '/images/training/59.webp',
    points: [
      'fidic',
      'مسار وظيفى للدرجات القيادية',
      'ادارة الازمات',
      'ادارة الوقت',
      'الاتجاهات الحديثة فى الادارة',
      'طرق الوقاية من مخاطر بيئة العمل وانواع هذه المخاطر',
      'المهارات المتقدمة فى اعداد التقارير والخطابات والمذكرات',
      'مهارات وضع معايير التقييم ومؤشرات الاداء',
      'TOT',
      'اعداد كوادر لصف ثانى',
      'لغة انجليزية',
    ],
  },
  {
    id: 'hr',
    title: 'موارد بشرية',
    image: '/images/training/60.webp',
    points: [
      'احكام قانون كسب العمل وتعديلاتة',
      'تقييم الأداء',
      'اعداد الهياكل التنظيمية تحليل الوظائف',
      'التسويات',
      'انشاء وثائق الخدمة',
      'اجراءات العمل بالموارد البشرية',
      'اجراءات العمل بالموارد البشرية',
      'استراتيجة الموارد البشرية',
      'دليل لائحة واجراءات',
    ],
  },
  {
    id: 'item-6-public-relations',
    title: 'علاقات عامة',
    image: '/images/training/58.webp',
    points: [
      'PHOTOSHOP',
      'التسويق الرقمى',
      'بحوث الراى',
      'العلاقات العامة من منظور جديد',
      'ادارة المراسم والبروتوكولات وتنظيم المعارض والمؤتمرات',
      'كتابة وصياغة الاخبار الصحفية والتقارير الصحفية',
    ],
  },
  {
    id: 'item-9-it-programs',
    title: 'برامج تكنولوجيا المعلومات',
    image: '/images/training/57.webp',
    points: [
      'CCNA Certification',
      'icdl',
    ],
  },
  {
    id: 'secretariat',
    title: 'سكرتارية',
    image: '/images/training/63.webp',
    points: [
      'الارشفة وحفظ الملفات',
      'مهارات السكرتارية',
    ],
  },
  {
    id: 'security-specialist',
    title: 'أخصائي أمن',
    image: '/images/training/62.webp',
    points: [
      'كتابة التقارير الامني',
      'تأمين المنشأت',
    ],
  },
];

function GeneralAdminTrainingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState(trainingTabs[0]?.id ?? 'goals');
  const [openedHallImage, setOpenedHallImage] = useState<{ src: string; alt: string } | null>(null);
  const autoplayRef = useRef<number | null>(null);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current !== null) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (trainingSlides.length <= 1) return;
    stopAutoplay();
    autoplayRef.current = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % trainingSlides.length);
    }, SLIDE_INTERVAL_MS);
  }, [stopAutoplay]);

  const goToSlide = (index: number) => {
    const total = trainingSlides.length;
    setActiveSlide((index + total) % total);
    if (!isPaused) {
      startAutoplay();
    }
  };

  useEffect(() => {
    if (isPaused) {
      stopAutoplay();
      return undefined;
    }
    startAutoplay();
    return () => stopAutoplay();
  }, [isPaused, startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (!openedHallImage) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenedHallImage(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openedHallImage]);

  return (
    <>
      <Header />
      <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_50%)]" dir="rtl">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:py-10">
          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
            <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
              <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">الإدارة العامة للتدريب</h1>
              <p className="mt-2 text-sm text-white/90 sm:text-base">
                عرض أنواع التدريب المتاحة والقاعات المجهزة لعقد البرامج التدريبية.
              </p>
            </div>

            <div className="space-y-6 px-6 py-6 sm:px-8">
              <section
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-[0_22px_60px_rgba(15,23,42,0.45)]"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
                <div className="relative h-[260px] sm:h-[360px] lg:h-[460px]">
                    {trainingSlides.map((slide, index) => {
                      const isActive = index === activeSlide;
                      return (
                        <img
                          key={slide.src}
                          src={slide.src}
                          alt={slide.alt}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                            isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.04]'
                          }`}
                        />
                      );
                    })}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />

                  <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur">
                    الإدارة العامة للتدريب
                  </div>

                  <button
                    type="button"
                    onClick={() => goToSlide(activeSlide - 1)}
                    aria-label="الصورة السابقة"
                    className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-white/15 p-3 text-xl font-black text-white shadow-lg backdrop-blur transition hover:bg-white/30"
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    onClick={() => goToSlide(activeSlide + 1)}
                    aria-label="الصورة التالية"
                    className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-white/15 p-3 text-xl font-black text-white shadow-lg backdrop-blur transition hover:bg-white/30"
                  >
                    ‹
                  </button>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    {trainingSlides.map((_, index) => (
                      <button
                        key={`dot-${index}`}
                        type="button"
                        onClick={() => goToSlide(index)}
                        aria-label={`عرض الصورة رقم ${index + 1}`}
                        className={`h-2.5 w-7 rounded-full transition ${
                          index === activeSlide
                            ? 'bg-[#d7b05a] shadow-[0_0_10px_rgba(215,176,90,0.7)]'
                            : 'bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap gap-3">
                  {trainingTabs.map((tab) => {
                    const isActive = tab.id === activeTab;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-full px-4 py-2 text-sm font-bold transition sm:text-base ${
                          isActive
                            ? 'bg-gradient-to-l from-[#0a3555] to-[#1170b0] text-white shadow-[0_10px_24px_rgba(10,53,85,0.3)]'
                            : 'border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#1170b0]/50 hover:text-[#0a3555]'
                        }`}
                      >
                        {tab.title}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-slate-700 sm:p-5">
                  {trainingTabs.map((tab) => {
                    if (tab.id !== activeTab) return null;
                    const lines = tab.description.split('\n').map((line) => line.trim()).filter(Boolean);
                    if (lines.length > 1) {
                      return (
                        <ul key={tab.id} className="space-y-2 text-justify leading-8">
                          {lines.map((line) => (
                            <li key={line}>• {line}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={tab.id} className="text-justify leading-8">
                        {tab.description}
                      </p>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-700 shadow-sm sm:p-6">
                <h2 className="text-lg font-extrabold text-[#0a3555] sm:text-xl">أنواع البرامج التدريبية</h2>
                <ul className="mt-3 space-y-2 text-justify leading-8">
                  <li>• حصول التدريب علي الايزو</li>
                </ul>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {trainingShowcaseItems.map((item) => (
                    <article
                      key={item.id}
                      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-[0_16px_36px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#1170b0]/40 hover:shadow-[0_22px_50px_rgba(15,23,42,0.18)]"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(10,53,85,0.08),_transparent_55%)] transition duration-300 group-hover:opacity-80" />
                      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100">
                        <div className="absolute -top-16 right-8 h-28 w-28 rounded-full bg-[#1170b0]/15 blur-2xl" />
                        <div className="absolute -bottom-10 left-6 h-24 w-24 rounded-full bg-[#d7b05a]/25 blur-2xl" />
                      </div>
                      <div className="relative">
                        <h3
                          className={`text-xl font-extrabold text-[#0a3555] transition duration-300 group-hover:text-[#1170b0] ${
                            item.id === 'community-awareness' ? 'sm:whitespace-nowrap' : ''
                          }`}
                        >
                          {item.title}
                        </h3>
                        <div
                          className={`mx-auto mt-4 flex h-44 w-56 items-center justify-center rounded-2xl bg-slate-50 p-2 shadow-none ${
                            item.id === 'item-6-public-relations' ? 'mb-12' : ''
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            loading="lazy"
                            className={`h-full w-full rounded-xl object-contain object-center transition duration-300 group-hover:scale-[1.03] ${
                              item.id === 'community-awareness' ? 'scale-[1.06]' : ''
                            }`}
                          />
                        </div>
                        <ul
                          className={`-mr-2 pl-2 pr-0 text-right text-sm leading-7 text-slate-700 ${
                            item.id === 'community-awareness'
                              ? 'mt-4 space-y-5'
                              : item.id === 'hr'
                                ? 'mt-4 flex min-h-[260px] flex-col justify-between'
                                : item.id === 'training-specialist'
                                  ? 'mt-4 space-y-4'
                                : item.id === 'item-2-mechanic'
                                  ? 'mt-4 space-y-4'
                                : item.id === 'item-6-public-relations'
                                  ? 'mt-6 space-y-10'
                                : item.id === 'item-9-it-programs'
                                  ? 'mt-6 space-y-5'
                                  : 'mt-4 space-y-2'
                          } ${item.id === 'hr' ? 'px-3 py-3 text-slate-800 leading-[3.2]' : ''}`}
                        >
                          {item.points.map((point) => (
                            <li
                              key={point}
                              className={
                                point === 'ادارة المراسم والبروتوكولات وتنظيم المعارض والمؤتمرات'
                                  ? 'sm:whitespace-nowrap'
                                  : undefined
                              }
                            >
                              • {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-2xl font-extrabold text-[#0a3555]">القاعات</h2>
                <div className="mt-2 text-sm leading-7 text-slate-700">
                  <p className="text-base font-semibold leading-7 sm:whitespace-nowrap">
                    يوجد لدينا قاعات تدريب بشركه مياه أسيوط والصرف الصحي متاح الاستعلام والحجز من أي جهه داخل أو خارج الشركة
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#1170b0]/10 px-3 py-1 font-bold text-[#1170b0]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-sm">📞</span>
                      0882334346
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#0a3555]/10 px-3 py-1 font-bold text-[#0a3555]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-sm">📱</span>
                      01280733381
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-700">
                      وسائل التواصل
                      <a
                        href="https://www.facebook.com/ASCWWeg"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="فيسبوك"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#1877f2] shadow-sm transition hover:-translate-y-0.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 2h-3a6 6 0 0 0-6 6v4H7v4h2v6h4v-6h3l1-4h-4V8a2 2 0 0 1 2-2h1z" />
                        </svg>
                      </a>
                      <a
                        href="https://api.whatsapp.com/send?phone=201281565653"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="واتساب"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#25d366] shadow-sm transition hover:-translate-y-0.5"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </a>
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
                  <button
                    type="button"
                    onClick={() => setOpenedHallImage({ src: '/images/training/47.webp', alt: 'قاعة رقم 1' })}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 cursor-zoom-in"
                    aria-label="تكبير صورة قاعة رقم 1"
                  >
                    <img
                      src="/images/training/47.webp"
                      alt="قاعة رقم 1"
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/25 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur">
                        <span className="text-base">🔍</span>
                        تكبير
                      </span>
                    </span>
                  </button>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-slate-700">
                    <h2 className="text-xl font-extrabold text-[#0a3555]">قاعة رقم ( 1 )</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#1170b0]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📞</span>
                      0882334346
                    </p>
                    <p className="mt-3 leading-7 text-justify">
                      لعقد ورش عمل تسع 30 فرد مجهزه بأحدث الأجهزه.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-7">
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📽️</span>شاشة عرض ( Projector ( smart board ))</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🖥️</span>جهاز كبيوتر ( pc )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🎤</span>ميكرفون ( Sound system )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📹</span>كاميرا ( Video cam )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🧰</span>أدوات مساعدات تدريبيه</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🧾</span>سبوره بيضاء ( White board )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">✍️</span>قلم سبوره ( penboard )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🎒</span>حقيبه أدوات التدريب ( Training tools bag )</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
                  <button
                    type="button"
                    onClick={() => setOpenedHallImage({ src: '/images/training/48.webp', alt: 'قاعة رقم 2' })}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 cursor-zoom-in"
                    aria-label="تكبير صورة قاعة رقم 2"
                  >
                    <img
                      src="/images/training/48.webp"
                      alt="قاعة رقم 2"
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/25 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur">
                        <span className="text-base">🔍</span>
                        تكبير
                      </span>
                    </span>
                  </button>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-slate-700">
                    <h2 className="text-xl font-extrabold text-[#0a3555]">قاعة رقم ( 2 )</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#1170b0]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📞</span>
                      0882334346
                    </p>
                    <p className="mt-3 leading-7 text-justify">
                      قاعة محاضرات تسع 50 متدريب مجهزه بأحدث الأجهزه.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-7">
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📽️</span>شاشة عرض ( Projector ( smart board ))</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🖥️</span>جهاز كبيوتر ( pc )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🎤</span>ميكرفون ( Sound system )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📹</span>كاميرا ( Video cam )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🧰</span>أدوات مساعدات تدريبيه</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🧾</span>سبوره بيضاء ( White board )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">✍️</span>قلم سبوره ( penboard )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🎒</span>حقيبه أدوات التدريب ( Training tools bag )</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
                  <button
                    type="button"
                    onClick={() => setOpenedHallImage({ src: '/images/training/49.webp', alt: 'قاعة رقم 3' })}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 cursor-zoom-in"
                    aria-label="تكبير صورة قاعة رقم 3"
                  >
                    <img
                      src="/images/training/49.webp"
                      alt="قاعة رقم 3"
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/25 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur">
                        <span className="text-base">🔍</span>
                        تكبير
                      </span>
                    </span>
                  </button>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-slate-700">
                    <h2 className="text-xl font-extrabold text-[#0a3555]">قاعة رقم ( 3 )</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#1170b0]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📞</span>
                      0882334346
                    </p>
                    <p className="mt-3 leading-7 text-justify">
                      قاعه التعليم الاَلكتروني تسع 20 متدرب مجهزه بأحدث الأجهزه.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-7">
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📽️</span>شاشة عرض ( Projector ( smart board ))</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🖥️</span>جهاز كبيوتر ( pc )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🎤</span>ميكرفون ( Sound system )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📹</span>كاميرا ( Video cam )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🧰</span>أدوات مساعدات تدريبيه</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🧾</span>سبوره بيضاء ( White board )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">✍️</span>قلم سبوره ( penboard )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🎒</span>حقيبه أدوات التدريب ( Training tools bag )</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
                  <button
                    type="button"
                    onClick={() => setOpenedHallImage({ src: '/images/training/50.webp', alt: 'قاعة رقم 4' })}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/70 cursor-zoom-in"
                    aria-label="تكبير صورة قاعة رقم 4"
                  >
                    <img
                      src="/images/training/50.webp"
                      alt="قاعة رقم 4"
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/25 opacity-0 transition duration-300 group-hover:opacity-100">
                      <span className="flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur">
                        <span className="text-base">🔍</span>
                        تكبير
                      </span>
                    </span>
                  </button>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-slate-700">
                    <h2 className="text-xl font-extrabold text-[#0a3555]">قاعة رقم ( 4 )</h2>
                    <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#1170b0]">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📞</span>
                      0882334346
                    </p>
                    <p className="mt-3 leading-7 text-justify">
                      قاعة إجتماعات (U-SHAPE) تسع 30 متدرب مجهزه بأحدث الأجهزه.
                    </p>
                    <ul className="mt-4 space-y-2 text-sm leading-7">
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📽️</span>شاشة عرض ( Projector ( smart board ))</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🖥️</span>جهاز كبيوتر ( pc )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🎤</span>ميكرفون ( Sound system )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">📹</span>كاميرا ( Video cam )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🧰</span>أدوات مساعدات تدريبيه</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🧾</span>سبوره بيضاء ( White board )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">✍️</span>قلم سبوره ( penboard )</li>
                      <li><span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1170b0]/10 text-sm">🎒</span>حقيبه أدوات التدريب ( Training tools bag )</li>
                    </ul>
                  </div>
                </div>
              </section>

            </div>
          </section>
        </div>
      </main>
      {openedHallImage ? (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/80 p-4"
          onClick={() => setOpenedHallImage(null)}
        >
          <div
            className="relative w-full max-w-[92vw] overflow-hidden rounded-xl border border-white/15 bg-slate-950"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenedHallImage(null)}
              className="absolute left-3 top-3 z-10 rounded-lg bg-black/60 px-3 py-1 text-sm font-bold text-white transition hover:bg-black/80"
            >
              إغلاق
            </button>
            <img
              src={openedHallImage.src}
              alt={openedHallImage.alt}
              className="max-h-[82vh] w-full object-contain"
            />
          </div>
        </div>
      ) : null}
      <Footer />
    </>
  );
}

export default GeneralAdminTrainingPage;
