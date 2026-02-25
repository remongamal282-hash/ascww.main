import Footer from '../components/Footer';
import Header from '../components/Header';

type Member = {
    name: string;
    role: string;
};

type OrgSection = {
    id: string;
    title: string;
    members: Member[];
};

const ORGANIZATION_SECTIONS: OrgSection[] = [
    {
        id: 'direct-departments',
        title: 'الإدارات التابعة مباشرة لرئيس مجلس الإدارة',
        members: [
            { name: 'محمود شحاته محمد', role: 'رئيس مجلس الإدارة' },
            { name: 'عبد المنعم علي محمد', role: 'المراجعة الداخلية' },
            { name: 'بهاء الدين علي بخيت', role: 'السلامة والصحة المهنية' },
            { name: 'غادة مصطفى محمد', role: 'التحليل الاقتصادي' },
            { name: 'محمد يسري يحيى', role: 'أمن الوادي الجديد' },
            { name: 'حسين سيد حسين', role: 'مكتب رئيس مجلس الإدارة' },
            { name: 'إيمان حامد برعلي', role: 'الشئون القانونية' },
            { name: 'آمال جميل جاد', role: 'العلاقات العامة' },
            { name: 'مؤمن محمد نشأت', role: 'تكنولوجيا المعلومات' },
            { name: 'هشام عبد الفتاح مصطفى', role: 'التعاون الدولي' },
            { name: 'إبراهيم محمد أبو العلا', role: 'شئون مجلس الإدارة' },
            { name: 'خالد محمد محمود فرغلي', role: 'أمن أسيوط' },
            { name: 'عمرو عوض حسين', role: 'المكتب الآلي' },
            { name: 'عبير كمال عبد الظاهر', role: 'الأملاك' },
            { name: 'بهاء عبد الله حسن أبوالنها', role: 'نائب رئيس المجلس للفنية' }
        ]
    },
    {
        id: 'projects',
        title: 'قطاع المشروعات',
        members: [
            { name: 'محمد عثمان عبد العزيز', role: 'رئيس القطاع' },
            { name: 'وفاء أحمد حسن', role: 'مشروعات 1' },
            { name: 'عبد الله صابر أحمد', role: 'مشروعات 2' },
            { name: 'أمل كامل يوسف', role: 'متابعة المشروعات' }
        ]
    },
    {
        id: 'technical-support',
        title: 'قطاع الدعم الفني',
        members: [
            { name: 'حنان ناجح عبد السيد', role: 'البحوث والمشروعات' },
            { name: 'زينب محمد عبد اللطيف', role: 'الكهرباء' },
            { name: 'هالة محمد فؤاد', role: 'المكتب الفني' },
            { name: 'شيماء جمال أحمد', role: 'فني مياه' }
        ]
    },
    {
        id: 'new-valley',
        title: 'قطاع الوادي الجديد',
        members: [
            { name: 'حسام أحمد علي', role: 'رئيس القطاع' },
            { name: 'محمد عبد الوهاب', role: 'منطقة الخارجة' },
            { name: 'محمد حسين علي', role: 'منطقة الداخلة' }
        ]
    },
    {
        id: 'regional-sectors',
        title: 'قطاعات المناطق (شمال، وسط، شرق، جنوب)',
        members: [
            { name: 'محسن فرغلي كامل', role: 'رئيس قطاع شمال' },
            { name: 'صلاح عبد الحميد', role: 'ديروط' },
            { name: 'مروة جمعة جاد الكريم', role: 'منفلوط' },
            { name: 'مسلم أحمد عبد النعيم', role: 'القوصية' },
            { name: 'حسام رفعت حكيم', role: 'رئيس قطاع وسط' },
            { name: 'أسعد كمال شحاته', role: 'مركز أسيوط بحري' },
            { name: 'كريم محمد', role: 'عرب مدبغ' },
            { name: 'أحمد كمال محمد', role: 'أبنوب' },
            { name: 'أحمد محمد علي', role: 'منطقة شرق' },
            { name: 'محمد عبد النواب عبد الحافظ', role: 'رئيس قطاع شرق' },
            { name: 'فاطمة كمال عبد الحكيم', role: 'ساحل سليم' },
            { name: 'إبراهيم عبد الله حلمي', role: 'البداري' },
            { name: 'مرفت زوزو متري', role: 'رئيس قطاع جنوب' },
            { name: 'أحمد زكريا محمود', role: 'أبوتيج' },
            { name: 'رامز شوقي إسحاق', role: 'صدفا' },
            { name: 'رمضان عبد العظيم محمد', role: 'الغنايم' },
            { name: 'مصطفى صلاح فراج', role: 'مركز أسيوط قبلي' }
        ]
    },
    {
        id: 'planning',
        title: 'قطاع التخطيط',
        members: [
            { name: 'محمد مصطفى محمد', role: 'رئيس القطاع' },
            { name: 'مروة زكريا عرفان', role: 'تطوير الأداء' },
            { name: 'مروة حسني نوبي', role: 'المخطط العام' },
            { name: 'هبه عبد الوهاب', role: 'المراجعة الفنية' },
            { name: 'مروة أحمد محمود', role: 'المياه غير المحاسب عليها' },
            { name: 'أسماء مصطفى كامل', role: 'الفنية للأصول' },
            { name: 'زينب رمضان عبد الباقي', role: 'GIS' }
        ]
    },
    {
        id: 'labs-quality',
        title: 'قطاع المعامل والجودة',
        members: [
            { name: 'إسلام محمد حسانين', role: 'رئيس القطاع' },
            { name: 'مصطفى محمد عليوه', role: 'الصرف الصناعي' },
            { name: 'كمال محمد عبد الحميد', role: 'معامل مياه الشرب' },
            { name: 'عاطف محمد جاد', role: 'البحوث والتطوير' },
            { name: 'محمد أحمد ثابت', role: 'سلامة مأمونية المياه' },
            { name: 'محمد عبد الجابر أحمد', role: 'ضبط الجودة' },
            { name: 'محمد عاطف أحمد', role: 'المعمل المركزي' }
        ]
    },
    {
        id: 'hr-finance-commercial',
        title: 'قطاع الموارد البشرية والمالي والتجاري',
        members: [
            { name: 'ياسر حسن محمد', role: 'رئيس قطاع الموارد البشرية' },
            { name: 'لبنى أحمد عبدالله', role: 'رئيس القطاع المالي' },
            { name: 'هويدا مصطفى محمود', role: 'رئيس القطاع التجاري' },
            { name: 'عماد محمد حسين', role: 'الموارد البشرية' },
            { name: 'إسلام محمد محمد', role: 'التدريب' },
            { name: 'شيماء حسين عبدالله', role: 'العقود والمشتريات' },
            { name: 'هبة الله محمود أحمد', role: 'المراجعة العامة' },
            { name: 'فاطمة كامل حسين', role: 'المراجعة الفنية' },
            { name: 'لبنى عثمان فياض', role: 'الإيرادات' },
            { name: 'نهى أحمد أبو ضيف', role: 'إصدار الفواتير' },
            { name: 'سيدة صارى عبد العليم', role: 'التكاليف' },
            { name: 'محمد خليفة حفنى', role: 'المصالح الحكومية' },
            { name: 'محمد أحمد حسين', role: 'العدادات' },
            { name: 'محمود تمام علي', role: 'المخالفات' },
            { name: 'عبد الناصر حسن على', role: 'الحسابات العامة' },
            { name: 'عبد الوهاب ماهر عبد الرحيم', role: 'المخازن' },
            { name: 'عواطف فرعلى محمد', role: 'الموازنة' },
            { name: 'أحمد جمال جلال', role: 'المتابعة المالية' },
            { name: 'محمد معوض', role: 'مراجعة' },
            { name: 'رشا كمال', role: 'تحصيل' }
        ]
    },
    {
        id: 'sub-signatures',
        title: 'الأسماء الموجودة في التفريعات الدقيقة والتوقيعات',
        members: [
            { name: 'أحمد عبد الرحيم', role: 'تفريعات دقيقة وتوقيعات' },
            { name: 'حنان حسن', role: 'تفريعات دقيقة وتوقيعات' },
            { name: 'منى جاد', role: 'تفريعات دقيقة وتوقيعات' },
            { name: 'منال فاروق', role: 'تفريعات دقيقة وتوقيعات' },
            { name: 'طارق فتحي', role: 'تفريعات دقيقة وتوقيعات' },
            { name: 'سمر أحمد', role: 'تفريعات دقيقة وتوقيعات' },
            { name: 'نهال محمد', role: 'تفريعات دقيقة وتوقيعات' },
            { name: 'ريهام أحمد', role: 'تفريعات دقيقة وتوقيعات' },
            { name: 'دعاء محمد', role: 'تفريعات دقيقة وتوقيعات' },
            { name: 'عبير محمد', role: 'تفريعات دقيقة وتوقيعات' }
        ]
    }
];

const TOTAL_MEMBERS = ORGANIZATION_SECTIONS.reduce((sum, section) => sum + section.members.length, 0);
const LARGEST_SECTION = ORGANIZATION_SECTIONS.reduce((largest, section) =>
    section.members.length > largest.members.length ? section : largest
);
const CHAIRMAN = ORGANIZATION_SECTIONS.flatMap((section) => section.members).find((member) => member.role.includes('رئيس مجلس الإدارة'));

const INFOGRAPHIC_COLORS = [
    { from: '#0a3555', to: '#1170b0', soft: '#eaf5ff', badge: '#d7ecff' },
    { from: '#0b4f3f', to: '#0e9f6e', soft: '#ebfff5', badge: '#d4fbe8' },
    { from: '#7a3a00', to: '#d97706', soft: '#fff6ea', badge: '#ffe6c7' },
    { from: '#7f1d1d', to: '#dc2626', soft: '#ffefef', badge: '#ffd7d7' }
];

function OrganizationStructurePage() {
    return (
        <>
            <Header />
            <main className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.12),_transparent_45%),linear-gradient(180deg,#f8fbff_0%,#eef6ff_52%,#ffffff_100%)] py-8" dir="rtl">
                <span className="pointer-events-none absolute -top-20 left-[-120px] h-64 w-64 rounded-full bg-[#1170b0]/10 blur-3xl"></span>
                <span className="pointer-events-none absolute -bottom-24 right-[-100px] h-64 w-64 rounded-full bg-[#0f766e]/10 blur-3xl"></span>

                <div className="mx-auto w-full max-w-7xl px-4">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <div className="bg-[linear-gradient(120deg,#0a3555_0%,#1170b0_55%,#0e9f6e_100%)] px-6 py-7 text-white sm:px-8">
                            <div className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-bold tracking-wide">
                                نسخة إنفوجرافك
                            </div>
                            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">الهيكل التنظيمي للشركة</h1>
                            <p className="mt-2 text-sm text-white/90 sm:text-base">عرض بصري شامل للأقسام والإدارات وعدد الأعضاء وتوزيع المسؤوليات.</p>
                        </div>

                        <div className="space-y-6 px-6 py-6 sm:px-8">
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <article className="rounded-2xl border border-slate-200 bg-[#f8fbff] p-4">
                                    <p className="text-xs font-bold text-slate-500">إجمالي الأسماء</p>
                                    <p className="mt-2 text-3xl font-extrabold text-[#0a3555]">{TOTAL_MEMBERS}</p>
                                </article>
                                <article className="rounded-2xl border border-slate-200 bg-[#f8fff9] p-4">
                                    <p className="text-xs font-bold text-slate-500">عدد الأقسام</p>
                                    <p className="mt-2 text-3xl font-extrabold text-[#0e9f6e]">{ORGANIZATION_SECTIONS.length}</p>
                                </article>
                                <article className="rounded-2xl border border-slate-200 bg-[#fffaf5] p-4">
                                    <p className="text-xs font-bold text-slate-500">أكبر قسم</p>
                                    <p className="mt-2 text-sm font-extrabold text-[#9a3412]">{LARGEST_SECTION.title}</p>
                                    <p className="mt-1 text-lg font-extrabold text-[#b45309]">{LARGEST_SECTION.members.length} اسمًا</p>
                                </article>
                                <article className="rounded-2xl border border-slate-200 bg-[#f9f8ff] p-4">
                                    <p className="text-xs font-bold text-slate-500">رئيس مجلس الإدارة</p>
                                    <p className="mt-2 text-sm font-extrabold text-[#1e3a8a]">{CHAIRMAN?.name ?? 'غير محدد'}</p>
                                </article>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <a
                                        href="https://backend.ascww.org/api/admin-structure/download"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-full bg-[#0a3555] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[#082b47]"
                                    >
                                        تحميل ملف الهيكل التنظيمي (PDF)
                                    </a>
                                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600">
                                        الإنفوجرافك مبني على آخر قائمة محدثة
                                    </span>
                                </div>
                            </div>

                            <div className="relative space-y-5 before:absolute before:bottom-6 before:right-[22px] before:top-6 before:hidden before:w-1 before:rounded-full before:bg-[linear-gradient(180deg,#0a3555,#1170b0,#0e9f6e)] lg:before:block">
                                {ORGANIZATION_SECTIONS.map((section, index) => {
                                    const palette = INFOGRAPHIC_COLORS[index % INFOGRAPHIC_COLORS.length];
                                    return (
                                        <article key={section.id} className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                            <span
                                                className="absolute right-2 top-4 z-10 hidden h-10 w-10 items-center justify-center rounded-full border-2 border-white text-sm font-extrabold text-white shadow-md lg:flex"
                                                style={{ background: `linear-gradient(130deg, ${palette.from}, ${palette.to})` }}
                                            >
                                                {index + 1}
                                            </span>

                                            <header
                                                className="px-5 py-4 lg:pr-16"
                                                style={{ background: `linear-gradient(140deg, ${palette.from}, ${palette.to})` }}
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-3">
                                                    <h2 className="text-lg font-extrabold text-white sm:text-xl">{section.title}</h2>
                                                    <span
                                                        className="rounded-full border px-3 py-1 text-xs font-extrabold text-slate-800"
                                                        style={{ backgroundColor: palette.badge, borderColor: palette.soft }}
                                                    >
                                                        {section.members.length} اسمًا
                                                    </span>
                                                </div>
                                            </header>

                                            <div className="space-y-4 p-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {section.members.slice(0, 5).map((member) => (
                                                        <span
                                                            key={`${section.id}-${member.name}-role`}
                                                            className="rounded-full border px-2 py-1 text-[11px] font-bold text-slate-700"
                                                            style={{ backgroundColor: palette.soft, borderColor: '#dbeafe' }}
                                                        >
                                                            {member.role}
                                                        </span>
                                                    ))}

                                                </div>
                                                <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                                    {section.members.map((member) => (
                                                        <li
                                                            key={`${section.id}-${member.name}`}
                                                            className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                                                        >
                                                            <p className="text-sm font-extrabold text-slate-800">{member.name}</p>
                                                            <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">{member.role}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default OrganizationStructurePage;
