import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function SiteFooter() {
  const { data } = useQuery({
    queryKey: ["public", "settings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("linkedin_url, instagram_url, behance_url")
        .maybeSingle();
      return data;
    },
    staleTime: 60_000,
  });

  const socials = [
    { label: "LinkedIn", url: data?.linkedin_url },
    { label: "Instagram", url: data?.instagram_url },
    { label: "Behance", url: data?.behance_url },
  ].filter((s) => Boolean(s.url));

  return (
    <footer className="w-full py-section-gap bg-background border-t border-outline-variant/10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-headline text-headline-md font-bold text-on-surface">
          Bernie Amponsah
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.url as string}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors opacity-80 hover:opacity-100"
            >
              {s.label}
            </a>
          ))}
        </nav>
        <div className="text-body-md text-on-surface-variant">
          © 2024 Bernie Amponsah. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
