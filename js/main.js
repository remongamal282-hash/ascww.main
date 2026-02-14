document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const header = document.getElementById('site-header');
  const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));

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

  const handleHeaderShadow = () => {
    if (!header) return;
    if (window.scrollY > 12) {
      header.classList.add('shadow-lg');
    } else {
      header.classList.remove('shadow-lg');
    }
  };

  handleHeaderShadow();
  window.addEventListener('scroll', handleHeaderShadow, { passive: true });

  const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroSlides.length > 1) {
    let currentSlide = heroSlides.findIndex((slide) => slide.classList.contains('is-active'));
    if (currentSlide < 0) currentSlide = 0;

    setInterval(() => {
      const nextSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.remove('is-active');
      heroSlides[nextSlide].classList.add('is-active');
      currentSlide = nextSlide;
    }, 5000);
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
