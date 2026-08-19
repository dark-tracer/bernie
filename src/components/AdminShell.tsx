import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <AdminSidebar />
      <main className="md:ml-64 flex-1 min-h-screen overflow-y-auto bg-background px-margin-mobile md:px-margin-desktop py-12">
        <div className="max-w-container-max mx-auto">{children}</div>
      </main>
    </div>
  );
}
