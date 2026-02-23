import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

type BranchOffice = {
    id: number;
    name: string;
    address: string;
    phone: string;
    fax: string;
    lat: number | null;
    lng: number | null;
};

const LEGACY_BRANCHES_PAGE_URL = 'https://ascww.org/branch-of-company';
const LEGACY_BASE_URL = 'https://ascww.org';

const ALL_BRANCHES: BranchOffice[] = [
    { id: 1, name: 'فرع ديروط', address: 'شارع البحر الأعظم', phone: '01210487781', fax: '088-2131662', lat: 27.4452136379, lng: 30.8218154894 },
    { id: 2, name: 'فرع منفلوط', address: 'شارع جسر أبو منديل - بجوار المعهد الأزهري', phone: '01210487749', fax: '088-2131662', lat: 27.3115858342, lng: 30.9713984287 },
    { id: 3, name: 'فرع القوصية', address: 'أمام المرور القديم', phone: '01210487678', fax: '088-2131662', lat: 27.4397136271, lng: 30.8268023357 },
    { id: 4, name: 'الفرع الرئيسي', address: 'محطة مياه المرشحة بنزلة عبد اللاه - أسيوط', phone: '088/2131662 - 2131654 - 2131655', fax: '088-2131662', lat: 27.1730480301, lng: 31.2030938552 },
    { id: 5, name: 'فرع شرق أسيوط', address: 'شارع الهلالي أمام مديرية الإسكان', phone: '088/2131662 - 2131654 - 2131655', fax: '088-2131662', lat: 27.1851287383, lng: 31.1948550978 },
    { id: 6, name: 'فرع غرب أسيوط', address: 'شارع 23 يوليو خلف بنك ناصر', phone: '088/2131662 - 2131654 - 2131655', fax: '088-2131662', lat: 27.1755750159, lng: 31.1764614822 },
    { id: 7, name: 'فرع أبنوب', address: 'شارع عثمان الغزالي بجوار المخبز الآلي', phone: '01210487737', fax: '088-2131662', lat: 27.2674845387, lng: 31.1519329371 },
    { id: 8, name: 'فرع مركز الفتح', address: 'الناصرية أمام مركز الشرطة', phone: '01210487740', fax: '088-2131662', lat: 27.1756268394, lng: 31.1839359957 },
    { id: 9, name: 'فرع مركز البداري', address: 'شارع مجلس النيابة القديم', phone: '01284447689', fax: '088-2131662', lat: 26.9924993574, lng: 31.4100708614 },
    { id: 10, name: 'فرع الغنايم', address: 'الغنايم بحري خلف مركز الشرطة', phone: '01210487696', fax: '088-2131662', lat: 26.9956968011, lng: 31.2549023398 },
    { id: 11, name: 'فرع أبوتيج', address: 'بجوار رعاية الطفل', phone: '01210487708', fax: '088-2131662', lat: 27.0510815445, lng: 31.3198190263 },
    { id: 12, name: 'فرع صدفا', address: 'شارع الصيانة', phone: '01210487698', fax: '088-2131662', lat: 26.9495989244, lng: 31.3654710481 },
    { id: 13, name: 'فرع مركز أسيوط', address: 'شارع الجمهورية خلف فندق الوطنية', phone: '088/2131662 - 2131654 - 2131655', fax: '088-2131662', lat: 26.9495989244, lng: 31.3654710481 }
];

const cleanText = (value: unknown) =>
    String(value ?? '')
        .replace(/\u00a0/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

const normalizePhoneForTel = (value: string) =>
    value.replace(/[^\d+]/g, '');

const parseNumeric = (value: unknown) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
};

const parseLiteralValue = (rawValue: string) => {
    const value = rawValue.trim();
    if (value.startsWith('"') && value.endsWith('"')) {
        try {
            return JSON.parse(value);
        } catch {
            return value.slice(1, -1);
        }
    }

    if (value.startsWith("'") && value.endsWith("'")) {
        const normalized = `"${value
            .slice(1, -1)
            .replace(/\\/g, '\\\\')
            .replace(/"/g, '\\"')}"`;
        try {
            return JSON.parse(normalized);
        } catch {
            return value.slice(1, -1);
        }
    }

    const asNumber = Number(value);
    return Number.isFinite(asNumber) ? asNumber : value;
};

const extractArrayLiteral = (source: string, key: string) => {
    const keyMatcher = new RegExp(`${key}\\s*:\\s*\\[`);
    const keyMatch = keyMatcher.exec(source);
    if (!keyMatch) return null;

    const start = source.indexOf('[', keyMatch.index);
    if (start < 0) return null;

    let depth = 0;
    let inString = false;
    let quoteChar = '';
    let escaped = false;

    for (let i = start; i < source.length; i += 1) {
        const char = source[i];

        if (inString) {
            if (escaped) {
                escaped = false;
                continue;
            }
            if (char === '\\') {
                escaped = true;
                continue;
            }
            if (char === quoteChar) {
                inString = false;
            }
            continue;
        }

        if (char === '"' || char === "'") {
            inString = true;
            quoteChar = char;
            continue;
        }

        if (char === '[') {
            depth += 1;
            continue;
        }

        if (char === ']') {
            depth -= 1;
            if (depth === 0) {
                return source.slice(start, i + 1);
            }
        }
    }

    return null;
};

const parseBranchObjects = (arrayLiteral: string | null): BranchOffice[] => {
    if (!arrayLiteral) return [];
    const objectLiterals = arrayLiteral.match(/\{[^{}]*\}/g) || [];
    const parsed = objectLiterals
        .map((objectLiteral, index) => {
            const record: Record<string, unknown> = {};
            const pairRegex = /([A-Za-z_]\w*)\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[-+]?\d*\.?\d+)/g;
            let pair: RegExpExecArray | null;

            while ((pair = pairRegex.exec(objectLiteral)) !== null) {
                const [, key, rawValue] = pair;
                record[key] = parseLiteralValue(rawValue);
            }

            const name = cleanText(record.name);
            const address = cleanText(record.address);
            if (!name || !address) return null;

            return {
                id: Number(record.Id ?? record.id ?? index + 1),
                name,
                address,
                phone: cleanText(record.phone),
                fax: cleanText(record.fax),
                lat: parseNumeric(record.lat),
                lng: parseNumeric(record.lng)
            } satisfies BranchOffice;
        })
        .filter((item): item is BranchOffice => item !== null);

    const deduped = new Map<string, BranchOffice>();
    parsed.forEach((branch) => {
        const key = `${branch.name}|${branch.address}`.toLowerCase();
        if (!deduped.has(key)) {
            deduped.set(key, branch);
            return;
        }

        const existing = deduped.get(key)!;
        const nextPhone = branch.phone.length > existing.phone.length ? branch.phone : existing.phone;
        const nextFax = branch.fax.length > existing.fax.length ? branch.fax : existing.fax;
        deduped.set(key, { ...existing, phone: nextPhone, fax: nextFax });
    });

    return Array.from(deduped.values());
};

const syncKnownBranches = (known: BranchOffice[], incoming: BranchOffice[]) => {
    const incomingByName = new Map<string, BranchOffice>();
    incoming.forEach((branch) => {
        incomingByName.set(cleanText(branch.name).toLowerCase(), branch);
    });

    return known.map((branch) => {
        const fresh = incomingByName.get(cleanText(branch.name).toLowerCase());
        if (!fresh) return branch;
        return {
            ...branch,
            address: fresh.address || branch.address,
            phone: fresh.phone || branch.phone,
            fax: fresh.fax || branch.fax,
            lat: fresh.lat ?? branch.lat,
            lng: fresh.lng ?? branch.lng
        };
    });
};

const extractAppBundleUrl = (html: string) => {
    const scriptMatch = html.match(/<script[^>]+src=(["'])(\/js\/app\.[^"']+\.js)\1/i);
    if (scriptMatch?.[2]) {
        return new URL(scriptMatch[2], LEGACY_BASE_URL).toString();
    }
    return `${LEGACY_BASE_URL}/js/app.0cb34e9e.js`;
};

const fetchLegacyBranches = async (signal: AbortSignal) => {
    const pageResponse = await fetch(LEGACY_BRANCHES_PAGE_URL, { signal });
    if (!pageResponse.ok) {
        throw new Error(`Failed to load legacy page: ${pageResponse.status}`);
    }

    const pageHtml = await pageResponse.text();
    const bundleUrl = extractAppBundleUrl(pageHtml);
    const bundleResponse = await fetch(bundleUrl, { signal });
    if (!bundleResponse.ok) {
        throw new Error(`Failed to load legacy bundle: ${bundleResponse.status}`);
    }

    const bundleScript = await bundleResponse.text();
    const branchServicesLiteral = extractArrayLiteral(bundleScript, 'branchServices');
    const locationsLiteral = extractArrayLiteral(bundleScript, 'locations');
    const branchServices = parseBranchObjects(branchServicesLiteral);
    const locations = parseBranchObjects(locationsLiteral);

    const source = branchServices.length > 0 ? branchServices : locations;
    if (source.length === 0) {
        throw new Error('No branch data found in legacy source');
    }

    return source;
};

function BranchesPage() {
    const [branches, setBranches] = useState<BranchOffice[]>(ALL_BRANCHES);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const run = async () => {
            try {
                const data = await fetchLegacyBranches(controller.signal);
                if (!active) return;
                setBranches((previous) => syncKnownBranches(previous, data));
            } catch {
                if (!active) return;
                setBranches(ALL_BRANCHES);
            }
        };

        run();
        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    const filteredBranches = useMemo(() => {
        const normalizedQuery = cleanText(query).toLowerCase();
        if (!normalizedQuery) return branches;
        return branches.filter((branch) => {
            const haystack = `${branch.name} ${branch.address} ${branch.phone} ${branch.fax}`.toLowerCase();
            return haystack.includes(normalizedQuery);
        });
    }, [branches, query]);

    return (
        <>
            <Header />
            <main className="bg-[radial-gradient(circle_at_top,_rgba(17,112,176,0.08),_transparent_46%)] py-8" dir="rtl">
                <div className="mx-auto w-full max-w-7xl px-4">
                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_rgba(2,6,23,0.08)]">
                        <div className="bg-gradient-to-l from-[#0a3555] to-[#1170b0] px-6 py-7 text-white sm:px-8">
                            <div className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-bold tracking-wide">
                                بيانات الفروع
                            </div>
                            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">فروع الشركة</h1>
                            <p className="mt-2 text-sm text-white/90 sm:text-base">
                                تم جلب البيانات من صفحة الفروع الرسمية وترتيبها بصيغة أوضح وأسهل في البحث.
                            </p>
                        </div>

                        <div className="px-6 py-6 sm:px-8">
                            <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                                <label className="relative block">
                                    <span className="sr-only">ابحث عن فرع</span>
                                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#0a3555]/70">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <path d="m21 21-4.35-4.35"></path>
                                        </svg>
                                    </span>
                                    <input
                                        type="search"
                                        value={query}
                                        onChange={(event) => setQuery(event.target.value)}
                                        placeholder="ابحث باسم الفرع أو العنوان أو رقم الهاتف..."
                                        className="h-10 w-full rounded-full border border-[#d7b05a]/55 bg-white pr-9 pl-4 text-sm text-slate-700 outline-none transition focus:border-[#0a3555] focus:ring-2 focus:ring-[#0a3555]/15"
                                    />
                                </label>
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                                    عدد الفروع: <span className="text-[#0a3555]">{filteredBranches.length}</span>
                                </div>
                            </div>

                            {filteredBranches.length === 0 ? (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-slate-600">
                                    لا توجد نتائج مطابقة لعبارة البحث.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {filteredBranches.map((branch) => {
                                        const hasMap = branch.lat !== null && branch.lng !== null;
                                        const mapLink = hasMap
                                            ? `https://www.google.com/maps?q=${branch.lat},${branch.lng}`
                                            : '';
                                        const tel = normalizePhoneForTel(branch.phone);

                                        return (
                                            <article
                                                key={`${branch.id}-${branch.name}-${branch.address}`}
                                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                            >
                                                <h2 className="text-lg font-extrabold text-[#0a3555]">{branch.name}</h2>
                                                <p className="mt-2 min-h-14 text-sm leading-7 text-slate-700">{branch.address}</p>

                                                <div className="mt-3 space-y-2 text-sm">
                                                    <p className="text-slate-700">
                                                        <span className="font-bold text-slate-900">الهاتف:</span>{' '}
                                                        {tel ? (
                                                            <a className="text-[#0a3555] underline-offset-2 hover:underline" href={`tel:${tel}`}>
                                                                {branch.phone}
                                                            </a>
                                                        ) : (
                                                            <span>{branch.phone || '-'}</span>
                                                        )}
                                                    </p>
                                                    <p className="text-slate-700">
                                                        <span className="font-bold text-slate-900">الفاكس:</span> {branch.fax || '-'}
                                                    </p>
                                                </div>

                                                <div className="mt-4 flex items-center gap-2">
                                                    {hasMap ? (
                                                        <a
                                                            href={mapLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center rounded-lg bg-[#0a3555] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#082b47]"
                                                        >
                                                            عرض على الخريطة
                                                        </a>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500">
                                                            الموقع غير متاح
                                                        </span>
                                                    )}
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default BranchesPage;
