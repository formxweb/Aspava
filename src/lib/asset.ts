// GitHub Pages gibi alt dizinde yayınlanan derlemelerde dosya yollarının önüne eklenir.
// Örn. NEXT_PUBLIC_BASE_PATH=/Aspava → "/media/x.webp" yerine "/Aspava/media/x.webp"
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${basePath}${path}`;

// Önizleme derlemeleri arama motorlarına kapalıdır
export const isPreviewBuild = basePath !== "";
