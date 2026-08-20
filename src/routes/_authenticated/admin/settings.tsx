import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { AdminShell } from "@/components/AdminShell";
import { UploadField } from "@/components/UploadField";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as SupabaseClient;

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

type Settings = Record<string, string | null>;

type FieldDef = {
  name: string;
  label: string;
  kind?: "text" | "textarea" | "image" | "file";
  hint?: string;
};

const groups: { title: string; fields: FieldDef[] }[] = [
  {
    title: "Profile & contact",
    fields: [
      { name: "full_name", label: "Full name" },
      { name: "tagline", label: "Tagline" },
      { name: "bio", label: "Bio", kind: "textarea" },
      { name: "email", label: "Email address" },
      { name: "phone", label: "Phone number" },
      { name: "location", label: "Location" },
      { name: "availability_note", label: "Availability note" },
      { name: "avatar_url", label: "Avatar image", kind: "image" },
      { name: "cv_url", label: "CV / résumé (PDF)", kind: "file", hint: "Visitors download this from the About page." },
    ],
  },
  {
    title: "Social links",
    fields: [
      { name: "linkedin_url", label: "LinkedIn URL" },
      { name: "instagram_url", label: "Instagram URL" },
      { name: "behance_url", label: "Behance URL" },
    ],
  },
  {
    title: "About page",
    fields: [
      { name: "portrait_url", label: "Portrait image", kind: "image" },
      { name: "about_heading", label: "Heading" },
      { name: "about_body", label: "Intro paragraph", kind: "textarea" },
      {
        name: "about_stats",
        label: "Stats",
        kind: "textarea",
        hint: "One per line, formatted as: 4+ | Years Experience",
      },
      { name: "about_tools_heading", label: "Tools section heading" },
      { name: "about_tools_intro", label: "Tools section intro", kind: "textarea" },
      { name: "about_tools", label: "Tools", hint: "Comma separated", kind: "textarea" },
    ],
  },
];

function SettingsPage() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Settings | null>(null);

  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await db.from("site_settings").select("*").maybeSingle();
      if (error) throw error;
      return data as Settings | null;
    },
  });

  useEffect(() => {
    if (data) {
      const { id: _id, updated_at: _updated, ...rest } = data as Record<string, unknown>;
      setDraft(rest as Settings);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async (values: Settings) => {
      const { error } = await db.from("site_settings").update(values).eq("id", true);
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
          Contact details, social links, your CV and the About page all come from here.
        </p>
      </header>

      {!draft && <p className="text-on-surface-variant">Loading…</p>}

      {draft && (
        <form
          className="max-w-2xl space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate(draft);
          }}
        >
          {groups.map((group) => (
            <section
              key={group.title}
              className="space-y-5 bg-surface-container border border-outline-variant rounded-xl p-8"
            >
              <h2 className="font-headline text-[20px] font-bold text-on-surface">{group.title}</h2>
              {group.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label
                    htmlFor={field.name}
                    className="text-label-caps uppercase tracking-wider text-on-surface-variant block"
                  >
                    {field.label}
                  </label>
                  {field.kind === "image" || field.kind === "file" ? (
                    <UploadField
                      id={field.name}
                      kind={field.kind}
                      accept={field.kind === "image" ? "image/*" : ".pdf,.doc,.docx"}
                      value={draft[field.name] ?? ""}
                      onChange={(url) => setDraft({ ...draft, [field.name]: url })}
                    />
                  ) : field.kind === "textarea" ? (
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
                  {field.hint && (
                    <p className="text-[13px] text-on-surface-variant">{field.hint}</p>
                  )}
                </div>
              ))}
            </section>
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
