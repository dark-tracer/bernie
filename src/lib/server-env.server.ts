// Server-only environment access. Order: Cloudflare Workers binding -> process.env -> import.meta.env VITE_*.
// Never call at module top level; read inside handlers so a missing value cannot crash page load.

export type EnvName = "SUPABASE_URL" | "SUPABASE_PUBLISHABLE_KEY" | "SUPABASE_PROJECT_ID";

let cfEnvPromise: Promise<Record<string, unknown> | null> | undefined;

async function getCloudflareEnv(): Promise<Record<string, unknown> | null> {
  if (!cfEnvPromise) {
    cfEnvPromise = (async () => {
      try {
        // Variable specifier so preview/local dev bundlers don't try to resolve it.
        const specifier = "cloudflare:workers";
        const mod = (await import(/* @vite-ignore */ specifier)) as { env?: Record<string, unknown> };
        return mod.env ?? null;
      } catch {
        return null;
      }
    })();
  }
  return cfEnvPromise;
}

function fromProcess(name: string): string | undefined {
  try {
    return typeof process !== "undefined" ? process.env?.[name] : undefined;
  } catch {
    return undefined;
  }
}

function fromVite(name: string): string | undefined {
  try {
    return (import.meta.env as Record<string, string | undefined>)?.[`VITE_${name}`];
  } catch {
    return undefined;
  }
}

export async function readEnv(name: EnvName): Promise<string | undefined> {
  const cf = await getCloudflareEnv();
  const cfVal = cf?.[name];
  if (typeof cfVal === "string" && cfVal) return cfVal;
  return fromProcess(name) || fromVite(name) || undefined;
}

export async function requireEnv(name: EnvName): Promise<string> {
  const value = await readEnv(name);
  if (!value) {
    const err = new Error(`Missing environment variable: ${name} (checked Cloudflare env, process.env, VITE_${name})`);
    console.error(err);
    throw err;
  }
  return value;
}

export async function envPresence(): Promise<Record<EnvName, boolean>> {
  const names: EnvName[] = ["SUPABASE_URL", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_PROJECT_ID"];
  const entries = await Promise.all(names.map(async (n) => [n, Boolean(await readEnv(n))] as const));
  return Object.fromEntries(entries) as Record<EnvName, boolean>;
}
