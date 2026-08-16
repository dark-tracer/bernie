import { createFileRoute } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Icon } from "@/components/Icon";
import { adminProjects } from "@/data/site";

export const Route = createFileRoute("/admin/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio Manager — Bernie Amponsah Admin" },
      {
        name: "description",
        content: "Manage, reorder and publish portfolio case studies.",
      },
      { property: "og:title", content: "Portfolio Manager — Bernie Amponsah Admin" },
      { property: "og:description", content: "Manage, reorder and publish case studies." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PortfolioManager,
});

function PortfolioManager() {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <AdminSidebar active="Portfolio" />

      <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b border-outline-variant/30">
          <div>
            <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
              Portfolio Manager
            </h1>
            <p className="text-body-lg text-on-surface-variant mt-2">
              Manage, reorder, and publish your case studies.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              type="button"
              className="text-body-md font-medium px-6 py-2 rounded-lg border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-colors flex items-center space-x-2"
            >
              <Icon name="filter_list" className="text-[20px]" />
              <span>Filter</span>
            </button>
            <button
              type="button"
              className="bg-primary-container text-on-primary-container text-body-md font-medium px-6 py-2 rounded-lg hover:bg-inverse-primary transition-colors flex items-center space-x-2 shadow-[0_10px_20px_rgba(26,86,219,0.2)]"
            >
              <Icon name="add" className="text-[20px]" />
              <span>Add Project</span>
            </button>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="Search projects by title or category..."
              className="input-field w-full pl-12 pr-4 py-3 rounded-lg text-body-md"
            />
          </div>
          <div className="flex gap-2">
            <select className="input-field pl-4 pr-10 py-3 rounded-lg text-body-md appearance-none cursor-pointer">
              <option>All Categories</option>
              <option>UI/UX Design</option>
              <option>Web Development</option>
              <option>Branding</option>
            </select>
            <select className="input-field pl-4 pr-10 py-3 rounded-lg text-body-md appearance-none cursor-pointer">
              <option>Status: All</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminProjects.map((p) => (
            <div
              key={p.title}
              className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden group transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1"
            >
              <div className="relative h-48 w-full border-b border-outline-variant/30">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={`${p.title} cover`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface-container-highest flex items-center justify-center">
                    <Icon name="image" className="text-4xl text-outline-variant" />
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-surface-dim/80 backdrop-blur-md px-2 py-1 rounded border border-outline-variant/50 flex items-center space-x-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      p.status === "PUBLISHED" ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  <span className="text-label-caps text-on-surface">{p.status}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-headline text-[20px] font-semibold text-on-surface truncate pr-4">
                    {p.title}
                  </h2>
                  <button
                    type="button"
                    aria-label="More options"
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <Icon name="more_vert" />
                  </button>
                </div>
                <div className="flex items-center space-x-2 mb-6">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-bold uppercase tracking-wider text-outline px-2 py-1 bg-surface-container-high rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-outline-variant/20">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      title="Edit"
                      className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded transition-colors"
                    >
                      <Icon name="edit" className="text-[20px]" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      className="p-2 text-on-surface-variant hover:text-error hover:bg-surface-container-high rounded transition-colors"
                    >
                      <Icon name="delete" className="text-[20px]" />
                    </button>
                  </div>
                  <button
                    type="button"
                    title="Reorder"
                    className="p-2 text-on-surface-variant hover:text-on-surface cursor-grab active:cursor-grabbing transition-colors"
                  >
                    <Icon name="drag_indicator" className="text-[20px]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled
              aria-label="Previous page"
              className="p-2 rounded border border-outline-variant text-outline-variant disabled:opacity-50"
            >
              <Icon name="chevron_left" className="text-[20px]" />
            </button>
            <span className="text-body-md text-on-surface px-4">Page 1 of 1</span>
            <button
              type="button"
              aria-label="Next page"
              className="p-2 rounded border border-outline-variant text-on-surface hover:border-primary hover:text-primary transition-colors"
            >
              <Icon name="chevron_right" className="text-[20px]" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
