import ProjectsShowcase from './ProjectsShowcase';
import CompanyStats from './CompanyStats';

function MainContent() {
    return (
        <>
            {/* الخدمات الإلكترونية */}
            <section id="our-services" className="bg-slate-50 py-12 sm:py-16 lg:py-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-10 text-center animate-on-scroll sm:mb-16">
                        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">خدماتنا الإلكترونية</h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="animate-on-scroll h-full" data-delay="50">
                            <a href="/inquire-your-bill" className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    <img src="/images/services/inquire-bill.jpg" alt="استعلم عن فاتورتك" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                                <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                    <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-[#0a3555] sm:text-xl">استعلم عن فاتورتك</h3>
                                </div>
                            </a>
                        </div>
                        <div className="animate-on-scroll h-full" data-delay="100">
                            <a href="/enter-reading" className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    <img src="/images/services/enter-reading.png" alt="أدخل قراءة عدادك" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                                <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                    <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-[#0a3555] sm:text-xl">أدخل قراءة عدادك</h3>
                                </div>
                            </a>
                        </div>
                        <div className="animate-on-scroll h-full" data-delay="150">
                            <a href="/hotline-app" className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    <img src="/images/services/hotline.jpg" alt="تطبيق الخط الساخن" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                                <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                    <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-[#0a3555] sm:text-xl">تطبيق الخط الساخن</h3>
                                </div>
                            </a>
                        </div>
                        <div className="animate-on-scroll h-full" data-delay="200">
                            <a href="/my-reading-app" className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:ring-[#0a3555]/20">
                                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                                    <img src="/images/services/readme.jpg" alt="تطبيق قراءتي" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                </div>
                                <div className="flex flex-1 items-center justify-center border-t border-slate-100 bg-white p-4 text-center">
                                    <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-[#0a3555] sm:text-xl">تطبيق قراءتي</h3>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <ProjectsShowcase />
            <CompanyStats />

        </>
    );
}

export default MainContent;
