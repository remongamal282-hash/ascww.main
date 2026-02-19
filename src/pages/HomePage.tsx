import { useEffect, useState } from 'react';
import type { AdminInfoResponse, NewsItem } from '../types';
import { ADMIN_INFO_ENDPOINT, NEWS_ENDPOINT } from '../utils/helpers';
import Header from '../components/Header';
import HeroSlider from '../components/HeroSlider';
import BossWord from '../components/BossWord';
import LatestNews from '../components/LatestNews';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';

function HomePage() {
  const [adminInfo, setAdminInfo] = useState<AdminInfoResponse | null>(null);
  const [adminInfoLoading, setAdminInfoLoading] = useState(true);
  const [adminInfoError, setAdminInfoError] = useState<string | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const loadAdminInfo = async () => {
      try {
        const response = await fetch(ADMIN_INFO_ENDPOINT, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Admin info request failed with status ${response.status}`);
        }
        const data = (await response.json()) as AdminInfoResponse;
        if (!active) return;
        setAdminInfo(data);
      } catch {
        if (!active) return;
        setAdminInfoError('تعذر تحميل كلمة السيد رئيس مجلس الإداره والعضو المنتدب حاليًا.');
      } finally {
        if (active) setAdminInfoLoading(false);
      }
    };
    loadAdminInfo();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadLatestNews = async () => {
      try {
        const response = await fetch(NEWS_ENDPOINT, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`News request failed with status ${response.status}`);
        }

        const payload = (await response.json()) as unknown;
        const payloadObject = (payload && typeof payload === 'object' ? payload : {}) as {
          data?: unknown;
          value?: unknown;
          items?: unknown;
        };

        const rawNewsItems = Array.isArray(payload)
          ? payload
          : Array.isArray(payloadObject.data)
            ? payloadObject.data
            : Array.isArray(payloadObject.value)
              ? payloadObject.value
              : Array.isArray(payloadObject.items)
                ? payloadObject.items
                : [];

        const validNewsItems = rawNewsItems
          .filter((item): item is NewsItem => typeof item === 'object' && item !== null)
          .filter((item) => Number(item.active ?? 1) !== 0)
          .sort((first, second) => {
            const firstDate = new Date(first.created_at || first.updated_at || '').getTime();
            const secondDate = new Date(second.created_at || second.updated_at || '').getTime();

            if (!Number.isNaN(secondDate - firstDate) && secondDate !== firstDate) {
              return secondDate - firstDate;
            }

            return Number(second.id ?? 0) - Number(first.id ?? 0);
          })
          .slice(0, 4);

        if (!active) return;
        setLatestNews(validNewsItems);
      } catch {
        if (!active) return;
        setNewsError('تعذر تحميل أحدث الأخبار حاليًا.');
      } finally {
        if (active) setNewsLoading(false);
      }
    };

    loadLatestNews();

    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const topBar = document.getElementById('site-topbar');
    const mainBar = document.getElementById('site-mainbar');
    const mainBarOffset = document.getElementById('mainbar-offset') as HTMLDivElement | null;
    const heroSlides = Array.from(document.querySelectorAll<HTMLElement>('.hero-slide'));
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroCta = document.getElementById('hero-cta') as HTMLAnchorElement | null;
    const heroContent = document.getElementById('hero-content');
    const heroPrev = document.getElementById('hero-prev') as HTMLButtonElement | null;
    const heroNext = document.getElementById('hero-next') as HTMLButtonElement | null;

    const cleanups: Array<() => void> = [];

    const getTopBarHeight = () => {
      if (!topBar) return 0;
      const topBarStyle = window.getComputedStyle(topBar);
      if (topBarStyle.display === 'none' || topBarStyle.visibility === 'hidden') return 0;
      return topBar.offsetHeight;
    };

    let topBarHeight = getTopBarHeight();

    const syncMainBar = () => {
      if (!mainBar) return;
      const shouldPin = window.scrollY > topBarHeight;
      mainBar.classList.toggle('is-pinned', shouldPin);
      if (mainBarOffset) {
        mainBarOffset.style.height = shouldPin ? `${mainBar.offsetHeight}px` : '0px';
      }
      if (window.scrollY > 12) {
        mainBar.classList.add('shadow-lg');
      } else {
        mainBar.classList.remove('shadow-lg');
      }
    };

    syncMainBar();

    const onResize = () => {
      topBarHeight = getTopBarHeight();
      syncMainBar();
    };

    window.addEventListener('scroll', syncMainBar, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    cleanups.push(() => window.removeEventListener('scroll', syncMainBar));
    cleanups.push(() => window.removeEventListener('resize', onResize));

    const updateHeroContent = (slideIndex: number) => {
      const slide = heroSlides[slideIndex];
      if (!slide) return;
      const title = (slide.dataset.title || '').trim();
      const subtitle = (slide.dataset.subtitle || '').trim();
      const link = (slide.dataset.link || '').trim();
      const cta = (slide.dataset.cta || '').trim();
      if (heroTitle && title) heroTitle.textContent = title;
      if (heroSubtitle) {
        if (subtitle) {
          heroSubtitle.textContent = subtitle;
          heroSubtitle.classList.remove('hidden');
        } else {
          heroSubtitle.textContent = '';
          heroSubtitle.classList.add('hidden');
        }
      }
      if (heroCta) {
        if (link) {
          heroCta.href = link;
          heroCta.classList.remove('hidden');
        } else {
          heroCta.classList.add('hidden');
        }
        if (cta) heroCta.textContent = cta;
      }
    };

    if (heroSlides.length > 0) {
      let currentSlide = heroSlides.findIndex((slide) => slide.classList.contains('is-active'));
      if (currentSlide < 0) currentSlide = 0;

      const triggerHeroTextAnimation = () => {
        if (!heroContent) return;
        heroContent.classList.remove('hero-content-animate');
        void heroContent.offsetWidth;
        heroContent.classList.add('hero-content-animate');
      };

      const moveToSlide = (nextIndex: number) => {
        heroSlides[currentSlide]?.classList.remove('is-active');
        heroSlides[nextIndex]?.classList.add('is-active');
        currentSlide = nextIndex;
        updateHeroContent(currentSlide);
        triggerHeroTextAnimation();
      };

      updateHeroContent(currentSlide);
      triggerHeroTextAnimation();

      let intervalId: number | undefined;
      const startAutoplay = () => {
        if (heroSlides.length <= 1) return;
        stopAutoplay();
        intervalId = window.setInterval(() => {
          const nextIndex = (currentSlide + 1) % heroSlides.length;
          moveToSlide(nextIndex);
        }, 6000);
      };

      const stopAutoplay = () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
      };

      startAutoplay();

      if (heroPrev) {
        const onPrevClick = () => {
          stopAutoplay();
          const nextIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length;
          moveToSlide(nextIndex);
          startAutoplay();
        };
        heroPrev.addEventListener('click', onPrevClick);
        cleanups.push(() => heroPrev.removeEventListener('click', onPrevClick));
      }

      if (heroNext) {
        const onNextClick = () => {
          stopAutoplay();
          const nextIndex = (currentSlide + 1) % heroSlides.length;
          moveToSlide(nextIndex);
          startAutoplay();
        };
        heroNext.addEventListener('click', onNextClick);
        cleanups.push(() => heroNext.removeEventListener('click', onNextClick));
      }

      cleanups.push(stopAutoplay);
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const delay = target.dataset.delay;
          if (delay) {
            setTimeout(() => {
              target.classList.add('in-view');
            }, Number(delay));
          } else {
            target.classList.add('in-view');
          }
          obs.unobserve(target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [latestNews, newsLoading]);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 420);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const messengerUrl = 'https://www.facebook.com/messages/t/364679160333044/';

  return (
    <>
      <Header />
      <main>
        <HeroSlider />
        <BossWord
          adminInfo={adminInfo}
          adminInfoLoading={adminInfoLoading}
          adminInfoError={adminInfoError}
        />
        <LatestNews
          latestNews={latestNews}
          newsLoading={newsLoading}
          newsError={newsError}
        />
        <MainContent />
      </main>
      <Footer />
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Messenger chat"
        className="fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#0084ff] text-white shadow-lg transition-transform duration-200 hover:scale-105"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.14 2 11.25c0 2.92 1.46 5.53 3.75 7.23V22l3.23-1.77c.98.27 2 .41 3.02.41 5.52 0 10-4.14 10-9.25S17.52 2 12 2zm1.16 12.32-2.54-2.7-4.95 2.7 5.45-5.79 2.59 2.7 4.89-2.7-5.44 5.79z" />
        </svg>
      </a>
      <button
        type="button"
        aria-label="العودة إلى أعلى الصفحة"
        onClick={scrollToTop}
        className={`fixed bottom-5 left-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0a3555] text-white shadow-lg transition-all duration-300 hover:bg-[#082b47] ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </>
  );
}

export default HomePage;

