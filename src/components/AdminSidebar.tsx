import { Link } from "@tanstack/react-router";
import { Icon } from "./Icon";

const ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDWIKkti-tgw0OTLTO93osX5kkQJf_5J9dxENHc07bi8FWAU5gU_CWgE97JHAEJQWS0l-t8LTuq1XV0ozeHetIx1toIx7rcN5nOue0Obdf-9fT2cODvh179BPqRx0SSHatSYZ1tX-Q3qH4jdIR-Vy_12e8ELY8nyQm2pZxh3YlIMTc94isa9KrCTXMR17jUY_7cxMn9AiTh3w42xE9vDK_f4iyf5ryY5uxr6Idk0nDE9pNU6cWGf7Ur";

const items = [
  { to: "/admin/portfolio", label: "Portfolio", icon: "grid_view" },
  { to: "/admin", label: "Testimonials", icon: "chat_bubble" },
  { to: "/admin", label: "Blog", icon: "edit_note" },
  { to: "/admin", label: "CV", icon: "picture_as_pdf" },
  { to: "/admin", label: "Submissions", icon: "inbox" },
  { to: "/admin", label: "Profile", icon: "person" },
  { to: "/admin/settings", label: "Settings", icon: "settings" },
] as const;

export function AdminSidebar({ active }: { active?: string }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-surface-container-low border-r border-outline-variant flex-col py-gutter hidden md:flex">
      <div className="px-6 mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant">
            <img
              src={ADMIN_AVATAR}
              alt="Bernie Amponsah"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Link to="/admin" className="font-headline text-[18px] font-bold text-on-surface block">
              Bernie Amponsah
            </Link>
            <p className="text-[14px] text-on-surface-variant">Administrator</p>
          </div>
        </div>
        <button
          type="button"
          className="w-full mt-4 py-3 bg-primary-container text-on-primary-container rounded-xl font-bold text-body-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Icon name="add" />
          New Project
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-2">
        {items.map((item) => {
          const isActive = active === item.label;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mx-2 transition-all hover:bg-surface-container-highest ${
                isActive
                  ? "bg-surface-container-high text-on-surface"
                  : "text-on-surface-variant"
              }`}
            >
              <Icon name={item.icon} className={isActive ? "text-primary" : "text-outline"} />
              <span className="text-body-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-xl mx-2 transition-all mt-4"
        >
          <Icon name="logout" className="text-outline" />
          <span className="text-body-md">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
