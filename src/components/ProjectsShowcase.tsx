import { useEffect, useMemo, useState } from 'react';
import type { ProjectItem } from '../types';
import {
    PROJECTS_ENDPOINT,
    PROJECT_IMAGE_ENDPOINT,
    PROJECTS_ARCHIVE_PATH,
    extractPlainTextFromHtml,
    getProjectImagePath,
    truncateText,
} from '../utils/helpers';

function ProjectsShowcase() {
    const [projects, setProjects] = useState<ProjectItem[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState<string | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        const loadProjects = async () => {
            try {
                const response = await fetch(PROJECTS_ENDPOINT, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`Projects request failed with status ${response.status}`);
                }

                const payload = (await response.json()) as unknown;
                const payloadObject = (payload && typeof payload === 'object' ? payload : {}) as {
                    data?: unknown;
                    value?: unknown;
                    items?: unknown;
                };

                const rawProjectItems = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payloadObject.value)
                        ? payloadObject.value
                        : Array.isArray(payloadObject.data)
                            ? payloadObject.data
                            : Array.isArray(payloadObject.items)
                                ? payloadObject.items
                                : [];

                const validProjects = rawProjectItems
                    .filter((item): item is ProjectItem => typeof item === 'object' && item !== null)
                    .filter((item) => Number(item.active ?? 1) !== 0);

                if (!active) return;
                setProjects(validProjects);
                setActiveIndex(0);
            } catch {
                if (!active) return;
                setProjectsError('تعذر تحميل المشاريع حاليًا.');
            } finally {
                if (active) setProjectsLoading(false);
            }
        };

        loadProjects();

        return () => {
            active = false;
            controller.abort();
        };
    }, []);

    const currentProject = useMemo(() => {
        if (projects.length === 0) return null;
        const safeIndex = Math.min(activeIndex, projects.length - 1);
        return projects[safeIndex];
    }, [projects, activeIndex]);

    if (projectsLoading) {
        return (
            <section id="home-projects" className="bg-white py-12 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
                        جاري تحميل المشاريع...
                    </div>
                </div>
            </section>
        );
    }

    if (projectsError) {
        return (
            <section id="home-projects" className="bg-white py-12 sm:py-14">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center font-semibold text-amber-800">
                        {projectsError}
                    </div>
                </div>
            </section>
        );
    }

    if (!currentProject) return null;

    const projectImagePath = getProjectImagePath(currentProject);
    const projectImageUrl = projectImagePath ? `${PROJECT_IMAGE_ENDPOINT}/${encodeURIComponent(projectImagePath)}` : '';
    const projectDescription = truncateText(extractPlainTextFromHtml(currentProject.description), 680);

    const goToNext = () => {
        setActiveIndex((prev) => (prev + 1) % projects.length);
    };

    const goToPrev = () => {
        setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    return (
        <section id="home-projects" className="bg-white py-12 sm:py-14">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl lg:text-4xl">مشـروعاتنا</h2>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-lg">
                    <div className="grid lg:grid-cols-2">
                        <div className="order-2 p-5 sm:p-8 lg:order-1 lg:p-10">
                            <h3 className="break-words text-2xl font-extrabold text-slate-900 sm:text-3xl">{currentProject.title || 'مشروع'}</h3>
                            <div className="mt-3 h-[3px] w-36 bg-[#d7b05a]"></div>
                            <p className="mt-5 text-base leading-8 text-slate-700 sm:mt-6 sm:text-lg sm:leading-9">
                                {projectDescription || 'لا يوجد وصف متاح لهذا المشروع.'}
                            </p>
                            <div className="mt-6 sm:mt-8">
                                <a
                                    href={PROJECTS_ARCHIVE_PATH}
                                    className="inline-flex items-center gap-2 text-lg font-bold text-[#c79d41] transition hover:text-[#0a3555] sm:text-xl"
                                >
                                    <span>اقرأ المزيد</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
                                </a>
                            </div>
                        </div>

                        <div className="order-1 lg:order-2">
                            <div className="relative h-full min-h-[240px] overflow-hidden bg-slate-200 sm:min-h-[360px] lg:min-h-[520px]">
                                {projectImageUrl ? (
                                    <img
                                        src={projectImageUrl}
                                        alt={currentProject.title || 'صورة مشروع'}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                        onError={(event) => {
                                            event.currentTarget.style.display = 'none';
                                        }}
                                    />
                                ) : null}

                                {projects.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            aria-label="المشروع السابق"
                                            onClick={goToPrev}
                                            className="absolute left-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-md transition hover:bg-black/75 sm:left-3 sm:h-11 sm:w-11"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="المشروع التالي"
                                            onClick={goToNext}
                                            className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/55 text-white shadow-md transition hover:bg-black/75 sm:right-3 sm:h-11 sm:w-11"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                                            </svg>
                                        </button>

                                        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/35 px-3 py-1">
                                            {projects.map((project, index) => (
                                                <button
                                                    key={project.id ?? `project-dot-${index}`}
                                                    type="button"
                                                    aria-label={`عرض مشروع ${index + 1}`}
                                                    onClick={() => setActiveIndex(index)}
                                                    className={`h-2.5 w-2.5 rounded-full transition ${index === activeIndex ? 'bg-white' : 'bg-white/45 hover:bg-white/70'}`}
                                                ></button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProjectsShowcase;

