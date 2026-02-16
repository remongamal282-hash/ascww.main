export type AdminInfoResponse = {
    boss_title?: string;
    boss_name?: string;
    boss_speech?: string;
    boss_image?: string;
    has_boss_image?: boolean;
};

export type NewsImage = {
    id?: number;
    path?: string;
    main_image?: number;
};

export type NewsItem = {
    id?: number;
    title?: string;
    slug?: string;
    active?: number;
    description?: string;
    created_at?: string;
    updated_at?: string;
    news_images?: NewsImage[];
};

export type ProjectImage = {
    id?: number;
    path?: string;
    main_image?: number;
};

export type ProjectItem = {
    id?: number;
    title?: string;
    slug?: string;
    active?: number;
    description?: string;
    created_at?: string;
    updated_at?: string;
    project_images?: ProjectImage[];
};
