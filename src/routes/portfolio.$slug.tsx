import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icon";
import { getProject } from "@/lib/content.functions";

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    const result = await getProject({ data: { slug: params.slug } });
    if (!result.project) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    if (!loaderData?.project) {
      return { meta: [{ title: "Project unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const p = loaderData.project;
    const title = `${p.title} — Bernie Amponsah`;
    return {
      meta: [
        { title },
        { name: "description", content: p.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: p.summary },
        ...(p.image_url
          ? [
              { property: "og:image", content: p.image_url },
              { name: "twitter:image", content: p.image_url },
            ]
          : []),
      ],
    };
  },
  component: ProjectDetail,
  notFoundComponent: () => <Missing />,
  errorComponent: () => <Missing />,
});

function Missing() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-grow pt-40 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <h1 className="font-display text-headline-lg-mobile md:text-display mb-6">
          Project not found
        </h1>
        <Link to="/portfolio" className="text-primary font-bold">
          Back to all work
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProjectDetail() {
  const { project, more } = Route.useLoaderData();
  if (!project) return <Missing />;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-grow pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-10"
        >
          <Icon name="arrow_back" /> All work
        </Link>

        <header className="mb-12 max-w-3xl">
          <span className="text-label-caps uppercase tracking-widest text-primary">
            {project.category}
          </span>
          <h1 className="font-display text-headline-lg-mobile md:text-display mt-4 mb-6">
            {project.title}
          </h1>
          <p className="text-body-lg text-on-surface-variant">{project.summary}</p>
        </header>

        {project.image_url && (
          <img
            src={project.image_url}
            alt={project.alt_text || project.title}
            className="w-full rounded-xl border border-outline-variant/30 mb-16 object-cover max-h-[560px]"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-24">
          <aside className="space-y-8">
            <div>
              <p className="text-label-caps uppercase tracking-widest text-outline mb-1">Client</p>
              <p className="text-body-lg text-on-surface">{project.client || "—"}</p>
            </div>
            <div>
              <p className="text-label-caps uppercase tracking-widest text-outline mb-1">
                Discipline
              </p>
              <p className="text-body-lg text-on-surface">{project.category}</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-bold"
            >
              Start a project
            </Link>
          </aside>

          <article className="lg:col-span-2 space-y-6">
            {project.content
              .split("\n")
              .filter((line) => line.trim().length > 0)
              .map((line, i) => (
                <p key={i} className="text-body-lg text-on-surface-variant leading-relaxed">
                  {line}
                </p>
              ))}
          </article>
        </div>

        {more.length > 0 && (
          <section>
            <h2 className="font-headline text-headline-md mb-8 text-on-surface">More work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {more.map((m) => (
                <Link
                  key={m.slug}
                  to="/portfolio/$slug"
                  params={{ slug: m.slug }}
                  className="group rounded-xl overflow-hidden border border-outline-variant/30 bg-surface"
                >
                  {m.image_url && (
                    <img
                      src={m.image_url}
                      alt={m.alt_text || m.title}
                      loading="lazy"
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-label-caps uppercase tracking-widest text-on-surface-variant mb-1">
                      {m.category}
                    </p>
                    <p className="font-headline text-body-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                      {m.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
