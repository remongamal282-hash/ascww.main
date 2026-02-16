import { useEffect, useState } from 'react';
import type { AdminInfoResponse, NewsItem } from './types';
import { ADMIN_INFO_ENDPOINT, NEWS_ENDPOINT } from './utils/helpers';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import BossWord from './components/BossWord';
import LatestNews from './components/LatestNews';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

function App() {
  const [adminInfo, setAdminInfo] = useState<AdminInfoResponse | null>(null);
  const [adminInfoLoading, setAdminInfoLoading] = useState(true);
  const [adminInfoError, setAdminInfoError] = useState<string | null>(null);
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);

  // تحميل بيانات رئيس مجلس الإدارة
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

  // تحميل الأخبار
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

  // إعداد DOM interactions (القائمة، السلايدر، الـ sticky header)
  useEffect(() => {
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const toggle = document.getElementById('mobile-toggle') as HTMLButtonElement | null;
    const mobileMenu = document.getElementById('mobile-menu');
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

    if (toggle && mobileMenu) {
      const closeMenu = () => {
        mobileMenu.classList.add('hidden');
        toggle.setAttribute('aria-expanded', 'false');
      };

      const onToggleClick = (event: MouseEvent) => {
        event.stopPropagation();
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden');
        toggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      };

      toggle.addEventListener('click', onToggleClick);

      const mobileLinks = Array.from(mobileMenu.querySelectorAll('a'));
      mobileLinks.forEach((link) => link.addEventListener('click', closeMenu));

      const onDocumentClick = (event: MouseEvent) => {
        const target = event.target as Node;
        const clickedInsideMenu = mobileMenu.contains(target);
        const clickedToggle = toggle.contains(target);
        if (!clickedInsideMenu && !clickedToggle) closeMenu();
      };

      document.addEventListener('click', onDocumentClick);

      cleanups.push(() => toggle.removeEventListener('click', onToggleClick));
      cleanups.push(() => mobileLinks.forEach((link) => link.removeEventListener('click', closeMenu)));
      cleanups.push(() => document.removeEventListener('click', onDocumentClick));
    }

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
        if (subtitle) { heroSubtitle.textContent = subtitle; heroSubtitle.classList.remove('hidden'); }
        else { heroSubtitle.textContent = ''; heroSubtitle.classList.add('hidden'); }
      }
      if (heroCta) {
        if (link) { heroCta.href = link; heroCta.classList.remove('hidden'); } else { heroCta.classList.add('hidden'); }
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
        if (intervalId) { clearInterval(intervalId); intervalId = undefined; }
      };

      startAutoplay();

      if (heroPrev) {
        const onPrevClick = () => { stopAutoplay(); const nextIndex = (currentSlide - 1 + heroSlides.length) % heroSlides.length; moveToSlide(nextIndex); startAutoplay(); };
        heroPrev.addEventListener('click', onPrevClick);
        cleanups.push(() => heroPrev.removeEventListener('click', onPrevClick));
      }

      if (heroNext) {
        const onNextClick = () => { stopAutoplay(); const nextIndex = (currentSlide + 1) % heroSlides.length; moveToSlide(nextIndex); startAutoplay(); };
        heroNext.addEventListener('click', onNextClick);
        cleanups.push(() => heroNext.removeEventListener('click', onNextClick));
      }

      cleanups.push(stopAutoplay);
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Animation on scroll observer
  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const delay = target.dataset.delay;
          if (delay) {
            setTimeout(() => { target.classList.add('in-view'); }, Number(delay));
          } else {
            target.classList.add('in-view');
          }
          obs.unobserve(target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => { observer.observe(el); });

    return () => observer.disconnect();
  }, [latestNews, newsLoading]);

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
    </>
  );
}

export default App;
