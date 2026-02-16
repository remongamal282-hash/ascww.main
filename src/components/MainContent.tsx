import ProjectsShowcase from './ProjectsShowcase';

function MainContent() {
    return (
        <>
            {/* الخدمات الإلكترونية */}
            <section id="our-services" className="bg-slate-50 py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center animate-on-scroll">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">خدماتنا الإلكترونية</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="animate-on-scroll h-full" data-delay="50">
                            <a href="/inquire-your-bill" className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    <img src="/images/services/inquire-bill.jpg" alt="استعلم عن فاتورتك" className="h-full w-full object-fill transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                                <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                    <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-[#0a3555]">استعلم عن فاتورتك</h3>
                                </div>
                            </a>
                        </div>
                        <div className="animate-on-scroll h-full" data-delay="100">
                            <a href="/enter-reading" className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    <img src="/images/services/enter-reading.png" alt="أدخل قراءة عدادك" className="h-full w-full object-fill transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                                <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                    <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-[#0a3555]">أدخل قراءة عدادك</h3>
                                </div>
                            </a>
                        </div>
                        <div className="animate-on-scroll h-full" data-delay="150">
                            <a href="/hotline-app" className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    <img src="/images/services/hotline.jpg" alt="تطبيق الخط الساخن" className="h-full w-full object-fill transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                                <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                    <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-[#0a3555]">تطبيق الخط الساخن</h3>
                                </div>
                            </a>
                        </div>
                        <div className="animate-on-scroll h-full" data-delay="200">
                            <a href="/my-reading-app" className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    <img src="/images/services/readme.jpg" alt="تطبيق قراءتي" className="h-full w-full object-fill transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                                <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                    <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-[#0a3555]">تطبيق قراءتي</h3>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <ProjectsShowcase />

            {/* معرض الصور */}
            <section id="gallery" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <h2 className="text-center text-2xl font-extrabold text-slate-900 sm:text-3xl">معرض الصور</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <img src="/images/slider/1.jpg" alt="صورة 1" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="50" />
                    <img src="/images/slider/2.jpg" alt="صورة 2" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="100" />
                    <img src="/images/slider/3.jpg" alt="صورة 3" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="150" />
                    <img src="/images/slider/4.jpg" alt="صورة 4" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="200" />
                    <img src="/images/slider/5.jpg" alt="صورة 5" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="250" />
                    <img src="/images/slider/6.png" alt="صورة 6" className="h-44 w-full rounded-xl object-cover animate-on-scroll" loading="lazy" data-delay="300" />
                </div>
            </section>

            {/* تواصل معنا */}
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
        </>
    );
}

export default MainContent;





