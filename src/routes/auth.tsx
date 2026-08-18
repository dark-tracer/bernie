import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Sign In — Bernie Amponsah" },
      { name: "description", content: "Secure sign-in for the Bernie Amponsah studio dashboard." },
      { property: "og:title", content: "Admin Sign In — Bernie Amponsah" },
      { property: "og:description", content: "Secure sign-in for the studio dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error("Invalid email or password.");
      return;
    }
    toast.success("Welcome back.");
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded-xl p-8 md:p-10">
        <Link to="/" className="text-on-surface-variant text-body-md inline-flex items-center gap-2 mb-8">
          <Icon name="arrow_back" /> Back to site
        </Link>
        <h1 className="font-headline text-headline-md font-bold text-on-surface mb-2">
          Studio Dashboard
        </h1>
        <p className="text-body-md text-on-surface-variant mb-8">
          Sign in with your administrator account.
        </p>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="text-label-caps uppercase tracking-wider text-on-surface-variant block">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field w-full rounded-lg px-4 py-3 text-body-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-label-caps uppercase tracking-wider text-on-surface-variant block">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full rounded-lg px-4 py-3 text-body-md"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-primary-container text-on-primary-container font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
