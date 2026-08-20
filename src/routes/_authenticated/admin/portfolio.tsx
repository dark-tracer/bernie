import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { AdminCrud, type Row } from "@/components/AdminCrud";

export const Route = createFileRoute("/_authenticated/admin/portfolio")({
  validateSearch: (search: Record<string, unknown>) => ({
    new: search["new"] === "1" ? ("1" as const) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Portfolio Manager — Bernie Amponsah" },
      { name: "description", content: "Create, edit and publish portfolio projects." },
      { property: "og:title", content: "Portfolio Manager — Bernie Amponsah" },
      { property: "og:description", content: "Create, edit and publish portfolio projects." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortfolioManager,
});

function PortfolioManager() {
  const search = Route.useSearch();

  return (
    <AdminShell>
      <AdminCrud
        table="projects"
        title="Portfolio"
        subtitle="Published projects appear immediately on the public portfolio page."
        createOpen={search.new === "1"}
        orderBy={{ column: "sort_order", ascending: true }}
        defaults={{
          title: "",
          slug: "",
          category: "UI/UX",
          client: "",
          image_url: "",
          alt_text: "",
          summary: "",
          content: "",
          status: "published",
          sort_order: 0,
        }}
        fields={[
          { name: "title", label: "Title" },
          { name: "slug", label: "Slug (auto if blank)", slugFrom: "title" },
          {
            name: "category",
            label: "Category",
            type: "select",
            options: ["Branding", "UI/UX", "Print", "Social", "Digital"],
          },
          { name: "client", label: "Client" },
          { name: "image_url", label: "Image", type: "image" as const },
          { name: "alt_text", label: "Image alt text" },
          { name: "summary", label: "Summary", type: "textarea" },
          { name: "content", label: "Case study (one paragraph per line)", type: "textarea" },
          { name: "status", label: "Status", type: "select", options: ["published", "draft"] },
          { name: "sort_order", label: "Sort order", type: "number" },
        ]}
        columns={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "client", label: "Client" },
          {
            key: "status",
            label: "Status",
            render: (row: Row) => (
              <span
                className={
                  row["status"] === "published"
                    ? "text-primary text-label-caps uppercase"
                    : "text-on-surface-variant text-label-caps uppercase"
                }
              >
                {String(row["status"])}
              </span>
            ),
          },
        ]}
      />
    </AdminShell>
  );
}
