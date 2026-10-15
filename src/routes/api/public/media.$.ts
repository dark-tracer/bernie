import { createFileRoute } from "@tanstack/react-router";

const BUCKET = "media";

function fail(message: string, status = 500) {
  console.error(new Error(`[media] ${message}`));
  return new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        let url: string, key: string;
        try {
          const { requireEnv } = await import("@/lib/server-env.server");
          url = await requireEnv("SUPABASE_URL");
          key = await requireEnv("SUPABASE_PUBLISHABLE_KEY");
        } catch (e) {
          return fail(`Media config error: ${e instanceof Error ? e.message : String(e)}`);
        }

        const encoded = path.split("/").map(encodeURIComponent).join("/");
        let res: Response;
        try {
          // Publishable key only; access granted by the public-read policy on the media bucket.
          res = await fetch(`${url.replace(/\/$/, "")}/storage/v1/object/${BUCKET}/${encoded}`, { headers: { apikey: key } });
        } catch (e) {
          return fail(`Storage request failed for ${BUCKET}/${path}: ${e instanceof Error ? e.message : String(e)}`);
        }

        if (res.status === 404 || res.status === 400) {
          const text = await res.text().catch(() => "");
          if (res.status === 404 || /not.?found/i.test(text)) return new Response("Not found", { status: 404 });
          return fail(`Storage returned ${res.status} for ${BUCKET}/${path}: ${text}`);
        }
        if (!res.ok || !res.body) {
          const text = await res.text().catch(() => "");
          return fail(`Storage returned ${res.status} for ${BUCKET}/${path}: ${text}`);
        }

        const headers = new Headers({
          "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        });
        const len = res.headers.get("Content-Length");
        if (len) headers.set("Content-Length", len);
        return new Response(res.body, { status: 200, headers });
      },
    },
  },
});
