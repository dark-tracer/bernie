import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { ProjectSlideshow } from "@/components/ProjectSlideshow";
import { projectImages } from "@/lib/project-images";
import { listProjects } from "@/lib/content.functions";

export const Route = createFileRoute("/portfolio/")({
  loader: () => listProjects(),
  head: ({ loaderData }) => {
    const cover = loaderData?.[0]?.image_url;
    return {
      meta: [
        { title: "Selected Works — Bernie Amponsah Portfolio" },
        {
          name: "description",
          content:
            "A curated collection of branding, digital product design and creative direction projects by Bernie Amponsah.",
        },
        { property: "og:title", content: "Selected Works — Bernie Amponsah Portfolio" },
        {
          property: "og:description",
          content: "Branding, digital product design and creative direction case studies.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(cover?.startsWith("https://")
          ? [
              { property: "og:image", content: cover },
              { name: "twitter:image", content: cover },
            ]
          : []),
      ],
    };
  },
  component: Portfolio,
  errorComponent: () => <p className="p-12 text-on-surface">Projects could not be loaded.</p>,
});

function Portfolio() {
  const projects = Route.useLoaderData();
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-grow pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <header className="mb-20 text-center md:text-left">
          <h1 className="font-display text-headline-lg-mobile md:text-display mb-6">
            Selected Works
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            A curated collection of projects spanning branding, digital product design, and creative
            direction. Exploring the intersection of aesthetics and strategic function.
          </p>
        </header>

        <div className="flex flex-wrap gap-4 mb-16 justify-center md:justify-start border-b border-outline-variant/30 pb-4">
          {categories.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? "px-6 py-2 rounded-full bg-surface-container-high text-on-surface font-medium"
                  : "px-6 py-2 rounded-full bg-transparent text-on-surface-variant border border-outline-variant hover:border-primary hover:text-primary transition-colors"
              }
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {visible.map((p, i) => (
            <article
              key={p.id}
              className={`group relative overflow-hidden rounded-xl bg-surface border border-outline-variant/30 aspect-[4/5] flex flex-col ${
                i >= 3 ? "lg:mt-12" : ""
              }`}
            >
              <div className="flex-1 min-h-0 overflow-hidden relative">
                <ProjectSlideshow images={projectImages(p.image_url, p.gallery_images)} title={p.title} compact />
              </div>
              <div className="p-6 bg-surface-container-low border-t border-outline-variant/30 z-10 relative">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <h2 className="font-headline text-[24px] font-bold text-on-surface leading-tight">
                    <Link to="/portfolio/$slug" params={{ slug: p.slug }}>{p.title}</Link>
                  </h2>
                  <span className="text-label-caps bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded whitespace-nowrap">
                    {p.category}
                  </span>
                </div>
                <div className="flex flex-wrap justify-between gap-2 text-sm">
                  <p className="text-on-surface-variant">Client: {p.client}</p>
                  <Link to="/portfolio/$slug" params={{ slug: p.slug }} className="text-primary hover:underline">View project →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
