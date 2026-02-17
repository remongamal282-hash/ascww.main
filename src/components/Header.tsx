import { Link } from 'react-router-dom';

function Header() {
    return (
        <header id="site-header" className="relative w-full bg-white">
            <div id="site-topbar" className="hidden border-b border-[#d7b05a]/35 bg-[#0a3555] text-white lg:block">
                <div className="mx-auto flex max-w-[1600px] items-center justify-between px-8 py-2 text-sm">
                    <div className="flex items-center gap-6">
                        <a href="mailto:media-water@ascww.com.eg" className="topbar-link">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d7b05a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" /><path d="m22 6-10 7L2 6" /></svg>
                            <span className="text-xs font-normal">media-water@ascww.com.eg</span>
                        </a>
                        <a href="tel:2331604" className="topbar-link">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#d7b05a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.1 9.91a16 16 0 0 0 6 6l1.27-1.26a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            <span className="text-xs font-normal">رقم الهاتف : 2331604</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href="https://api.whatsapp.com/send?phone=01280733990" target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="top-social">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.94A9.94 9.94 0 0 0 12 2a10 10 0 0 0-8.66 15l-1.3 4.74 4.86-1.27A10 10 0 1 0 19.05 4.94ZM12 20a8 8 0 0 1-4.07-1.11l-.29-.17-2.89.76.77-2.82-.18-.29A8 8 0 1 1 12 20Zm4.38-5.51c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06a6.54 6.54 0 0 1-1.92-1.18 7.33 7.33 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.52.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" /></svg>
                        </a>
                        <a href="https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw" target="_blank" rel="noopener noreferrer" aria-label="يوتيوب" className="top-social">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M21.58 7.19a2.75 2.75 0 0 0-1.94-1.94C17.93 4.8 12 4.8 12 4.8s-5.93 0-7.64.45A2.75 2.75 0 0 0 2.42 7.2 28.4 28.4 0 0 0 2 12a28.4 28.4 0 0 0 .42 4.81 2.75 2.75 0 0 0 1.94 1.94c1.7.45 7.64.45 7.64.45s5.93 0 7.64-.45a2.75 2.75 0 0 0 1.94-1.94A28.4 28.4 0 0 0 22 12a28.4 28.4 0 0 0-.42-4.81ZM10 15.5v-7l6 3.5-6 3.5Z" /></svg>
                        </a>
                        <a href="https://www.facebook.com/ASCWWeg" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="top-social">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-3.3 0-6 2.7-6 6v2H6v4h2v6h4v-6h3l1-4h-4v-2c0-1.1.9-2 2-2Z" /></svg>
                        </a>
                        <span className="text-xs font-bold text-[#d7b05a]">العربية</span>
                    </div>
                </div>
            </div>

            <div id="site-mainbar" className="site-mainbar border-b border-[#d7b05a]/35 bg-white transition-shadow duration-300">
                <div className="mx-auto grid w-full max-w-[1600px] grid-cols-[auto_auto] justify-start items-center gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8 xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:justify-normal">
                    <Link to="/" className="order-2 flex items-center justify-self-start gap-3 xl:order-1 xl:justify-self-end">
                        <img src="/images/ascww-logo.png" alt="شعار الشركة" className="h-10 w-auto sm:h-12 lg:h-14" />
                    </Link>

                    <nav className="main-menu-wrap order-3 hidden min-w-0 items-center justify-center gap-1 text-sm font-bold text-slate-800 xl:order-2 xl:flex">
                        <Link className="nav-link-classic nav-link-classic--active" to="/">الرئيسية</Link>

                        <div className="nav-dropdown group">
                            <a className="nav-dropdown-trigger" href="/an-elsherka">عن الشركة</a>
                            <div className="nav-dropdown-menu">
                                <a className="nav-dropdown-item" href="/an-elsherka">نبذة عن الشركة</a>
                                <a className="nav-dropdown-item" href="/birth-of-company">قرار إنشاء الشركة</a>
                                <a className="nav-dropdown-item" href="/branch-of-company">فروع الشركه</a>
                                <a className="nav-dropdown-item" href="/projects-company">مشروعات الشركة</a>
                                <Link className="nav-dropdown-item" to="/news-company">أرشيف الأخبار</Link>
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

                    <div className="order-1 flex items-center justify-self-start gap-3 xl:order-3 xl:justify-self-start">
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
                        <button id="mobile-toggle" className="inline-flex rounded-lg border border-slate-300 p-1.5 text-slate-700 xl:hidden sm:p-2" aria-expanded="false" aria-controls="mobile-menu" aria-label="فتح القائمة">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div id="mainbar-offset" className="h-0"></div>

            <nav id="mobile-menu" className="hidden max-h-[calc(100vh-4.75rem)] overflow-y-auto border-b border-[#d7b05a]/35 bg-white px-4 py-3 text-base font-semibold text-slate-800 xl:hidden">
                <div className="grid grid-cols-1 gap-2">
                    <Link className="rounded-lg bg-slate-100 px-3 py-2" to="/">الرئيسية</Link>
                    <details className="mobile-nav-group"><summary>عن الشركة</summary><div className="mobile-nav-submenu"><a href="/an-elsherka">نبذة عن الشركة</a><a href="/birth-of-company">قرار إنشاء الشركة</a><a href="/branch-of-company">فروع الشركه</a><a href="/projects-company">مشروعات الشركة</a><Link to="/news-company">أرشيف الأخبار</Link><a href="/vision-and-message">الرؤيه والرساله</a><a href="/organization-structure">الهيكل التنظيمي</a><a href="/company-achivement">إنجازات الشركة</a><a href="/contract-and-sell">اللائحه الموحده للعقود والمشتريات</a></div></details>
                    <details className="mobile-nav-group"><summary>التوعية والاتصال</summary><div className="mobile-nav-submenu"><a href="/adviceAndContact">التوعية والأتصال</a><a href="/forKids">ركن الأطفال</a><a href="/toWomen">لك سيدتي</a></div></details>
                    <details className="mobile-nav-group"><summary>جودة المياه</summary><div className="mobile-nav-submenu"><a href="/water-quality">جودة المياه</a><a href="/refining-water">تنقية مياه الشرب</a><a href="/lab-of-company-water">المعمل المركزي لمياه الشرب</a></div></details>
                    <details className="mobile-nav-group"><summary>المناقصات</summary><div className="mobile-nav-submenu"><a href="/allTenders">جميع المناقصات الموجوده بالشركة</a></div></details>
                    <details className="mobile-nav-group"><summary>الصرف الصحي</summary><div className="mobile-nav-submenu"><a href="/sewage-treatment">معالجه الصرف الصحي</a><a href="/Riddence-waste-water">تعريف بأهميه التخلص الاَمن من الصرف الصحي</a><a href="/kind-of-waste-water">معالجه الصرف الصحي الخام و أنواع محطات المعالجه</a><a href="/save-web-waste-water">أهميه الحفاظ علي شبكه الصرف الصحي</a><a href="/waste-water-in-manufactring">دور إداره الصرف الصناعي</a><a href="/manufactring-waste">الصرف الصناعي</a></div></details>
                    <details className="mobile-nav-group"><summary>التدريب</summary><div className="mobile-nav-submenu"><a href="/general-admin-training">أنواع التدريب والقاعات</a><a href="/Result-of-school">نتائج المدرسه</a></div></details>
                    <details className="mobile-nav-group"><summary>وظائف</summary><div className="mobile-nav-submenu"><a href="/jobs-and-competition">مسابقات و وظائف</a><a href="/result_of_worker">نتائج المسابقات</a></div></details>
                    <details className="mobile-nav-group"><summary>خدمات</summary><div className="mobile-nav-submenu"><a href="/inquire-your-bill">استعلم عن فاتورتك</a><a href="/call-center">خدمه العملاء</a><a href="/Customer-Charter">ميثاق المتعاملين</a><a href="/Services-Evidance">دليل الخدمات</a><a href="/Contract-On-Service">رحلة المتعامل للتعاقد على طلب خدمة</a><a href="/provide-request">تقديم طلب</a><a href="/provide-complaine">تقديم شكوي</a></div></details>
                    <details className="mobile-nav-group"><summary>دعم النزاهة</summary><div className="mobile-nav-submenu"><a href="/nabza-an-daam-elnazaha">نبذه عن إداره دعم النزاهة</a><a href="/abrz-amaal-daam-elnazaha">أبرز أعمال دعم النزاهة</a><a href="/elslookElwazefy">السلوك الوظيفي</a></div></details>
                    <details className="mobile-nav-group"><summary>معرض الصور</summary><div className="mobile-nav-submenu"><a href="/trips-the-boss">جولات رئيس مجلس الإداره</a><a href="/lab-of-company">معامل الشركه</a><a href="/waste-of-company">محطات الصرف</a><a href="/traning-of-company">مركز التدريب</a><a href="/information-technology-of-company">قطاع تكنولوجيا المعلومات</a><a href="/school-new-assuit">المدرسه الفنيه</a><a href="/sport-of-company">النشاط الرياضي</a></div></details>
                    <a className="rounded-lg bg-[#0a3555] px-3 py-2 text-center text-white" href="tel:2331604">الخط الساخن: 2331604</a>
                    <div className="col-span-1 mt-1 flex flex-wrap items-center justify-center gap-3 rounded-lg bg-slate-100 px-3 py-3">
                        <a href="https://www.facebook.com/ASCWWeg" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="social-icon social-icon--facebook"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a6 6 0 0 0-6 6v4H7v4h2v6h4v-6h3l1-4h-4V8a2 2 0 0 1 2-2h1z" /></svg></a>
                        <a href="https://api.whatsapp.com/send?phone=01280733990" target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="social-icon social-icon--whatsapp"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg></a>
                        <a href="https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw" target="_blank" rel="noopener noreferrer" aria-label="يوتيوب" className="social-icon social-icon--youtube"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.96-2C18.88 4 12 4 12 4s-6.88 0-8.58.46a2.78 2.78 0 0 0-1.96 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.42 19c1.7.46 8.58.46 8.58.46s6.88 0 8.58-.46a2.78 2.78 0 0 0 1.96-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg></a>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header;


