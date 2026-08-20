import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Icon } from "./Icon";

function safeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-60);
}

export function UploadField({
  id,
  value,
  onChange,
  accept = "image/*",
  kind = "image",
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  kind?: "image" | "file";
  placeholder?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File) {
    if (file.size > 15 * 1024 * 1024) {
      toast.error("File is too large (max 15MB).");
      return;
    }
    setUploading(true);
    try {
      const path = `${kind === "image" ? "images" : "files"}/${Date.now()}-${safeName(file.name)}`;
      const { error } = await supabase.storage
        .from("media")
        .upload(path, file, { cacheControl: "31536000", upsert: false });
      if (error) throw error;
      onChange(`/api/public/media/${path}`);
      toast.success("Uploaded.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <input
          id={id}
          type="text"
          value={value}
          placeholder={placeholder ?? "Paste a URL or upload"}
          onChange={(e) => onChange(e.target.value)}
          className="input-field w-full rounded-lg px-4 py-3 text-body-md"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="shrink-0 px-4 py-3 rounded-lg border border-outline-variant text-on-surface flex items-center gap-2 disabled:opacity-60"
        >
          <Icon name="upload" />
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) void upload(file);
        }}
      />
      {value && kind === "image" && (
        <img
          src={value}
          alt="Uploaded preview"
          className="h-24 w-auto rounded-lg border border-outline-variant object-cover"
        />
      )}
      {value && kind === "file" && (
        <a href={value} className="text-primary text-body-md hover:underline" target="_blank" rel="noreferrer">
          Preview current file
        </a>
      )}
    </div>
  );
}
