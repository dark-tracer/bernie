import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Icon } from "./Icon";
import { supabase } from "@/integrations/supabase/client";

const items = [
  { to: "/admin", label: "Overview", icon: "grid_view", exact: true },
  { to: "/admin/portfolio", label: "Portfolio", icon: "folder_open", exact: false },
  { to: "/admin/blog", label: "Blog", icon: "edit_note", exact: false },
  { to: "/admin/testimonials", label: "Testimonials", icon: "chat_bubble", exact: false },
  { to: "/admin/about", label: "About Page", icon: "person", exact: false },
  { to: "/admin/submissions", label: "Submissions", icon: "inbox", exact: false },
  { to: "/admin/settings", label: "Settings", icon: "settings", exact: false },
] as const;

export function AdminSidebar() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 bg-surface-container-low border-r border-outline-variant flex-col py-gutter hidden md:flex">
      <div className="px-6 mb-8 flex flex-col gap-4">
        <div>
          <Link to="/admin" className="font-headline text-[18px] font-bold text-on-surface block">
            Bernie Amponsah
          </Link>
          <p className="text-[14px] text-on-surface-variant">Administrator</p>
        </div>
        <Link
          to="/admin/portfolio"
          search={{ new: "1" }}
          className="w-full mt-4 py-3 bg-primary-container text-on-primary-container rounded-xl font-bold text-body-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Icon name="add" />
          New Project
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            activeOptions={{ exact: item.exact }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl mx-2 transition-all hover:bg-surface-container-highest text-on-surface-variant"
            activeProps={{
              className:
                "flex items-center gap-3 px-4 py-3 rounded-xl mx-2 bg-surface-container-high text-on-surface",
            }}
          >
            <Icon name={item.icon} className="text-outline" />
            <span className="text-body-md">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="px-4 mt-auto space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-xl mx-2 transition-all"
        >
          <Icon name="public" className="text-outline" />
          <span className="text-body-md">View site</span>
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-xl mx-2 transition-all"
        >
          <Icon name="logout" className="text-outline" />
          <span className="text-body-md">Logout</span>
        </button>
      </div>
    </aside>
  );
}
