export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://lycemart.github.io/drawdesk"
).replace(/\/$/, "");

export function withBase(path: string): string {
  if (!basePath) return path;
  return `${basePath}${path}`;
}

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
