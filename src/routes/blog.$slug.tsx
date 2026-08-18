import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icon";
import { getPost } from "@/lib/content.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await getPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article unavailable" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} — Bernie Amponsah`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.excerpt },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.excerpt },
        { property: "og:type", content: "article" },
        ...(loaderData.image_url
          ? [
              { property: "og:image", content: loaderData.image_url },
              { name: "twitter:image", content: loaderData.image_url },
            ]
          : []),
      ],
    };
  },
  component: PostDetail,
  notFoundComponent: () => <Missing />,
  errorComponent: () => <Missing />,
});

function Missing() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteNav />
      <main className="flex-grow pt-40 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <h1 className="font-display text-headline-lg-mobile md:text-display mb-6">
          Article not found
        </h1>
        <Link to="/blog" className="text-primary font-bold">
          Back to the journal
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function PostDetail() {
  const post = Route.useLoaderData();
  if (!post) return <Missing />;

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-grow pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop w-full max-w-3xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-10"
        >
          <Icon name="arrow_back" /> All articles
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-primary text-label-caps uppercase tracking-widest">
            {post.category}
          </span>
          <span className="text-on-surface-variant text-sm flex items-center gap-1">
            <Icon name="schedule" className="text-[16px]" /> {post.read_time}
          </span>
        </div>

        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg mb-6 text-on-surface">
          {post.title}
        </h1>
        <p className="text-body-lg text-on-surface-variant mb-10">{post.excerpt}</p>

        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.alt_text || post.title}
            className="w-full rounded-xl border border-outline-variant/30 mb-12 object-cover max-h-[480px]"
          />
        )}

        <article className="space-y-6">
          {post.content
            .split("\n")
            .filter((line) => line.trim().length > 0)
            .map((line, i) => (
              <p key={i} className="text-body-lg text-on-surface-variant leading-relaxed">
                {line}
              </p>
            ))}
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
