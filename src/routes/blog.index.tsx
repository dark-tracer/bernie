import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icon";
import { listPosts, listTestimonials } from "@/lib/content.functions";

export const Route = createFileRoute("/blog/")({
  loader: async () => ({
    posts: await listPosts(),
    testimonials: await listTestimonials(),
  }),
  head: ({ loaderData }) => {
    const cover = loaderData?.posts.find((p) => p.featured)?.image_url ?? null;
    return {
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
        ...(cover
          ? [
              { property: "og:image", content: cover },
              { name: "twitter:image", content: cover },
            ]
          : []),
      ],
    };
  },
  component: Blog,
  errorComponent: () => <p className="p-12 text-on-surface">Content could not be loaded.</p>,
});

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Blog() {
  const { posts, testimonials } = Route.useLoaderData();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);

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
                key={t.id}
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
                  {t.image_url && (
                    <img
                      src={t.image_url}
                      alt={`Portrait of ${t.name}`}
                      loading="lazy"
                      className="w-12 h-12 rounded-full object-cover border border-outline-variant"
                    />
                  )}
                  <div>
                    <p className="font-headline text-body-md font-bold text-on-surface">
                      {t.name}
                    </p>
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
          <div className="mb-16">
            <h2 className="font-display text-headline-lg-mobile md:text-display text-on-surface mb-4">
              Insights &amp; Strategy
            </h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Explorations in UI architecture, the psychology of dark mode, and the evolving
              landscape of digital interaction design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
            {featured && (
              <Link
                to="/blog/$slug"
                params={{ slug: featured.slug }}
                className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group min-h-[420px] block"
              >
                <div className="absolute inset-0 z-0">
                  {featured.image_url && (
                    <img
                      src={featured.image_url}
                      alt={featured.alt_text || featured.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
                </div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-surface-container-high text-on-surface-variant text-label-caps px-3 py-1 rounded uppercase tracking-widest border border-outline-variant/30">
                      {featured.category}
                    </span>
                    <span className="text-on-surface-variant text-sm flex items-center gap-1">
                      <Icon name="schedule" className="text-[16px]" /> {featured.read_time}
                    </span>
                  </div>
                  <h3 className="font-headline text-headline-md text-on-surface font-bold mb-3 group-hover:text-primary transition-colors">
                    {featured.title}
                  </h3>
                  <p className="text-on-surface-variant line-clamp-2 mb-6">{featured.excerpt}</p>
                  <p className="text-on-surface-variant text-sm flex items-center gap-2">
                    {formatDate(featured.published_on)}
                    <span className="text-primary font-bold flex items-center gap-1">
                      Read more <Icon name="arrow_forward" className="text-[16px]" />
                    </span>
                  </p>
                </div>
              </Link>
            )}

            {rest.map((post) => (
              <Link
                key={post.id}
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="md:col-span-2 bg-surface border border-outline-variant rounded-xl overflow-hidden group flex flex-col hover:shadow-[0_20px_40px_rgba(26,86,219,0.1)] transition-shadow duration-300"
              >
                {post.image_url && (
                  <div className="h-44 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.alt_text || post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-primary text-label-caps uppercase tracking-widest">
                      {post.category}
                    </span>
                    <span className="text-on-surface-variant text-sm flex items-center gap-1">
                      <Icon name="schedule" className="text-[16px]" /> {post.read_time}
                    </span>
                  </div>
                  <h3 className="font-headline text-body-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex justify-between items-center text-on-surface-variant text-sm border-t border-outline-variant/30 pt-4">
                    <span>{formatDate(post.published_on)}</span>
                    <span className="text-primary font-bold flex items-center gap-1">
                      Read more <Icon name="arrow_forward" className="text-[16px]" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
