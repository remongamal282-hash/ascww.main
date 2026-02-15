import { useEffect } from 'react';

function App() {
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
      updateHeroContent(currentSlide);

      if (heroSlides.length > 1) {
        const intervalId = window.setInterval(() => {
          const nextSlide = (currentSlide + 1) % heroSlides.length;
          heroSlides[currentSlide]?.classList.remove('is-active');
          heroSlides[nextSlide]?.classList.add('is-active');
          currentSlide = nextSlide;
          updateHeroContent(currentSlide);
        }, 5000);

        cleanups.push(() => window.clearInterval(intervalId));
      }
    }

    const motionReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (motionReduced) {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => el.classList.add('in-view'));
      return () => cleanups.forEach((cleanup) => cleanup());
    }

    const animatedElements = document.querySelectorAll<HTMLElement>('.animate-on-scroll');
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
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

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
<header id="site-header" className="relative w-full bg-white">
    <div id="site-topbar" className="hidden border-b border-[#d7b05a]/35 bg-[#0a3555] text-white lg:block">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-2 text-sm">
        <div className="flex items-center gap-6">
          <a href="mailto:media-water@ascww.com.eg" className="topbar-link">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d7b05a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>
            <span>media-water@ascww.com.eg</span>
          </a>
          <a href="tel:2331604" className="topbar-link">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d7b05a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.1 9.91a16 16 0 0 0 6 6l1.27-1.26a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <span>رقم الهاتف : 2331604</span>
          </a>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://api.whatsapp.com/send?phone=01280733990" target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="top-social">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.94A9.94 9.94 0 0 0 12 2a10 10 0 0 0-8.66 15l-1.3 4.74 4.86-1.27A10 10 0 1 0 19.05 4.94ZM12 20a8 8 0 0 1-4.07-1.11l-.29-.17-2.89.76.77-2.82-.18-.29A8 8 0 1 1 12 20Zm4.38-5.51c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06a6.54 6.54 0 0 1-1.92-1.18 7.33 7.33 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.52.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z"/></svg>
          </a>
          <a href="https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw" target="_blank" rel="noopener noreferrer" aria-label="يوتيوب" className="top-social">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.94C17.93 4.8 12 4.8 12 4.8s-5.93 0-7.64.45A2.75 2.75 0 0 0 2.42 7.2 28.4 28.4 0 0 0 2 12a28.4 28.4 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.94 1.94c1.7.45 7.64.45 7.64.45s5.93 0 7.64-.45a2.75 2.75 0 0 0 1.94-1.94A28.4 28.4 0 0 0 22 12a28.4 28.4 0 0 0-.42-4.81ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>
          </a>
          <a href="https://www.facebook.com/ASCWWeg" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="top-social">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-3.3 0-6 2.7-6 6v2H6v4h2v6h4v-6h3l1-4h-4v-2c0-1.1.9-2 2-2Z"/></svg>
          </a>
          <span className="text-xs font-bold text-[#d7b05a]">العربية</span>
        </div>
      </div>
    </div>

    <div id="site-mainbar" className="site-mainbar border-b border-[#d7b05a]/35 bg-white transition-shadow duration-300">
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center justify-self-end gap-3">
          <img src="/images/ascww-logo.png" alt="شعار الشركة" className="h-12 w-auto sm:h-14" />
        </a>

        <nav className="main-menu-wrap hidden min-w-0 items-center justify-center gap-1 text-base font-bold text-slate-800 xl:flex">
          <a className="nav-link-classic nav-link-classic--active" href="/">الرئيسية</a>

          <div className="nav-dropdown group">
            <a className="nav-dropdown-trigger" href="/an-elsherka">عن الشركة</a>
            <div className="nav-dropdown-menu">
              <a className="nav-dropdown-item" href="/an-elsherka">نبذة عن الشركة</a>
              <a className="nav-dropdown-item" href="/birth-of-company">قرار إنشاء الشركة</a>
              <a className="nav-dropdown-item" href="/branch-of-company">فروع الشركه</a>
              <a className="nav-dropdown-item" href="/projects-company">مشروعات الشركة</a>
              <a className="nav-dropdown-item" href="/news-company">أرشيف الأخبار</a>
              <a className="nav-dropdown-item" href="/vision-and-message">الرؤيه والرساله</a>
              <a className="nav-dropdown-item" href="/organization-structure">الهيكل التنظيمي</a>
              <a className="nav-dropdown-item" href="/company-achivement">إنجازات الشركة</a>
              <a className="nav-dropdown-item" href="/contract-and-sell">اللائحه الموحده للعقود والمشتريات</a>
            </div>
          </div>

          <div className="nav-dropdown group">
            <a className="nav-dropdown-trigger" href="/adviceAndContact">التوعية والاتصال</a>
            <div className="nav-dropdown-menu">
              <a className="nav-dropdown-item" href="/adviceAndContact">التوعية والأتصال</a>
              <a className="nav-dropdown-item" href="/forKids">ركن الأطفال</a>
              <a className="nav-dropdown-item" href="/toWomen">لك سيدتي</a>
            </div>
          </div>

          <div className="nav-dropdown group">
            <a className="nav-dropdown-trigger" href="/water-quality">جودة المياه</a>
            <div className="nav-dropdown-menu">
              <a className="nav-dropdown-item" href="/water-quality">جودة المياه</a>
              <a className="nav-dropdown-item" href="/refining-water">تنقية مياه الشرب</a>
              <a className="nav-dropdown-item" href="/lab-of-company-water">المعمل المركزي لمياه الشرب</a>
            </div>
          </div>

          <div className="nav-dropdown group">
            <a className="nav-dropdown-trigger" href="/allTenders">المناقصات</a>
            <div className="nav-dropdown-menu">
              <a className="nav-dropdown-item" href="/allTenders">جميع المناقصات الموجوده بالشركة</a>
            </div>
          </div>

          <div className="nav-dropdown nav-dropdown--sewage group">
            <a className="nav-dropdown-trigger" href="/sewage-treatment">الصرف الصحي</a>
            <div className="nav-dropdown-menu">
              <a className="nav-dropdown-item" href="/sewage-treatment">معالجه الصرف الصحي</a>
              <a className="nav-dropdown-item" href="/Riddence-waste-water">تعريف بأهميه التخلص الاَمن من الصرف الصحي</a>
              <a className="nav-dropdown-item" href="/kind-of-waste-water">معالجه الصرف الصحي الخام و أنواع محطات المعالجه</a>
              <a className="nav-dropdown-item" href="/save-web-waste-water">أهميه الحفاظ علي شبكه الصرف الصحي</a>
              <a className="nav-dropdown-item" href="/waste-water-in-manufactring">دور إداره الصرف الصناعي</a>
              <a className="nav-dropdown-item" href="/manufactring-waste">الصرف الصناعي</a>
            </div>
          </div>

          <div className="nav-dropdown group">
            <a className="nav-dropdown-trigger" href="/general-admin-training">التدريب</a>
            <div className="nav-dropdown-menu">
              <a className="nav-dropdown-item" href="/general-admin-training">أنواع التدريب والقاعات</a>
              <a className="nav-dropdown-item" href="/Result-of-school">نتائج المدرسه</a>
            </div>
          </div>

          <div className="nav-dropdown group">
            <a className="nav-dropdown-trigger" href="/jobs-and-competition">وظائف</a>
            <div className="nav-dropdown-menu">
              <a className="nav-dropdown-item" href="/jobs-and-competition">مسابقات و وظائف</a>
              <a className="nav-dropdown-item" href="/result_of_worker">نتائج المسابقات</a>
            </div>
          </div>

          <div className="nav-dropdown group">
            <a className="nav-dropdown-trigger" href="/inquire-your-bill">خدمات</a>
            <div className="nav-dropdown-menu">
              <a className="nav-dropdown-item" href="/inquire-your-bill">استعلم عن فاتورتك</a>
              <a className="nav-dropdown-item" href="/call-center">خدمه العملاء</a>
              <a className="nav-dropdown-item" href="/Customer-Charter">ميثاق المتعاملين</a>
              <a className="nav-dropdown-item" href="/Services-Evidance">دليل الخدمات</a>
              <a className="nav-dropdown-item" href="/Contract-On-Service">رحلة المتعامل للتعاقد على طلب خدمة</a>
              <a className="nav-dropdown-item" href="/provide-request">تقديم طلب</a>
              <a className="nav-dropdown-item" href="/provide-complaine">تقديم شكوي</a>
            </div>
          </div>

          <div className="nav-dropdown group">
            <a className="nav-dropdown-trigger" href="/nabza-an-daam-elnazaha">دعم النزاهة</a>
            <div className="nav-dropdown-menu">
              <a className="nav-dropdown-item" href="/nabza-an-daam-elnazaha">نبذه عن إداره دعم النزاهة</a>
              <a className="nav-dropdown-item" href="/abrz-amaal-daam-elnazaha">أبرز أعمال دعم النزاهة</a>
              <a className="nav-dropdown-item" href="/elslookElwazefy">السلوك الوظيفي</a>
            </div>
          </div>

          <div className="nav-dropdown group">
            <a className="nav-dropdown-trigger" href="/trips-the-boss">معرض الصور</a>
            <div className="nav-dropdown-menu">
              <a className="nav-dropdown-item" href="/trips-the-boss">جولات رئيس مجلس الإداره</a>
              <a className="nav-dropdown-item" href="/lab-of-company">معامل الشركه</a>
              <a className="nav-dropdown-item" href="/waste-of-company">محطات الصرف</a>
              <a className="nav-dropdown-item" href="/traning-of-company">مركز التدريب</a>
              <a className="nav-dropdown-item" href="/information-technology-of-company">قطاع تكنولوجيا المعلومات</a>
              <a className="nav-dropdown-item" href="/school-new-assuit">المدرسه الفنيه</a>
              <a className="nav-dropdown-item" href="/sport-of-company">النشاط الرياضي</a>
            </div>
          </div>
        </nav>

        <div className="flex items-center justify-self-start gap-3">
          <form className="relative hidden xl:flex xl:w-52 2xl:w-64" role="search" aria-label="بحث في الموقع">
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#0a3555]/70">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </span>
            <input
              type="search"
              name="q"
              placeholder="ابحث هنا..."
              className="h-10 w-full rounded-full border border-[#d7b05a]/55 bg-white pr-9 pl-4 text-sm text-slate-700 outline-none transition focus:border-[#0a3555] focus:ring-2 focus:ring-[#0a3555]/15"
            />
          </form>
          <button id="mobile-toggle" className="inline-flex rounded-lg border border-slate-300 p-2 text-slate-700 xl:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="فتح القائمة">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div id="mainbar-offset" className="h-0"></div>

    <nav id="mobile-menu" className="hidden border-b border-[#d7b05a]/35 bg-white px-4 py-3 text-base font-semibold text-slate-800 xl:hidden">
      <div className="grid grid-cols-1 gap-2">
        <a className="rounded-lg bg-slate-100 px-3 py-2" href="/">الرئيسية</a>

        <details className="mobile-nav-group">
          <summary>عن الشركة</summary>
          <div className="mobile-nav-submenu">
            <a href="/an-elsherka">نبذة عن الشركة</a>
            <a href="/birth-of-company">قرار إنشاء الشركة</a>
            <a href="/branch-of-company">فروع الشركه</a>
            <a href="/projects-company">مشروعات الشركة</a>
            <a href="/news-company">أرشيف الأخبار</a>
            <a href="/vision-and-message">الرؤيه والرساله</a>
            <a href="/organization-structure">الهيكل التنظيمي</a>
            <a href="/company-achivement">إنجازات الشركة</a>
            <a href="/contract-and-sell">اللائحه الموحده للعقود والمشتريات</a>
          </div>
        </details>

        <details className="mobile-nav-group">
          <summary>التوعية والاتصال</summary>
          <div className="mobile-nav-submenu">
            <a href="/adviceAndContact">التوعية والأتصال</a>
            <a href="/forKids">ركن الأطفال</a>
            <a href="/toWomen">لك سيدتي</a>
          </div>
        </details>

        <details className="mobile-nav-group">
          <summary>جودة المياه</summary>
          <div className="mobile-nav-submenu">
            <a href="/water-quality">جودة المياه</a>
            <a href="/refining-water">تنقية مياه الشرب</a>
            <a href="/lab-of-company-water">المعمل المركزي لمياه الشرب</a>
          </div>
        </details>

        <details className="mobile-nav-group">
          <summary>المناقصات</summary>
          <div className="mobile-nav-submenu">
            <a href="/allTenders">جميع المناقصات الموجوده بالشركة</a>
          </div>
        </details>

        <details className="mobile-nav-group">
          <summary>الصرف الصحي</summary>
          <div className="mobile-nav-submenu">
            <a href="/sewage-treatment">معالجه الصرف الصحي</a>
            <a href="/Riddence-waste-water">تعريف بأهميه التخلص الاَمن من الصرف الصحي</a>
            <a href="/kind-of-waste-water">معالجه الصرف الصحي الخام و أنواع محطات المعالجه</a>
            <a href="/save-web-waste-water">أهميه الحفاظ علي شبكه الصرف الصحي</a>
            <a href="/waste-water-in-manufactring">دور إداره الصرف الصناعي</a>
            <a href="/manufactring-waste">الصرف الصناعي</a>
          </div>
        </details>

        <details className="mobile-nav-group">
          <summary>التدريب</summary>
          <div className="mobile-nav-submenu">
            <a href="/general-admin-training">أنواع التدريب والقاعات</a>
            <a href="/Result-of-school">نتائج المدرسه</a>
          </div>
        </details>

        <details className="mobile-nav-group">
          <summary>وظائف</summary>
          <div className="mobile-nav-submenu">
            <a href="/jobs-and-competition">مسابقات و وظائف</a>
            <a href="/result_of_worker">نتائج المسابقات</a>
          </div>
        </details>

        <details className="mobile-nav-group">
          <summary>خدمات</summary>
          <div className="mobile-nav-submenu">
            <a href="/inquire-your-bill">استعلم عن فاتورتك</a>
            <a href="/call-center">خدمه العملاء</a>
            <a href="/Customer-Charter">ميثاق المتعاملين</a>
            <a href="/Services-Evidance">دليل الخدمات</a>
            <a href="/Contract-On-Service">رحلة المتعامل للتعاقد على طلب خدمة</a>
            <a href="/provide-request">تقديم طلب</a>
            <a href="/provide-complaine">تقديم شكوي</a>
          </div>
        </details>

        <details className="mobile-nav-group">
          <summary>دعم النزاهة</summary>
          <div className="mobile-nav-submenu">
            <a href="/nabza-an-daam-elnazaha">نبذه عن إداره دعم النزاهة</a>
            <a href="/abrz-amaal-daam-elnazaha">أبرز أعمال دعم النزاهة</a>
            <a href="/elslookElwazefy">السلوك الوظيفي</a>
          </div>
        </details>

        <details className="mobile-nav-group">
          <summary>معرض الصور</summary>
          <div className="mobile-nav-submenu">
            <a href="/trips-the-boss">جولات رئيس مجلس الإداره</a>
            <a href="/lab-of-company">معامل الشركه</a>
            <a href="/waste-of-company">محطات الصرف</a>
            <a href="/traning-of-company">مركز التدريب</a>
            <a href="/information-technology-of-company">قطاع تكنولوجيا المعلومات</a>
            <a href="/school-new-assuit">المدرسه الفنيه</a>
            <a href="/sport-of-company">النشاط الرياضي</a>
          </div>
        </details>

        <a className="rounded-lg bg-[#0a3555] px-3 py-2 text-center text-white" href="tel:2331604">الخط الساخن: 2331604</a>
        <div className="col-span-2 mt-1 flex items-center justify-center gap-3 rounded-lg bg-slate-100 px-3 py-3">
          <a href="https://www.facebook.com/ASCWWeg" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="social-icon social-icon--facebook">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a6 6 0 0 0-6 6v4H7v4h2v6h4v-6h3l1-4h-4V8a2 2 0 0 1 2-2h1z"/></svg>
          </a>
          <a href="https://api.whatsapp.com/send?phone=01280733990" target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="social-icon social-icon--whatsapp">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </a>
          <a href="https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw" target="_blank" rel="noopener noreferrer" aria-label="يوتيوب" className="social-icon social-icon--youtube">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.96-2C18.88 4 12 4 12 4s-6.88 0-8.58.46a2.78 2.78 0 0 0-1.96 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.42 19c1.7.46 8.58.46 8.58.46s6.88 0 8.58-.46a2.78 2.78 0 0 0 1.96-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
          </a>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <section id="home" className="relative overflow-hidden">
      <div className="hero-slider absolute inset-0 -z-20" aria-hidden="true">
        <div
          className="hero-slide is-active"
          style={{ backgroundImage: "url('/images/slider/1.jpg')" }}
          data-title="شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد"
          data-subtitle="ترحب بكم و نفخر بأننا احدي الشركات الرائده في جمهوريه مصر العربيه"
          data-link="https://ascww.org/an-elsherka"
          data-cta="تعرف عل المزيد"
        ></div>
        <div
          className="hero-slide"
          style={{ backgroundImage: "url('/images/slider/2.jpg')" }}
          data-title="مركز خدمة العملاء"
          data-subtitle="مراكز خدمه العملاء وطرق التواصل وعنوان أقرب فرع"
          data-link="https://ascww.org/call-center"
          data-cta="تعرف عل المزيد"
        ></div>
        <div
          className="hero-slide"
          style={{ backgroundImage: "url('/images/slider/3.jpg')" }}
          data-title="الإداره العامه للتدريب"
          data-subtitle="متاح حجز قاعات التدريب من داخل و خارج الشركة"
          data-link="https://ascww.org/general-admin-training"
          data-cta="تعرف عل المزيد"
        ></div>
        <div
          className="hero-slide"
          style={{ backgroundImage: "url('/images/slider/4.jpg')" }}
          data-title="معامل علي اعلي مستوي"
          data-subtitle="الاهتمام بمعايير منظمة الصحه العالمية للتاكد من جودة المياه بأحدث المعايير والتقنيات"
          data-link="https://ascww.org/lab-of-company-water"
          data-cta="تعرف عل المزيد"
        ></div>
        <div
          className="hero-slide"
          style={{ backgroundImage: "url('/images/slider/5.jpg')" }}
          data-title="لتنزيل برنامج قرائتي اضغط هنا"
          data-subtitle=""
          data-link="https://ascww.org/readme"
          data-cta="فتح الخدمة"
        ></div>
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-l from-[#0a3555]/80 via-[#082b47]/65 to-black/70"></div>
      <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h1 id="hero-title" className="hero-title">شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد</h1>
          <p id="hero-subtitle" className="mx-auto mt-4 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">ترحب بكم و نفخر بأننا احدي الشركات الرائده في جمهوريه مصر العربيه</p>
          <a id="hero-cta" href="https://ascww.org/an-elsherka" target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-full border border-[#d7b05a]/80 bg-[#d7b05a]/90 px-6 py-3 text-sm font-bold text-[#0a3555] transition hover:bg-[#d7b05a]">تعرف عل المزيد</a>
        </div>
      </div>
    </section>

    <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <img src="/images/about-img.jpg" alt="محطة معالجة" className="h-full w-full rounded-2xl object-cover shadow-soft animate-on-scroll" loading="lazy" data-delay="80" />
        <div className="animate-on-scroll" data-delay="180">
          <p className="text-sm font-bold text-brand-700">عن الشركة</p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">خبرة تشغيلية ومهنية لخدمة المواطنين</h2>
          <p className="mt-4 leading-8 text-slate-600">نسعى لتحسين جودة الحياة عبر توفير مياه شرب آمنة، وإدارة فعالة للصرف الصحي، والاعتماد على نظم متابعة وتحكم حديثة.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">التزام بمعايير الجودة والسلامة</div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">خطط تطوير مستمرة للبنية التحتية</div>
          </div>
        </div>
      </div>
    </section>

    <section id="services" className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">الخدمات الرئيسية</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 animate-on-scroll" data-delay="50">إمداد مياه الشرب</article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 animate-on-scroll" data-delay="100">صيانة الشبكات</article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 animate-on-scroll" data-delay="150">خدمة العملاء والشكاوى</article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 animate-on-scroll" data-delay="200">تحاليل ومراقبة الجودة</article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 animate-on-scroll" data-delay="250">خدمات الصرف الصحي</article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 animate-on-scroll" data-delay="300">التوعية المجتمعية</article>
        </div>
      </div>
    </section>

    <section id="quality" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-brand-50 p-6 sm:p-8 animate-on-scroll">
        <h2 className="text-2xl font-extrabold text-brand-900">جودة المياه</h2>
        <p className="mt-3 text-slate-700">متابعة دورية لعينات المياه من المحطات والشبكات لضمان المطابقة للمواصفات القياسية.</p>
      </div>
    </section>

    <section id="sanitation" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white p-6 shadow-soft sm:p-8 animate-on-scroll">
        <h2 className="text-2xl font-extrabold text-slate-900">الصرف الصحي</h2>
        <p className="mt-3 text-slate-700">إدارة وتشغيل محطات المعالجة ورفع كفاءة الشبكات لتقليل الأعطال وتحسين الاستجابة.</p>
      </div>
    </section>

    <section id="awareness" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white p-6 shadow-soft sm:p-8 animate-on-scroll">
        <h2 className="text-2xl font-extrabold text-slate-900">التوعية والاتصالات</h2>
        <p className="mt-3 text-slate-700">حملات توعوية لترشيد استهلاك المياه والتفاعل المباشر مع المواطنين عبر القنوات الرقمية.</p>
      </div>
    </section>

    <section id="training" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white p-6 shadow-soft sm:p-8 animate-on-scroll">
        <h2 className="text-2xl font-extrabold text-slate-900">التدريب</h2>
        <p className="mt-3 text-slate-700">برامج تدريب فني وإداري مستمرة لرفع كفاءة الكوادر وتحسين جودة التشغيل.</p>
      </div>
    </section>

    <section id="jobs" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white p-6 shadow-soft sm:p-8 animate-on-scroll">
        <h2 className="text-2xl font-extrabold text-slate-900">الوظائف</h2>
        <p className="mt-3 text-slate-700">متابعة فرص العمل المعلنة ومتطلبات التقديم طبقًا للضوابط الرسمية.</p>
      </div>
    </section>

    <section id="tenders" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white p-6 shadow-soft sm:p-8 animate-on-scroll">
        <h2 className="text-2xl font-extrabold text-slate-900">المناقصات</h2>
        <p className="mt-3 text-slate-700">عرض المناقصات والممارسات المتاحة بشكل واضح مع بيانات التقديم والمواعيد.</p>
      </div>
    </section>

    <section id="integrity" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white p-6 shadow-soft sm:p-8 animate-on-scroll">
        <h2 className="text-2xl font-extrabold text-slate-900">دعم النزاهة</h2>
        <p className="mt-3 text-slate-700">قنوات واضحة للإبلاغ ومكافحة الفساد بما يضمن الشفافية وحماية حقوق المواطنين.</p>
      </div>
    </section>

    <section id="gallery" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">معرض الصور</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <img src="/images/slider/1.jpg" alt="صورة 1" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="50" />
        <img src="/images/slider/2.jpg" alt="صورة 2" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="100" />
        <img src="/images/slider/3.jpg" alt="صورة 3" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="150" />
        <img src="/images/slider/4.jpg" alt="صورة 4" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="200" />
        <img src="/images/slider/5.jpg" alt="صورة 5" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="250" />
      </div>
    </section>

    <section id="contact" className="bg-brand-900 py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-extrabold sm:text-3xl">تواصل معنا</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white/10 p-5 animate-on-scroll" data-delay="50">العنوان: أسيوط، جمهورية مصر العربية</div>
          <div className="rounded-2xl bg-white/10 p-5 animate-on-scroll" data-delay="100">الخط الساخن: 2331604</div>
          <div className="rounded-2xl bg-white/10 p-5 animate-on-scroll" data-delay="150">البريد: media-water@ascww.com.eg</div>
          <div className="rounded-2xl bg-white/10 p-5 animate-on-scroll" data-delay="200">ساعات العمل: 24/7</div>
        </div>
      </div>
    </section>
  </main>

  <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.22),_transparent_55%)]"></div>
    <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="animate-on-scroll">
          <div className="mb-4 flex items-center gap-3">
            <img src="/images/ascww-logo.png" alt="شعار الشركة" className="h-12 w-auto rounded bg-white p-1" />
            <div>
              <p className="text-sm font-bold text-white">شركة مياه الشرب والصرف الصحى بأسيوط</p>
              <p className="text-xs text-slate-300">والوادى الجديد</p>
            </div>
          </div>
          <p className="text-sm leading-7 text-slate-400">تطوير البوابة الإلكترونية لخدمات المواطنين بما يتماشى مع الموقع الرسمي للشركة ويركز على سهولة الوصول وسرعة الخدمة.</p>
        </div>

        <div className="animate-on-scroll" data-delay="80">
          <h3 className="mb-4 text-base font-bold text-white">روابط مهمة</h3>
          <div className="space-y-2 text-sm">
            <a className="block transition hover:text-white" href="#services">الخدمات</a>
            <a className="block transition hover:text-white" href="#quality">جودة المياه</a>
            <a className="block transition hover:text-white" href="#tenders">المناقصات</a>
            <a className="block transition hover:text-white" href="#integrity">دعم النزاهة</a>
          </div>
        </div>

        <div className="animate-on-scroll" data-delay="120">
          <h3 className="mb-4 text-base font-bold text-white">بيانات التواصل</h3>
          <div className="space-y-2 text-sm leading-7">
            <p>العنوان: أسيوط، جمهورية مصر العربية</p>
            <p>الخط الساخن: 2331604</p>
            <p>البريد الإلكتروني: media-water@ascww.com.eg</p>
            <p>مواعيد العمل: 24 ساعة / 7 أيام</p>
          </div>
        </div>

        <div className="animate-on-scroll" data-delay="160">
          <h3 className="mb-4 text-base font-bold text-white">تابعنا</h3>
          <div className="mb-4 flex items-center gap-2">
            <a href="https://www.facebook.com/ASCWWeg" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="social-icon social-icon--facebook">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a6 6 0 0 0-6 6v4H7v4h2v6h4v-6h3l1-4h-4V8a2 2 0 0 1 2-2h1z"/></svg>
            </a>
            <a href="https://api.whatsapp.com/send?phone=01280733990" target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="social-icon social-icon--whatsapp">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </a>
            <a href="https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw" target="_blank" rel="noopener noreferrer" aria-label="يوتيوب" className="social-icon social-icon--youtube">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.96-2C18.88 4 12 4 12 4s-6.88 0-8.58.46a2.78 2.78 0 0 0-1.96 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.42 19c1.7.46 8.58.46 8.58.46s6.88 0 8.58-.46a2.78 2.78 0 0 0 1.96-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
          </div>
          <p className="text-xs text-slate-400">المصدر المرجعي للبيانات: ascww.org</p>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-5 text-center text-sm text-slate-400">
        © <span id="current-year"></span> شركة مياه الشرب والصرف الصحى بأسيوط والوادى الجديد. جميع الحقوق محفوظة.
      </div>
    </div>
  </footer>
    </>
  );
}

export default App;
