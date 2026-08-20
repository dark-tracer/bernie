import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { AdminCrud } from "@/components/AdminCrud";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  head: () => ({
    meta: [
      { title: "Blog Manager — Bernie Amponsah" },
      { name: "description", content: "Write, edit and publish journal articles." },
      { property: "og:title", content: "Blog Manager — Bernie Amponsah" },
      { property: "og:description", content: "Write, edit and publish journal articles." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BlogManager,
});

function BlogManager() {
  return (
    <AdminShell>
      <AdminCrud
        table="posts"
        title="Blog"
        subtitle="Published articles are readable on the public blog immediately."
        orderBy={{ column: "published_on", ascending: false }}
        defaults={{
          title: "",
          slug: "",
          category: "Design",
          excerpt: "",
          content: "",
          image_url: "",
          alt_text: "",
          read_time: "5 min read",
          published_on: new Date().toISOString().slice(0, 10),
          featured: false,
          status: "published",
        }}
        fields={[
          { name: "title", label: "Title" },
          { name: "slug", label: "Slug (auto if blank)", slugFrom: "title" },
          { name: "category", label: "Category" },
          { name: "excerpt", label: "Excerpt", type: "textarea" },
          { name: "content", label: "Article (one paragraph per line)", type: "textarea" },
          { name: "image_url", label: "Cover image", type: "image" as const },
          { name: "alt_text", label: "Image alt text" },
          { name: "read_time", label: "Read time" },
          { name: "published_on", label: "Publish date", type: "date" },
          { name: "featured", label: "Featured", type: "checkbox" },
          { name: "status", label: "Status", type: "select", options: ["published", "draft"] },
        ]}
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "published_on", label: "Date" },
          { key: "status", label: "Status" },
        ]}
      />
    </AdminShell>
  );
}
