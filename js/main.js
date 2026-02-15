document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const topBar = document.getElementById('site-topbar');
  const mainBar = document.getElementById('site-mainbar');
  const mainBarOffset = document.getElementById('mainbar-offset');
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
  const heroTitle = document.getElementById('hero-title');
  const heroSubtitle = document.getElementById('hero-subtitle');
  const heroCta = document.getElementById('hero-cta');

  if (toggle && mobileMenu) {
    const closeMenu = () => {
      mobileMenu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      toggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
      const clickedInsideMenu = mobileMenu.contains(event.target);
      const clickedToggle = toggle.contains(event.target);
      if (!clickedInsideMenu && !clickedToggle) closeMenu();
    });
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
  window.addEventListener('scroll', syncMainBar, { passive: true });
  window.addEventListener('resize', () => {
    topBarHeight = getTopBarHeight();
    syncMainBar();
  }, { passive: true });

  const updateHeroContent = (slideIndex) => {
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

  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroSlides.length > 0) {
    let currentSlide = heroSlides.findIndex((slide) => slide.classList.contains('is-active'));
    if (currentSlide < 0) currentSlide = 0;
    updateHeroContent(currentSlide);

    if (heroSlides.length > 1) {
      setInterval(() => {
        const nextSlide = (currentSlide + 1) % heroSlides.length;
        heroSlides[currentSlide].classList.remove('is-active');
        heroSlides[nextSlide].classList.add('is-active');
        currentSlide = nextSlide;
        updateHeroContent(currentSlide);
      }, 5000);
    }
  }

  if (motionReduced) {
    document.querySelectorAll('.animate-on-scroll').forEach((el) => el.classList.add('in-view'));
    return;
  }

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const element = entry.target;
        const delay = Number(element.dataset.delay || 0);
        element.style.transitionDelay = `${delay}ms`;
        element.classList.add('in-view');
        obs.unobserve(element);
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    }
  );

  animatedElements.forEach((element) => observer.observe(element));
});
