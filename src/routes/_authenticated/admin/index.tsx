import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/Icon";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Admin Overview — Bernie Amponsah" },
      {
        name: "description",
        content: "Dashboard overview of projects, submissions and blog performance.",
      },
      { property: "og:title", content: "Admin Overview — Bernie Amponsah" },
      {
        property: "og:description",
        content: "Dashboard overview of projects, submissions and blog performance.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminOverview,
});

function AdminOverview() {
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const [projects, posts, unread, submissions] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("posts").select("id", { count: "exact", head: true }),
        supabase.from("submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
        supabase
          .from("submissions")
          .select("id, name, subject, created_at")
          .order("created_at", { ascending: false })
          .limit(6),
      ]);
      return {
        projects: projects.count ?? 0,
        posts: posts.count ?? 0,
        unread: unread.count ?? 0,
        recent: submissions.data ?? [],
      };
    },
  });

  const stats = [
    { icon: "folder_open", tint: "text-primary", label: "Projects", value: data?.projects ?? 0 },
    { icon: "inbox", tint: "text-tertiary-fixed-dim", label: "Unread Messages", value: data?.unread ?? 0 },
    { icon: "edit_note", tint: "text-primary-fixed", label: "Blog Posts", value: data?.posts ?? 0 },
  ];

  return (
    <AdminShell>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
            Overview
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Everything you publish here appears on the live website instantly.
          </p>
        </div>
        <Link
          to="/admin/portfolio"
          search={{ new: "1" }}
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg text-body-md font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Icon name="add" />
          New Project
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-surface-container border border-outline-variant rounded-xl p-6"
          >
            <div
              className={`w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 ${s.tint}`}
            >
              <Icon name={s.icon} />
            </div>
            <p className="text-body-md text-on-surface-variant mb-1">{s.label}</p>
            <h2 className="font-headline text-headline-md text-on-surface">{s.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h2 className="font-headline text-[20px] font-bold text-on-surface">
              Recent Submissions
            </h2>
            <Link to="/admin/submissions" className="text-primary text-body-md hover:underline">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th className="px-6 py-4 text-label-caps text-on-surface-variant uppercase">Name</th>
                  <th className="px-6 py-4 text-label-caps text-on-surface-variant uppercase">Subject</th>
                  <th className="px-6 py-4 text-label-caps text-on-surface-variant uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="text-body-md">
                {(data?.recent ?? []).map((s) => (
                  <tr key={s.id} className="border-b border-outline-variant last:border-0">
                    <td className="px-6 py-4 text-on-surface font-medium whitespace-nowrap">{s.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{s.subject}</td>
                    <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">
                      {new Date(s.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {data && data.recent.length === 0 && (
                  <tr>
                    <td className="px-6 py-6 text-on-surface-variant" colSpan={3}>
                      No messages yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-1 bg-surface-container border border-outline-variant rounded-xl p-6">
          <h2 className="font-headline text-[20px] font-bold text-on-surface mb-6">Quick Actions</h2>
          <div className="space-y-4">
            {[
              { icon: "post_add", title: "New Blog Post", sub: "Draft an article", to: "/admin/blog" as const },
              { icon: "chat_bubble", title: "Add Testimonial", sub: "Client quote", to: "/admin/testimonials" as const },
              { icon: "settings", title: "Site Settings", sub: "Contact details & bio", to: "/admin/settings" as const },
            ].map((a) => (
              <Link
                key={a.title}
                to={a.to}
                className="w-full flex items-center justify-between p-4 bg-surface border border-outline-variant rounded-lg hover:border-primary transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                    <Icon name={a.icon} />
                  </div>
                  <div className="text-left">
                    <p className="text-body-md font-medium text-on-surface">{a.title}</p>
                    <p className="text-[10px] text-on-surface-variant">{a.sub}</p>
                  </div>
                </div>
                <Icon name="arrow_forward" className="text-outline group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
