import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "./Icon";
import { UploadField } from "./UploadField";
import { slugify } from "@/lib/slugify";

const db = supabase as unknown as SupabaseClient;

export type Field = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "select" | "number" | "checkbox" | "date" | "url" | "image" | "file";
  options?: string[];
  placeholder?: string;
  slugFrom?: string;
};

export type Row = Record<string, unknown>;

type Props = {
  table: string;
  title: string;
  subtitle: string;
  fields: Field[];
  defaults: Row;
  orderBy: { column: string; ascending: boolean };
  columns: { key: string; label: string; render?: (row: Row) => React.ReactNode }[];
  createOpen?: boolean;
};

export function AdminCrud({
  table,
  title,
  subtitle,
  fields,
  defaults,
  orderBy,
  columns,
  createOpen = false,
}: Props) {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["admin", table], [table]);
  const [editing, setEditing] = useState<Row | null>(createOpen ? { ...defaults } : null);
  const defaultsRef = useRef(defaults);
  defaultsRef.current = defaults;

  useEffect(() => {
    if (createOpen) setEditing((current) => current ?? { ...defaultsRef.current });
  }, [createOpen]);

  const { data: rows = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await db
        .from(table)
        .select("*")
        .order(orderBy.column, { ascending: orderBy.ascending });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (record: Row) => {
      const payload = { ...record };
      for (const field of fields) {
        if (field.slugFrom && !String(payload[field.name] ?? "").trim()) {
          payload[field.name] = slugify(String(payload[field.slugFrom] ?? ""));
        }
      }
      const id = payload["id"];
      delete payload["id"];
      delete payload["created_at"];
      delete payload["updated_at"];
      const { error } = id
        ? await db.from(table).update(payload).eq("id", id as string)
        : await db.from(table).insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setEditing(null);
      toast.success("Saved — the live site is updated.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not save."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Deleted.");
    },
    onError: (error: Error) => toast.error(error.message || "Could not delete."),
  });

  return (
    <div>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
            {title}
          </h1>
          <p className="text-body-md text-on-surface-variant">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...defaults })}
          className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg text-body-md font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Icon name="add" />
          New
        </button>
      </header>

      <div className="bg-surface-container border border-outline-variant rounded-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className="px-6 py-4 text-label-caps text-on-surface-variant uppercase whitespace-nowrap"
                >
                  {c.label}
                </th>
              ))}
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="text-body-md">
            {isLoading && (
              <tr>
                <td className="px-6 py-6 text-on-surface-variant" colSpan={columns.length + 1}>
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td className="px-6 py-6 text-on-surface-variant" colSpan={columns.length + 1}>
                  Nothing here yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr
                key={String(row["id"])}
                className="border-b border-outline-variant last:border-0 hover:bg-surface-container-high transition-colors"
              >
                {columns.map((c) => (
                  <td key={c.key} className="px-6 py-4 text-on-surface-variant align-top">
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    type="button"
                    onClick={() => setEditing(row)}
                    className="text-primary hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Delete this item permanently?")) {
                        remove.mutate(String(row["id"]));
                      }
                    }}
                    className="text-error hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <EntityDialog
          fields={fields}
          record={editing}
          saving={save.isPending}
          onClose={() => setEditing(null)}
          onSave={(record) => save.mutate(record)}
        />
      )}
    </div>
  );
}

function EntityDialog({
  fields,
  record,
  saving,
  onClose,
  onSave,
}: {
  fields: Field[];
  record: Row;
  saving: boolean;
  onClose: () => void;
  onSave: (record: Row) => void;
}) {
  const [draft, setDraft] = useState<Row>(record);

  function set(name: string, value: unknown) {
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-12 px-4">
      <div className="w-full max-w-2xl bg-surface-container border border-outline-variant rounded-xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline text-[20px] font-bold text-on-surface">
            {record["id"] ? "Edit item" : "New item"}
          </h2>
          <button type="button" onClick={onClose} className="text-on-surface-variant">
            <Icon name="close" />
          </button>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            onSave(draft);
          }}
        >
          {fields.map((field) => {
            const value = draft[field.name];
            return (
              <div key={field.name} className="space-y-2">
                <label
                  htmlFor={field.name}
                  className="text-label-caps uppercase tracking-wider text-on-surface-variant block"
                >
                  {field.label}
                </label>
                {field.type === "image" || field.type === "file" ? (
                  <UploadField
                    id={field.name}
                    kind={field.type}
                    accept={field.type === "image" ? "image/*" : ".pdf,.doc,.docx"}
                    value={String(value ?? "")}
                    onChange={(url) => set(field.name, url)}
                  />
                ) : field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    rows={5}
                    value={String(value ?? "")}
                    placeholder={field.placeholder ?? ""}
                    onChange={(e) => set(field.name, e.target.value)}
                    className="input-field w-full rounded-lg px-4 py-3 text-body-md resize-y"
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.name}
                    value={String(value ?? "")}
                    onChange={(e) => set(field.name, e.target.value)}
                    className="input-field w-full rounded-lg px-4 py-3 text-body-md"
                  >
                    {(field.options ?? []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <input
                    id={field.name}
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => set(field.name, e.target.checked)}
                    className="w-5 h-5 accent-primary"
                  />
                ) : (
                  <input
                    id={field.name}
                    type={
                      field.type === "number" ? "number" : field.type === "date" ? "date" : "text"
                    }
                    value={String(value ?? "")}
                    placeholder={field.placeholder ?? ""}
                    onChange={(e) =>
                      set(
                        field.name,
                        field.type === "number" ? Number(e.target.value) : e.target.value,
                      )
                    }
                    className="input-field w-full rounded-lg px-4 py-3 text-body-md"
                  />
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg border border-outline-variant text-on-surface-variant"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
