import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const { envPresence } = await import("@/lib/server-env.server");
        const { publicDb } = await import("@/lib/public-db.server");
        const env = await envPresence();
        let supabase: { ok: boolean; error?: string } = { ok: false };
        try {
          const db = await publicDb();
          const { error } = await db.from("site_settings").select("id").limit(1);
          supabase = error ? { ok: false, error: error.message } : { ok: true };
        } catch (e) {
          supabase = { ok: false, error: e instanceof Error ? e.message : String(e) };
        }
        if (!supabase.ok) console.error(new Error(`Health check Supabase query failed: ${supabase.error}`));
        return Response.json(
          { ok: supabase.ok, env, supabase },
          { status: supabase.ok ? 200 : 503, headers: { "Cache-Control": "no-store" } },
        );
      },
    },
  },
});
