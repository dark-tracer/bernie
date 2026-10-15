import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireEnv } from "./server-env.server";

/** Publishable-key client for public, RLS-respecting reads/writes on the server. */
export async function publicDb() {
  const url = await requireEnv("SUPABASE_URL");
  const key = await requireEnv("SUPABASE_PUBLISHABLE_KEY");

  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

/** Throws a descriptive, logged error when a query fails. */
export function check<T>(label: string, res: { data: T; error: { message: string } | null }): T {
  if (res.error) {
    const err = new Error(`Database query failed (${label}): ${res.error.message}`);
    console.error(err);
    throw err;
  }
  return res.data;
}
