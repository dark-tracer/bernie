import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icon";
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
        ...(cover
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
            <Link
              key={p.id}
              to="/portfolio/$slug"
              params={{ slug: p.slug }}
              className={`group relative overflow-hidden rounded-xl bg-surface border border-outline-variant/30 aspect-[4/5] flex flex-col ${
                i >= 3 ? "lg:mt-12" : ""
              }`}
            >
              <div className="flex-grow overflow-hidden relative">
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.alt_text || p.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-high" />
                )}
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-primary-container text-on-primary-container px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2">
                    View Project <Icon name="arrow_forward" />
                  </span>
                </div>
              </div>
              <div className="p-6 bg-surface-container-low border-t border-outline-variant/30 z-10 relative">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <h2 className="font-headline text-[24px] font-bold text-on-surface leading-tight">
                    {p.title}
                  </h2>
                  <span className="text-label-caps bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded whitespace-nowrap">
                    {p.category}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm">Client: {p.client}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
