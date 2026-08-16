import { createFileRoute } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Icon } from "@/components/Icon";
import { submissions } from "@/data/site";

export const Route = createFileRoute("/admin/")({
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

const stats = [
  { icon: "folder_open", tint: "text-primary", label: "Total Projects", value: "48", delta: "+12%" },
  {
    icon: "inbox",
    tint: "text-tertiary-fixed-dim",
    label: "New Submissions",
    value: "12",
    delta: "+5%",
  },
  { icon: "visibility", tint: "text-primary-fixed", label: "Blog Views", value: "8,402", delta: "+24%" },
];

function AdminOverview() {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <AdminSidebar active="Testimonials" />

      <main className="md:ml-64 flex-1 min-h-screen overflow-y-auto bg-background px-margin-mobile md:px-margin-desktop py-12">
        <div className="max-w-container-max mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
                Overview
              </h1>
              <div className="flex items-center gap-2 text-body-md text-on-surface-variant">
                <span>Dashboard</span>
                <Icon name="chevron_right" className="text-[16px]" />
                <span className="text-primary">Overview</span>
              </div>
            </div>
            <button
              type="button"
              className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg text-body-md font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Icon name="add" />
              New Project
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-surface-container border border-outline-variant rounded-xl p-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center ${s.tint}`}
                  >
                    <Icon name={s.icon} />
                  </div>
                  <span className="text-label-caps text-on-surface-variant bg-surface-container-highest px-3 py-1 rounded-full">
                    {s.delta}
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant mb-1">{s.label}</p>
                <h2 className="font-headline text-headline-md text-on-surface">{s.value}</h2>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-surface-container border border-outline-variant rounded-xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center">
                <h2 className="font-headline text-[20px] font-bold text-on-surface">
                  Recent Submissions
                </h2>
                <button type="button" className="text-primary text-body-md hover:underline">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="px-6 py-4 text-label-caps text-on-surface-variant uppercase">
                        Name
                      </th>
                      <th className="px-6 py-4 text-label-caps text-on-surface-variant uppercase">
                        Subject
                      </th>
                      <th className="px-6 py-4 text-label-caps text-on-surface-variant uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-body-md">
                    {submissions.map((s) => (
                      <tr
                        key={s.name}
                        className="border-b border-outline-variant last:border-0 hover:bg-surface-container-high transition-colors"
                      >
                        <td className="px-6 py-4 text-on-surface font-medium whitespace-nowrap">
                          {s.name}
                        </td>
                        <td className="px-6 py-4 text-on-surface-variant">{s.subject}</td>
                        <td className="px-6 py-4 text-on-surface-variant whitespace-nowrap">
                          {s.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-1 bg-surface-container border border-outline-variant rounded-xl p-6 flex flex-col">
              <h2 className="font-headline text-[20px] font-bold text-on-surface mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4 flex-1">
                {[
                  { icon: "upload_file", title: "Upload CV", sub: "Update your resume" },
                  { icon: "post_add", title: "New Blog Post", sub: "Draft an article" },
                ].map((a) => (
                  <button
                    key={a.title}
                    type="button"
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
                    <Icon
                      name="arrow_forward"
                      className="text-outline group-hover:text-primary transition-colors"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
