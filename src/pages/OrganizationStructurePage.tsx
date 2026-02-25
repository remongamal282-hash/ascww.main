import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { API_BASE_ENDPOINT } from '../utils/helpers';

type BoardMember = {
    index?: number;
    name?: string;
    position?: string;
};

type Theme = {
    topFrom: string;
    topTo: string;
    cardFrom: string;
    cardTo: string;
    line: string;
    iconBg: string;
};

type Sector = {
    id: 'finance' | 'hr' | 'technical' | 'projects';
    title: string;
    subtitle: string;
    keywords: string[];
    icon: (color: string) => JSX.Element;
};

const MODEL_3_THEME: Theme = { topFrom: '#153e75', topTo: '#0ea5e9', cardFrom: '#eff6ff', cardTo: '#e0f2fe', line: '#93c5fd', iconBg: '#1d4ed8' };

const SECTORS: Sector[] = [
    {
        id: 'finance',
        title: 'قطاع المالية',
        subtitle: 'الموازنة - الحسابات - التحصيل',
        keywords: ['المالية', 'مالي', 'الحسابات', 'الموازنة', 'التحصيل'],
        icon: (color) => (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.8">
                <path d="M3 7h18v11H3z" />
                <path d="M3 11h18" />
                <circle cx="12" cy="15.5" r="1.7" />
            </svg>
        )
    },
    {
        id: 'hr',
        title: 'قطاع الموارد البشرية',
        subtitle: 'التوظيف - التدريب - شؤون العاملين',
        keywords: ['الموارد البشرية', 'شؤون العاملين', 'التوظيف', 'التدريب', 'إداري', 'اداري'],
        icon: (color) => (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.8">
                <circle cx="9" cy="8" r="2.5" />
                <circle cx="15.5" cy="9" r="2" />
                <path d="M4 18c0-2.4 2-4.3 4.5-4.3S13 15.6 13 18" />
                <path d="M13 18c0-1.8 1.6-3.3 3.6-3.3 2 0 3.4 1.4 3.4 3.3" />
            </svg>
        )
    },
    {
        id: 'technical',
        title: 'قطاع الدعم الفني',
        subtitle: 'التشغيل - الصيانة - الجودة',
        keywords: ['الدعم الفني', 'فني', 'التشغيل', 'الصيانة', 'الجودة', 'المعامل'],
        icon: (color) => (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.8">
                <circle cx="12" cy="12" r="2.8" />
                <path d="M19.4 15.1l1.2 2.1-1.7 1.7-2.1-1.2a7.8 7.8 0 0 1-2 .8L14.5 21h-2.9l-.4-2.5a7.8 7.8 0 0 1-2-.8l-2.1 1.2-1.7-1.7 1.2-2.1a7.8 7.8 0 0 1-.8-2L3 12.5V9.6l2.5-.4c.2-.7.5-1.4.8-2L5.1 5.1 6.8 3.4l2.1 1.2c.6-.3 1.3-.6 2-.8L11.3 1h2.9l.4 2.8c.7.2 1.4.5 2 .8l2.1-1.2 1.7 1.7-1.2 2.1c.3.6.6 1.3.8 2l2.8.4v2.9l-2.8.4a7.8 7.8 0 0 1-.8 2z" />
            </svg>
        )
    },
    {
        id: 'projects',
        title: 'قطاع المشروعات',
        subtitle: 'التخطيط - التنفيذ - المتابعة',
        keywords: ['المشروعات', 'المشروع', 'التخطيط', 'التنفيذ', 'المتابعة', 'مشروعات'],
        icon: (color) => (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="1.8">
                <path d="M4 20V9l8-5 8 5v11z" />
                <path d="M9 20v-5h6v5" />
                <path d="M10 10h4" />
            </svg>
        )
    }
];

type AssignedSector = Sector & {
    leaderName: string;
    leaderPosition: string;
};

const cleanText = (value: unknown) =>
    String(value ?? '')
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const parseBoardMembers = (payload: unknown): BoardMember[] => {
    const payloadObject = (payload && typeof payload === 'object' ? payload : {}) as {
        data?: unknown;
        value?: unknown;
        items?: unknown;
    };

    const membersRaw = Array.isArray(payload)
        ? payload
        : Array.isArray(payloadObject.data)
            ? payloadObject.data
            : Array.isArray(payloadObject.value)
                ? payloadObject.value
                : Array.isArray(payloadObject.items)
                    ? payloadObject.items
                    : [];

    return membersRaw
        .filter((item): item is BoardMember => typeof item === 'object' && item !== null)
        .sort((first, second) => Number(first.index ?? 0) - Number(second.index ?? 0));
};

const pickMember = (members: BoardMember[], usedIndexes: Set<number>, keywords: string[]) => {
    const normalizedKeywords = keywords.map((item) => cleanText(item).toLowerCase());
    const indexByKeywords = members.findIndex((member, memberIndex) => {
        if (usedIndexes.has(memberIndex)) return false;
        const haystack = `${cleanText(member.position)} ${cleanText(member.name)}`.toLowerCase();
        return normalizedKeywords.some((keyword) => haystack.includes(keyword));
    });

    if (indexByKeywords >= 0) {
        usedIndexes.add(indexByKeywords);
        return members[indexByKeywords];
    }

    const fallbackIndex = members.findIndex((_, memberIndex) => !usedIndexes.has(memberIndex));
    if (fallbackIndex >= 0) {
        usedIndexes.add(fallbackIndex);
        return members[fallbackIndex];
    }

    return null;
};

function OrganizationChartVariant({
    theme,
    chairmanName,
    chairmanPosition,
    sectors
}: {
    theme: Theme;
    chairmanName: string;
    chairmanPosition: string;
    sectors: AssignedSector[];
}) {
    const topStyle: CSSProperties = {
        background: `linear-gradient(135deg, ${theme.topFrom}, ${theme.topTo})`
    };

    const cardStyle: CSSProperties = {
        background: `linear-gradient(180deg, ${theme.cardFrom}, ${theme.cardTo})`
    };

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mx-auto max-w-md rounded-xl px-4 py-4 text-center text-white shadow-sm" style={topStyle}>
                    <p className="text-sm font-extrabold">رئيس مجلس الإدارة</p>
                    <p className="mt-1 text-xs font-semibold text-white/90">{chairmanName}</p>
                    {chairmanPosition ? <p className="mt-0.5 text-[11px] text-white/80">{chairmanPosition}</p> : null}
                </div>

                <div className="relative mx-auto mt-3 h-16 w-full max-w-5xl">
                    <span className="absolute left-1/2 top-0 h-7 w-px -translate-x-1/2" style={{ backgroundColor: theme.line }}></span>
                    <span className="absolute left-[12.5%] right-[12.5%] top-7 h-px" style={{ backgroundColor: theme.line }}></span>
                    <span className="absolute left-[12.5%] top-7 h-8 w-px" style={{ backgroundColor: theme.line }}></span>
                    <span className="absolute left-[37.5%] top-7 h-8 w-px" style={{ backgroundColor: theme.line }}></span>
                    <span className="absolute left-[62.5%] top-7 h-8 w-px" style={{ backgroundColor: theme.line }}></span>
                    <span className="absolute left-[87.5%] top-7 h-8 w-px" style={{ backgroundColor: theme.line }}></span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {sectors.map((sector) => (
                        <div key={sector.id} className="rounded-xl border border-slate-200 p-3 text-center" style={cardStyle}>
                            <span
                                className="mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white"
                                style={{ color: theme.iconBg }}
                            >
                                {sector.icon(theme.iconBg)}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-800">{sector.title}</h4>
                            <p className="mt-1 text-xs font-semibold text-slate-600">{sector.subtitle}</p>
                            <p className="mt-2 text-xs font-extrabold text-[#153e75]">{sector.leaderName}</p>
                            {sector.leaderPosition ? (
                                <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{sector.leaderPosition}</p>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
        </article>
    );
}

function OrganizationStructurePage() {
    const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadBoardMembers = async () => {
            try {
                const response = await fetch(`${API_BASE_ENDPOINT}/admin-board-members`, {
                    signal: controller.signal
                });
                if (!response.ok) return;
                const payload = (await response.json()) as unknown;
                if (!active) return;
                setBoardMembers(parseBoardMembers(payload));
            } catch {
                if (!active) return;
            }
        };

        loadBoardMembers();

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    const chartData = useMemo(() => {
        const used = new Set<number>();
        const chairman = pickMember(boardMembers, used, ['رئيس مجلس الإدارة', 'رئيس مجلس', 'رئيس الشركة']);
        const assignedSectors: AssignedSector[] = SECTORS.map((sector) => {
            const member = pickMember(boardMembers, used, sector.keywords);
            return {
                ...sector,
                leaderName: cleanText(member?.name) || 'غير محدد',
                leaderPosition: cleanText(member?.position)
            };
        });

        return {
            chairmanName: cleanText(chairman?.name) || 'غير محدد',
            chairmanPosition: cleanText(chairman?.position),
            sectors: assignedSectors
        };
    }, [boardMembers]);

    return (
        <>
            <Header />
            <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_46%)] py-8" dir="rtl">
                <div className="mx-auto w-full max-w-7xl px-4">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
                            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
                                عن الشركة
                            </div>
                            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">الهيكل التنظيمي للشركة</h1>
                            <p className="mt-2 text-sm text-white/90 sm:text-base">
                                نموذج 3 المعتمد للمخطط التنظيمي مع إدراج أسماء الأشخاص تلقائيًا.
                            </p>
                        </div>

                        <div className="space-y-6 px-6 py-6 sm:px-8">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                <a
                                    href="https://backend.ascww.org/api/admin-structure/download"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full bg-[#0a3555] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[#082b47]"
                                >
                                    تحميل ملف الهيكل التنظيمي (PDF)
                                </a>
                            </div>

                            <div>
                                <OrganizationChartVariant
                                    theme={MODEL_3_THEME}
                                    chairmanName={chartData.chairmanName}
                                    chairmanPosition={chartData.chairmanPosition}
                                    sectors={chartData.sectors}
                                />
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
