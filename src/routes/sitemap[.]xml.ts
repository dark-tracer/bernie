import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { publicDb } from "@/lib/public-db.server";

const BASE_URL = "https://bernie.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/portfolio", changefreq: "weekly", priority: "0.9" },
          { path: "/services", changefreq: "monthly", priority: "0.8" },
          { path: "/blog", changefreq: "weekly", priority: "0.8" },
          { path: "/contact", changefreq: "monthly", priority: "0.7" },
        ];

        try {
          const db = publicDb();
          const [projects, posts] = await Promise.all([
            db.from("projects").select("slug").eq("status", "published"),
            db.from("posts").select("slug").eq("status", "published"),
          ]);
          for (const p of projects.data ?? []) {
            if (p.slug) entries.push({ path: `/portfolio/${p.slug}`, priority: "0.7" });
          }
          for (const p of posts.data ?? []) {
            if (p.slug) entries.push({ path: `/blog/${p.slug}`, priority: "0.6" });
          }
        } catch {
          // fall back to static routes only
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
