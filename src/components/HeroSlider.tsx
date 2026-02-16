function HeroSlider() {
    return (
        <section id="home" className="relative overflow-hidden">
            <div className="hero-slider absolute inset-0 -z-20" aria-hidden="true">
                <div className="hero-slide is-active" style={{ backgroundImage: "url('/images/slider/1.jpg')" }} data-title="معامل علي اعلي مستوي" data-subtitle="الاهتمام بمعايير منظمة الصحه العالمية للتاكد من جودة المياه بأحدث المعايير والتقنيات" data-link="https://ascww.org/lab-of-company-water" data-cta="تعرف عل المزيد"></div>
                <div className="hero-slide" style={{ backgroundImage: "url('/images/slider/2.jpg')" }} data-title="لتنزيل برنامج قرائتي اضغط هنا" data-subtitle="" data-link="https://ascww.org/readme" data-cta="فتح الخدمة"></div>
                <div className="hero-slide" style={{ backgroundImage: "url('/images/slider/3.jpg')" }} data-title="شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد" data-subtitle="ترحب بكم و نفخر بأننا احدي الشركات الرائده في جمهوريه مصر العربيه" data-link="https://ascww.org/an-elsherka" data-cta="تعرف عل المزيد"></div>
                <div className="hero-slide" style={{ backgroundImage: "url('/images/slider/4.jpg')" }} data-title="الإداره العامه للتدريب" data-subtitle="متاح حجز قاعات التدريب من داخل و خارج الشركة" data-link="https://ascww.org/general-admin-training" data-cta="تعرف عل المزيد"></div>
                <div className="hero-slide" style={{ backgroundImage: "url('/images/slider/5.jpg')" }} data-title="مركز خدمة العملاء" data-subtitle="مراكز خدمه العملاء وطرق التواصل وعنوان أقرب فرع" data-link="https://ascww.org/call-center" data-cta="تعرف عل المزيد"></div>
                <div className="hero-slide" style={{ backgroundImage: "url('/images/slider/6.png')" }} data-title="لتنزيل برنامج الخط الساخن أضغط هنا" data-subtitle="" data-link="https://ascww.org/hotline125" data-cta="فتح الخدمة"></div>
            </div>
            <div className="hero-overlay"></div>
            <button id="hero-prev" type="button" aria-label="السلايد السابق" className="hero-nav-btn hero-nav-btn--left">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" /></svg>
            </button>
            <button id="hero-next" type="button" aria-label="السلايد التالي" className="hero-nav-btn hero-nav-btn--right">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" /></svg>
            </button>
            <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
                <div id="hero-content" className="hero-content-animate text-center text-white">
                    <h1 id="hero-title" className="hero-title hero-anim-item">شركة مياه الشرب والصرف الصحي بأسيوط والوادي الجديد</h1>
                    <p id="hero-subtitle" className="hero-anim-item mx-auto mt-4 max-w-4xl text-base leading-8 text-slate-100 sm:text-lg">ترحب بكم و نفخر بأننا احدي الشركات الرائده في جمهوريه مصر العربيه</p>
                    <a id="hero-cta" href="https://ascww.org/an-elsherka" target="_blank" rel="noopener noreferrer" className="hero-anim-item mt-7 inline-flex rounded-full border border-[#d7b05a]/80 bg-[#d7b05a]/90 px-6 py-3 text-sm font-bold text-[#0a3555] transition hover:bg-[#d7b05a]">تعرف عل المزيد</a>
                </div>
            </div>
        </section>
    );
}

export default HeroSlider;
