function Footer() {
    return (
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a6 6 0 0 0-6 6v4H7v4h2v6h4v-6h3l1-4h-4V8a2 2 0 0 1 2-2h1z" /></svg>
                            </a>
                            <a href="https://api.whatsapp.com/send?phone=01280733990" target="_blank" rel="noopener noreferrer" aria-label="واتساب" className="social-icon social-icon--whatsapp">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            </a>
                            <a href="https://youtube.com/channel/UC73LZeR5Yr5TE7fsTzvZSVw" target="_blank" rel="noopener noreferrer" aria-label="يوتيوب" className="social-icon social-icon--youtube">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.96-2C18.88 4 12 4 12 4s-6.88 0-8.58.46a2.78 2.78 0 0 0-1.96 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.42 19c1.7.46 8.58.46 8.58.46s6.88 0 8.58-.46a2.78 2.78 0 0 0 1.96-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
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
    );
}

export default Footer;
