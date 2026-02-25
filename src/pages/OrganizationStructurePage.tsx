import { useEffect, useMemo, useState } from 'react';
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

const isVacantMember = (member: Member) =>
    member.name.includes('شاغر') || member.role.includes('شاغر');

const ORGANIZATION_SECTIONS: OrgSection[] = [
    {
        id: 'upper-management',
        title: 'الإدارة العليا',
        members: [
            { name: 'مهندس / محمود شحاته محمد', role: 'رئيس مجلس الإدارة والعضو المنتدب.' },
            { name: 'أ / لبنى أحمد عبدالله', role: 'نائب رئيس مجلس الإدارة للشئون المالية والإدارية ورئيس القطاع المالي.' },
            { name: 'م / بهاء عبد المنجي حسن أبو النجا', role: 'نائب رئيس مجلس الإدارة للشئون الفنية ورئيس قطاع الدعم الفني.' }
        ]
    },
    {
        id: 'general-management',
        title: 'الإدارات العامة',
        members: [
            { name: 'أ / عبد المنعم حسني محمد', role: 'الإدارة العامة للمراجعة الداخلية والتفتيش.' },
            { name: 'لواء / بهاء أحمد علي بخيت', role: 'الإدارة العامة للسلامة والصحة المهنية.' },
            { name: 'أ / غادة مصطفى محمد', role: 'الإدارة العامة للتحليل الاقتصادي.' },
            { name: '(شاغر)', role: 'الإدارة العامة للخدمات الفنية.' },
            { name: 'لواء / محمد يسري يحيى', role: 'الإدارة العامة للأمن بالوادي الجديد.' },
            { name: 'أ / حسين سيد حسين', role: 'الإدارة العامة لمكتب رئيس مجلس الإدارة.' },
            { name: 'أ / إيمان حامد مرغني', role: 'الإدارة العامة للشئون القانونية.' },
            { name: 'أ / آمال جميل جاد', role: 'الإدارة العامة للعلاقات العامة والتوعية.' },
            { name: 'أ / مؤمن محمد نشأت', role: 'الإدارة العامة لتكنولوجيا المعلومات.' },
            { name: 'م / هشام عبد الفتاح مصطفى', role: 'الإدارة العامة للتعاون الدولي.' },
            { name: 'أ / إبراهيم محمد أبو العلا', role: 'الإدارة العامة لشئون مجلس الإدارة.' },
            { name: 'خالد محمد محمود فرغلي', role: 'الإدارة العامة للأمن بأسيوط.' },
            { name: 'م / عمرو عوض حسين', role: 'الإدارة العامة للمكتب الفني.' },
            { name: 'م / عبير كمال عبد الظاهر', role: 'الإدارة العامة للأملاك.' }
        ]
    },
    {
        id: 'projects',
        title: 'قطاع المشروعات',
        members: [
            { name: 'م / محمد عثمان عبد العزيز', role: 'رئيس قطاع المشروعات.' },
            { name: '(شاغر)', role: 'الإدارة العامة للتنفيذ الذاتي.' },
            { name: 'م / عبد الله عمر أحمد', role: 'الإدارة العامة لتنفيذ المشروعات.' },
            { name: 'م / حنان ناجح عبد السيد', role: 'الإدارة العامة لبحوث المشروعات.' },
            { name: 'م / فاطمة كامل حسين', role: 'الإدارة العامة للمراجعة الفنية.' }
        ]
    },
    {
        id: 'technical-support',
        title: 'قطاع الدعم الفني',
        members: [
            { name: 'م / بهاء عبد المنجي حسن', role: 'رئيس قطاع الدعم الفني.' },
            { name: 'م / شيماء جمال أحمد', role: 'مدير الإدارة العامة للدعم الفني مياه.' },
            { name: 'م / زينب محمد عبد اللطيف', role: 'الإدارة العامة للكهرباء وترشيد الطاقة.' },
            { name: '(شاغر)', role: 'الإدارة العامة للاحتياجات.' },
            { name: '(شاغر)', role: 'الإدارة العامة للدعم الفني صرف.' },
            { name: '(شاغر)', role: 'الإدارة العامة للإسكادا.' }
        ]
    },
    {
        id: 'new-valley',
        title: 'قطاع الوادي الجديد',
        members: [
            { name: 'م / حسام أحمد علي', role: 'رئيس قطاع الوادي الجديد.' },
            { name: 'م / أحمد محمد عبد الوهاب', role: 'الإدارة العامة لمنطقة الخارجة.' },
            { name: 'م / محمد حسين علي', role: 'الإدارة العامة لمنطقة الداخلة.' },
            { name: '(شاغر)', role: 'الإدارة العامة لمنطقة باريس.' },
            { name: '(شاغر)', role: 'الإدارة العامة لمنطقة الفرافرة.' },
            { name: '(شاغر)', role: 'الإدارة العامة لمنطقة بلاط.' }
        ]
    },
    {
        id: 'north-sector',
        title: 'قطاع شمال',
        members: [
            { name: 'م / محسن فوزي كامل', role: 'رئيس قطاع شمال.' },
            { name: 'أ / أشرف صلاح عبد الحميد', role: 'الإدارة العامة لمنطقة ديروط.' },
            { name: 'م / عصام أحمد عبد المنعم', role: 'الإدارة العامة لمنطقة القوصية.' },
            { name: 'م / مروة جمعة أحمد', role: 'الإدارة العامة لمنطقة منفلوط.' }
        ]
    },
    {
        id: 'south-sector',
        title: 'قطاع جنوب',
        members: [
            { name: 'م / مرفت زوزو متري', role: 'رئيس قطاع جنوب.' },
            { name: 'م / أحمد زكريا محمود', role: 'الإدارة العامة لمنطقة أبوتيج.' },
            { name: 'م / رامز شوقي إسحاق', role: 'الإدارة العامة لمنطقة صدفا.' },
            { name: 'م / رمضان عبد العظيم محمد', role: 'الإدارة العامة لمنطقة الغنايم.' }
        ]
    },
    {
        id: 'middle-sector',
        title: 'قطاع وسط',
        members: [
            { name: 'م / حسام رفعت حكيم', role: 'رئيس قطاع وسط.' },
            { name: 'م / كريم محمد محمد أحمد', role: 'الإدارة العامة لمنطقة غرب.' },
            { name: 'م / محمد عبد الرشيد موسى', role: 'الإدارة العامة لمنطقة مركز أسيوط بحري.' },
            { name: 'م / مصطفى صلاح فراج', role: 'الإدارة العامة لمنطقة مركز أسيوط قبلي.' },
            { name: 'م / أحمد محمد علي', role: 'الإدارة العامة لمنطقة شرق.' }
        ]
    },
    {
        id: 'financial-sector',
        title: 'القطاع المالي',
        members: [
            { name: 'أ / لبنى أحمد عبدالله', role: 'رئيس القطاع المالي.' },
            { name: 'أ / شيماء حسين عبدالله', role: 'الإدارة العامة للعقود والمشتريات.' },
            { name: 'أ / هبه الله محمود أحمد', role: 'الإدارة العامة للمراجعة العامة.' },
            { name: 'أ / سيدة صاوى عبد العليم', role: 'الإدارة العامة للتكاليف والأصول.' },
            { name: 'أ / عبدالناصر حسن علي', role: 'الإدارة العامة للحسابات العامة.' },
            { name: 'أ / عبدالوهاب ماهر عبدالرحيم', role: 'الإدارة العامة للمخازن.' },
            { name: 'أ / عواطف فرغلي محمد', role: 'الإدارة العامة للموازنة.' },
            { name: 'أ / أحمد جمال جلال', role: 'الإدارة العامة للمتابعة المالية.' }
        ]
    },
    {
        id: 'commercial-sector',
        title: 'القطاع التجاري',
        members: [
            { name: 'أ / همت مصطفى محمود', role: 'رئيس القطاع التجاري.' },
            { name: 'أ / لبنى عثمان فياض', role: 'الإدارة العامة للإيرادات والتحصيل.' },
            { name: 'أ / نهى أحمد أبو ضيف', role: 'الإدارة العامة لإصدار الفواتير.' },
            { name: 'أ / محمد خليفة حفنى', role: 'الإدارة العامة للمصالح الحكومية وكبار المشتركين.' },
            { name: 'أ / محمد أحمد حسين', role: 'الإدارة العامة للعدادات والاشتراكات.' },
            { name: '(شاغر)', role: 'الإدارة العامة لخدمة العملاء.' },
            { name: 'أ / محمود تمام علي', role: 'الإدارة العامة للمخالفات والخلسة.' }
        ]
    },
    {
        id: 'hr-sector',
        title: 'قطاع الموارد البشرية',
        members: [
            { name: 'لواء / ياسر حسن محمد', role: 'رئيس قطاع الموارد البشرية.' },
            { name: 'أ / عماد محمد حسين', role: 'الإدارة العامة للموارد البشرية.' },
            { name: 'أ / إسلام محمد محمد', role: 'الإدارة العامة للتدريب.' },
            { name: '(شاغر)', role: 'الإدارة العامة للشئون الإدارية.' }
        ]
    },
    {
        id: 'planning',
        title: 'قطاع التخطيط',
        members: [
            { name: 'م / محمد مصطفى محمد', role: 'رئيس قطاع التخطيط.' },
            { name: 'م / مروة زكريا عرفان', role: 'الإدارة العامة للتخطيط وتطوير الأداء المؤسسي.' },
            { name: 'م / مروة حسنى دياب', role: 'الإدارة العامة للمخطط العام.' },
            { name: 'م / فاطمة كمال عبدالحكم', role: 'الإدارة العامة للتحليل الهيدروليكي.' },
            { name: 'م / مروة أحمد محمود', role: 'الإدارة العامة للمياه غير محاسب عليها وتقليل الفاقد والقياسات.' },
            { name: 'م / أسماء مصطفى كامل', role: 'الإدارة العامة الفنية للأصول.' },
            { name: 'أ / زينب رمضان عبدالباقي', role: 'الإدارة العامة للـ GIS.' },
            { name: 'ك / عاطف محمد جاد', role: 'الإدارة العامة للبحوث والتطوير.' }
        ]
    },
    {
        id: 'labs-quality',
        title: 'قطاع المعامل والجودة',
        members: [
            { name: 'ك / إسلام محمد حسانين', role: 'رئيس قطاع المعامل والجودة.' },
            { name: 'ك / مصطفى محمد عليوه', role: 'الإدارة العامة للصرف الصناعي.' },
            { name: 'ك / كمال محمد عبدالحميد', role: 'الإدارة العامة لمعامل محطات مياه الشرب.' },
            { name: '(شاغر)', role: 'الإدارة العامة لمعامل محطات الصرف الصحي.' },
            { name: 'ك / محمد أحمد ثابت', role: 'الإدارة العامة لسلامة ومأمونية مياه الشرب ومأمونية الصرف الصحي.' },
            { name: '(شاغر)', role: 'الإدارة العامة للمعمل المركزي لتحاليل الصرف الصحي.' },
            { name: 'ك / محمد عبدالجابر أحمد', role: 'الإدارة العامة لضبط الجودة وشئون البيئة.' },
            { name: 'ك / محمد عاطف أحمد', role: 'الإدارة العامة للمعمل المركزي لمياه الشرب.' }
        ]
    },
    {
        id: 'east-sector',
        title: 'قطاع شرق',
        members: [
            { name: 'ك / محمد عبدالتواب عبدالحافظ', role: 'رئيس قطاع شرق.' },
            { name: 'م / أحمد كمال محمد حرويه', role: 'الإدارة العامة لمنطقة الفتح.' },
            { name: 'م / أحمد جمال شحاته', role: 'الإدارة العامة لمنطقة أبنوب.' },
            { name: 'م / إبراهيم عبدالله حلمي', role: 'الإدارة العامة لمنطقة البداري.' },
            { name: 'م / عبدالرحمن طلعت عبدالرحمن', role: 'الإدارة العامة لمنطقة ساحل سليم.' }
        ]
    }
];

const CHAIRMAN = ORGANIZATION_SECTIONS.flatMap((section) => section.members).find((member) => member.role.includes('رئيس مجلس الإدارة'));

const INFOGRAPHIC_COLORS = [
    { from: '#0a3555', to: '#1170b0', soft: '#eaf5ff', badge: '#d7ecff' },
    { from: '#0b4f3f', to: '#0e9f6e', soft: '#ebfff5', badge: '#d4fbe8' },
    { from: '#7a3a00', to: '#d97706', soft: '#fff6ea', badge: '#ffe6c7' },
    { from: '#7f1d1d', to: '#dc2626', soft: '#ffefef', badge: '#ffd7d7' }
];

function OrganizationStructurePage() {
    const [activeSectionId, setActiveSectionId] = useState<string>(ORGANIZATION_SECTIONS[0]?.id ?? '');
    const [query, setQuery] = useState('');
    const normalizedSections = useMemo(
        () =>
            ORGANIZATION_SECTIONS.map((section) => ({
                ...section,
                members: [
                    ...section.members.filter((member) => !isVacantMember(member)),
                    ...section.members.filter((member) => isVacantMember(member))
                ]
            })),
        []
    );

    const normalizedQuery = query.trim().toLowerCase();
    const filteredSections = useMemo(() => {
        if (!normalizedQuery) return normalizedSections;
        return normalizedSections.filter((section) => {
            const inTitle = section.title.toLowerCase().includes(normalizedQuery);
            const inMembers = section.members.some((member) =>
                member.role.toLowerCase().includes(normalizedQuery)
            );
            return inTitle || inMembers;
        });
    }, [normalizedQuery, normalizedSections]);

    useEffect(() => {
        if (!filteredSections.length) return;
        if (filteredSections.some((section) => section.id === activeSectionId)) return;
        setActiveSectionId(filteredSections[0].id);
    }, [filteredSections, activeSectionId]);

    const activeSection = filteredSections.find((section) => section.id === activeSectionId) ?? filteredSections[0] ?? normalizedSections[0];
    const activeSectionMembers = (activeSection?.members ?? []).filter((member) => !isVacantMember(member));
    const activeSectionIndex = normalizedSections.findIndex((section) => section.id === activeSection.id);
    const activePalette = INFOGRAPHIC_COLORS[(activeSectionIndex >= 0 ? activeSectionIndex : 0) % INFOGRAPHIC_COLORS.length];
    const centerX = 610;
    const centerY = 520;
    const nodeWidth = 180;
    const nodeHeight = 88;
    const nodeHorizontalGap = 60;
    const nodeVerticalGap = 70;

    const ringNodes = useMemo(() => {
        const sections = filteredSections;
        if (!sections.length) return [];
        const outerCount = sections.length <= 10 ? sections.length : Math.ceil(sections.length * 0.6);
        const innerCount = sections.length - outerCount;

        return sections.map((section, index) => {
            const isOuter = index < outerCount || innerCount === 0;
            const ringIndex = isOuter ? index : index - outerCount;
            const ringTotal = isOuter ? outerCount : innerCount;
            const ringSpacing = nodeHeight + nodeVerticalGap;
            const minArc = nodeWidth + nodeHorizontalGap;
            const minInnerRadius = Math.max(210, (minArc * Math.max(innerCount, 1)) / (Math.PI * 2));
            const minOuterRadius = Math.max(minInnerRadius + ringSpacing, (minArc * Math.max(outerCount, 1)) / (Math.PI * 2));
            const radius = isOuter ? minOuterRadius : minInnerRadius;
            const angle = ((Math.PI * 2) / ringTotal) * ringIndex - Math.PI / 2 + (isOuter ? 0 : Math.PI / ringTotal);
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            return { section, x, y };
        });
    }, [filteredSections]);

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
                                خريطة ذهنية تفاعلية
                            </div>
                            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">الهيكل التنظيمي للشركة</h1>
                        </div>

                        <div className="space-y-6 px-6 py-6 sm:px-8">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
                                    <div className="w-full md:flex-1">
                                        <label htmlFor="org-search" className="mb-2 block text-xs font-bold text-slate-600">بحث ذكي داخل القطاعات والادارات</label>
                                        <div className="relative">
                                            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#0a3555]/70">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                    <path d="m21 21-4.35-4.35"></path>
                                                </svg>
                                            </span>
                                            <input
                                                id="org-search"
                                                type="search"
                                                value={query}
                                                onChange={(event) => setQuery(event.target.value)}
                                                placeholder="اكتب قطاعًا أو إدارةً أو منطقةً..."
                                                className="h-10 w-full rounded-full border border-[#d7b05a]/55 bg-white pr-9 pl-4 text-sm text-slate-700 outline-none transition focus:border-[#0a3555] focus:ring-2 focus:ring-[#0a3555]/15"
                                            />
                                        </div>
                                    </div>
                                    <a
                                        href="https://backend.ascww.org/api/admin-structure/download"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#0a3555] px-4 text-sm font-extrabold text-white transition hover:bg-[#082b47] whitespace-nowrap"
                                    >
                                        تحميل ملف الهيكل التنظيمي (PDF)
                                    </a>
                                </div>
                            </div>

                            <section className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5">
                                <h2 className="text-lg font-extrabold text-slate-800 sm:text-xl">الخريطة الذهنية للهيكل التنظيمي</h2>
                                <p className="mt-1 text-center text-sm text-slate-600">ارشادات تصفح الخريطة : اضغط على أي كرت موجود بالخريطة عليه اسم قطاع او اداره لعرض الأسماء والوظائف الخاصة به بالاسفل .</p>

                                <div className="mt-5 space-y-3 lg:hidden">
                                    {filteredSections.map((section, index) => {
                                        const palette = INFOGRAPHIC_COLORS[index % INFOGRAPHIC_COLORS.length];
                                        const isActive = section.id === activeSection.id;
                                        return (
                                            <button
                                                key={`mobile-map-${section.id}`}
                                                type="button"
                                                onClick={() => setActiveSectionId(section.id)}
                                                className={`block w-full rounded-2xl border bg-white p-3 text-center transition ${isActive ? 'border-[#1170b0] ring-2 ring-[#1170b0]/20' : 'border-slate-200 hover:border-[#1170b0]/45'}`}
                                            >
                                                <h3 className="text-sm font-extrabold text-slate-800">{section.title}</h3>
                                            </button>
                                        );
                                    })}
                                    {!filteredSections.length && (
                                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                                            لا توجد نتائج مطابقة للبحث.
                                        </div>
                                    )}
                                </div>

                                <div className="mt-5 hidden lg:block">
                                    <div className="mx-auto w-full max-w-[1220px]">
                                        <div className="relative h-[1100px] rounded-3xl border border-slate-200 bg-[radial-gradient(circle_at_center,_rgba(17,112,176,0.13),_rgba(255,255,255,0.97)_55%)]">
                                            <svg className="pointer-events-none absolute inset-0 h-full w-full">
                                                {ringNodes.map(({ section, x, y }, index) => {
                                                    const palette = INFOGRAPHIC_COLORS[index % INFOGRAPHIC_COLORS.length];
                                                    const isActive = section.id === activeSection.id;
                                                    return (
                                                        <line
                                                            key={`line-${section.id}`}
                                                            x1={centerX}
                                                            y1={centerY}
                                                            x2={x}
                                                            y2={y}
                                                            stroke={isActive ? palette.to : '#95a3b3'}
                                                            strokeWidth={isActive ? 3 : 1.6}
                                                            strokeOpacity={isActive ? 0.95 : 0.55}
                                                            strokeDasharray={isActive ? '0' : '5 5'}
                                                        />
                                                    );
                                                })}
                                            </svg>

                                            <article className="absolute z-20 w-[260px] rounded-2xl border border-slate-300 bg-white p-4 text-center shadow-lg" style={{ top: centerY - 64, left: centerX - 130 }}>
                                                <h3 className="mt-1 text-sm font-extrabold text-[#0a3555]">رئيس مجلس الإدارة</h3>
                                                <p className="mt-1 text-xs font-semibold text-slate-700">{CHAIRMAN?.name ?? 'غير محدد'}</p>
                                            </article>

                                            {ringNodes.map(({ section, x, y }, index) => {
                                                const palette = INFOGRAPHIC_COLORS[index % INFOGRAPHIC_COLORS.length];
                                                const isActive = section.id === activeSection.id;
                                                const nodeTitle = section.title.trim() || 'بدون عنوان';
                                                return (
                                                    <button
                                                        key={`desktop-map-${section.id}`}
                                                        type="button"
                                                        onClick={() => setActiveSectionId(section.id)}
                                                        title={nodeTitle}
                                                        className={`absolute z-10 flex items-center justify-center rounded-2xl border bg-white p-2 text-center shadow-md transition ${isActive ? 'border-[#1170b0] ring-2 ring-[#1170b0]/30' : 'border-slate-200 hover:border-[#1170b0]/45'}`}
                                                        style={{ width: nodeWidth, minHeight: nodeHeight, left: x - nodeWidth / 2, top: y - nodeHeight / 2 }}
                                                    >
                                                        <h4 className="text-xs font-extrabold leading-5 text-slate-800 break-words">{nodeTitle}</h4>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {activeSection ? (
                                <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <header
                                        className="px-5 py-4"
                                        style={{ background: `linear-gradient(140deg, ${activePalette.from}, ${activePalette.to})` }}
                                    >
                                        <h2 className="text-lg font-extrabold text-white sm:text-xl">{activeSection.title}</h2>
                                    </header>

                                    <div className="space-y-4 p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {activeSectionMembers.slice(0, 6).map((member) => (
                                                <span
                                                    key={`${activeSection.id}-${member.name}-role`}
                                                    className="rounded-full border px-2 py-1 text-[11px] font-bold text-slate-700"
                                                    style={{ backgroundColor: activePalette.soft, borderColor: '#dbeafe' }}
                                                >
                                                    {member.role}
                                                </span>
                                            ))}
                                        </div>
                                        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                            {activeSectionMembers.map((member) => (
                                                <li
                                                    key={`${activeSection.id}-${member.name}`}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                                                >
                                                    <p className="text-sm font-extrabold text-slate-800">{member.name}</p>
                                                    <p className="mt-1 text-xs font-semibold text-slate-600 sm:text-sm">{member.role}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </article>
                            ) : (
                                <article className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
                                    لا توجد بيانات مطابقة للبحث الحالي.
                                </article>
                            )}

                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default OrganizationStructurePage;



