import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { AdminCrud } from "@/components/AdminCrud";

export const Route = createFileRoute("/_authenticated/admin/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials Manager — Bernie Amponsah" },
      { name: "description", content: "Manage client testimonials shown on the site." },
      { property: "og:title", content: "Testimonials Manager — Bernie Amponsah" },
      { property: "og:description", content: "Manage client testimonials shown on the site." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TestimonialsManager,
});

function TestimonialsManager() {
  return (
    <AdminShell>
      <AdminCrud
        table="testimonials"
        title="Testimonials"
        subtitle="Client quotes displayed on the public Client Perspectives section."
        orderBy={{ column: "sort_order", ascending: true }}
        defaults={{ name: "", role: "", quote: "", image_url: "", sort_order: 0 }}
        fields={[
          { name: "name", label: "Client name" },
          { name: "role", label: "Role / company" },
          { name: "quote", label: "Quote", type: "textarea" },
          { name: "image_url", label: "Portrait image", type: "image" as const },
          { name: "sort_order", label: "Sort order", type: "number" },
        ]}
        columns={[
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
          { key: "quote", label: "Quote" },
        ]}
      />
    </AdminShell>
  );
}
