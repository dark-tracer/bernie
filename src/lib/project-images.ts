export function projectImages(cover: string | null | undefined, gallery: unknown): string[] {
  const additional = Array.isArray(gallery) ? gallery.filter((url): url is string => typeof url === "string" && url.trim().length > 0) : [];
  return Array.from(new Set([cover ?? "", ...additional].map((url) => url.trim()).filter(Boolean)));
}