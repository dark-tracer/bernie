import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/AdminShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({
    meta: [
      { title: "Site Settings — Bernie Amponsah" },
      { name: "description", content: "Update contact details, bio and social links." },
      { property: "og:title", content: "Site Settings — Bernie Amponsah" },
      { property: "og:description", content: "Update contact details, bio and social links." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

type Settings = {
  full_name: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  availability_note: string;
  avatar_url: string | null;
  linkedin_url: string;
  instagram_url: string;
  behance_url: string;
};

const fields: { name: keyof Settings; label: string; textarea?: boolean }[] = [
  { name: "full_name", label: "Full name" },
  { name: "tagline", label: "Tagline" },
  { name: "bio", label: "Bio", textarea: true },
  { name: "email", label: "Email address" },
  { name: "phone", label: "Phone number" },
  { name: "location", label: "Location" },
  { name: "availability_note", label: "Availability note" },
  { name: "avatar_url", label: "Avatar image URL" },
  { name: "linkedin_url", label: "LinkedIn URL" },
  { name: "instagram_url", label: "Instagram URL" },
  { name: "behance_url", label: "Behance URL" },
];

function SettingsPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Settings | null>(null);

  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      const { id: _id, updated_at: _updated, ...rest } = data;
      setDraft(rest as Settings);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async (values: Settings) => {
      const { error } = await supabase.from("site_settings").update(values).eq("id", true);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Settings saved — the live site is updated.");
    },
    onError: () => toast.error("Could not save settings."),
  });

  return (
    <AdminShell>
      <header className="mb-10">
        <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
          Site Settings
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Contact details here power the public contact page.
        </p>
      </header>

      {!draft && <p className="text-on-surface-variant">Loading…</p>}

      {draft && (
        <form
          className="max-w-2xl space-y-5 bg-surface-container border border-outline-variant rounded-xl p-8"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(draft);
          }}
        >
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="text-label-caps uppercase tracking-wider text-on-surface-variant block"
              >
                {field.label}
              </label>
              {field.textarea ? (
                <textarea
                  id={field.name}
                  rows={4}
                  value={draft[field.name] ?? ""}
                  onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value })}
                  className="input-field w-full rounded-lg px-4 py-3 text-body-md resize-y"
                />
              ) : (
                <input
                  id={field.name}
                  type="text"
                  value={draft[field.name] ?? ""}
                  onChange={(e) => setDraft({ ...draft, [field.name]: e.target.value })}
                  className="input-field w-full rounded-lg px-4 py-3 text-body-md"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={save.isPending}
            className="px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold disabled:opacity-60"
          >
            {save.isPending ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}
    </AdminShell>
  );
}
