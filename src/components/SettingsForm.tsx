import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { UploadField } from "./UploadField";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as unknown as SupabaseClient;

export type SettingsField = {
  name: string;
  label: string;
  kind?: "text" | "textarea" | "image" | "file";
  hint?: string;
};

export type SettingsGroup = { title: string; fields: SettingsField[] };

type Settings = Record<string, string | null>;

export function SettingsForm({ groups }: { groups: SettingsGroup[] }) {
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
    if (data) setDraft(data as Settings);
  }, [data]);

  const save = useMutation({
    mutationFn: async (values: Settings) => {
      const payload: Settings = {};
      for (const group of groups) {
        for (const field of group.fields) payload[field.name] = values[field.name] ?? "";
      }
      const { error } = await db.from("site_settings").update(payload).eq("id", true);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Saved — the live site is updated.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not save."),
  });

  if (!draft) return <p className="text-on-surface-variant">Loading…</p>;

  return (
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
              {field.hint && <p className="text-[13px] text-on-surface-variant">{field.hint}</p>}
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
  );
}
