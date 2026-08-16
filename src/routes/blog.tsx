import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icon";
import { testimonials, featuredArticle, secondArticle } from "@/data/site";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Insights & Client Perspectives — Bernie Amponsah" },
      {
        name: "description",
        content:
          "Explorations in UI architecture, the psychology of dark mode, and client reflections on collaborative design strategy.",
      },
      { property: "og:title", content: "Insights & Client Perspectives — Bernie Amponsah" },
      {
        property: "og:description",
        content: "Articles on UI architecture and dark-mode design, plus client testimonials.",
      },
      { property: "og:image", content: featuredArticle.image },
      { name: "twitter:image", content: featuredArticle.image },
    ],
  }),
  component: Blog,
});

function Blog() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteNav />

      <main className="pt-32 pb-section-gap flex-grow">
        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-section-gap">
          <div className="mb-16">
            <h1 className="font-display text-headline-lg-mobile md:text-display text-on-surface mb-4">
              Client Perspectives
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Reflections on collaborative strategy, technical precision, and the impact of
              high-contrast modernism in digital product design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-surface border border-outline-variant rounded-xl p-8 hover:shadow-[0_20px_40px_rgba(26,86,219,0.1)] transition-shadow duration-300 flex flex-col justify-between group"
              >
                <div>
                  <Icon
                    name="format_quote"
                    className="text-primary mb-6 text-4xl opacity-50 group-hover:opacity-100 transition-opacity"
                  />
                  <p className="text-body-lg text-on-surface mb-8 italic">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-4 pt-6 border-t border-outline-variant/50">
                  <img
                    src={t.image}
                    alt={`Portrait of ${t.name}`}
                    loading="lazy"
                    className="w-12 h-12 rounded-full object-cover border border-outline-variant"
                  />
                  <div>
                    <h3 className="font-headline text-body-md font-bold text-on-surface">
                      {t.name}
                    </h3>
                    <p className="text-label-caps text-on-surface-variant uppercase tracking-widest mt-1">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h2 className="font-display text-headline-lg-mobile md:text-display text-on-surface mb-4">
                Insights &amp; Strategy
              </h2>
              <p className="text-body-lg text-on-surface-variant max-w-2xl">
                Explorations in UI architecture, the psychology of dark mode, and the evolving
                landscape of digital interaction design.
              </p>
            </div>
            <button
              type="button"
              className="text-primary font-bold flex items-center gap-2 hover:text-primary-container transition-colors group"
            >
              View All Articles
              <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter md:auto-rows-[300px]">
            <article className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group min-h-[420px]">
              <div className="absolute inset-0 z-0">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
              </div>
              <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-surface-container-high text-on-surface-variant text-label-caps px-3 py-1 rounded uppercase tracking-widest border border-outline-variant/30">
                    {featuredArticle.category}
                  </span>
                  <span className="text-on-surface-variant text-sm flex items-center gap-1">
                    <Icon name="schedule" className="text-[16px]" /> {featuredArticle.readTime}
                  </span>
                </div>
                <h3 className="font-headline text-headline-md text-on-surface font-bold mb-3 group-hover:text-primary transition-colors">
                  {featuredArticle.title}
                </h3>
                <p className="text-on-surface-variant line-clamp-2 mb-6">
                  {featuredArticle.excerpt}
                </p>
                <p className="text-on-surface-variant text-sm">{featuredArticle.date}</p>
              </div>
            </article>

            <article className="md:col-span-2 md:row-span-1 bg-surface border border-outline-variant rounded-xl overflow-hidden group flex flex-col md:flex-row hover:shadow-[0_20px_40px_rgba(26,86,219,0.1)] transition-shadow duration-300">
              <div className="md:w-2/5 h-48 md:h-full relative overflow-hidden">
                <img
                  src={secondArticle.image}
                  alt={secondArticle.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 md:w-3/5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-primary text-label-caps uppercase tracking-widest">
                    {secondArticle.category}
                  </span>
                  <span className="text-on-surface-variant text-sm flex items-center gap-1">
                    <Icon name="schedule" className="text-[16px]" /> {secondArticle.readTime}
                  </span>
                </div>
                <h3 className="font-headline text-body-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {secondArticle.title}
                </h3>
                <p className="text-on-surface-variant text-sm">{secondArticle.date}</p>
              </div>
            </article>

            <article className="md:col-span-1 md:row-span-1 bg-surface border border-outline-variant rounded-xl p-6 group hover:shadow-[0_20px_40px_rgba(26,86,219,0.1)] transition-shadow duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-primary text-label-caps uppercase tracking-widest">
                    UX Psychology
                  </span>
                </div>
                <h3 className="font-headline text-body-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                  Designing for Dark Space
                </h3>
                <p className="text-on-surface-variant text-sm line-clamp-3">
                  How aggressive whitespace in dark mode environments reduces cognitive load.
                </p>
              </div>
              <div className="mt-4 flex justify-between items-center text-on-surface-variant text-sm border-t border-outline-variant/30 pt-4">
                <span>Sep 15, 2024</span>
                <span className="flex items-center gap-1">
                  <Icon name="schedule" className="text-[16px]" /> 4 min
                </span>
              </div>
            </article>

            <article className="md:col-span-1 md:row-span-1 bg-surface border border-outline-variant rounded-xl p-6 group hover:shadow-[0_20px_40px_rgba(26,86,219,0.1)] transition-shadow duration-300 flex flex-col justify-between relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, #d4e4fa 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-primary text-label-caps uppercase tracking-widest">
                    Case Study
                  </span>
                </div>
                <h3 className="font-headline text-body-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                  Glassmorphism Done Right
                </h3>
                <p className="text-on-surface-variant text-sm line-clamp-3">
                  Restricting blur effects strictly to global navigation elements for impact.
                </p>
              </div>
              <div className="relative z-10 mt-4 flex justify-between items-center text-on-surface-variant text-sm border-t border-outline-variant/30 pt-4">
                <span>Aug 30, 2024</span>
                <span className="flex items-center gap-1">
                  <Icon name="schedule" className="text-[16px]" /> 6 min
                </span>
              </div>
            </article>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
