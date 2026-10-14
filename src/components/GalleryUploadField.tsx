import { useRef, useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function GalleryUploadField({ id, value, onChange, onUploadingChange }: { id: string; value: string[]; onChange: (images: string[]) => void; onUploadingChange: (busy: boolean) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  async function upload(files: File[]) {
    setUploading(true);
    onUploadingChange(true);
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        if (!file.type.startsWith("image/")) { toast.error(`${file.name} is not an image.`); continue; }
        if (file.size > 15 * 1024 * 1024) { toast.error(`${file.name} is too large (max 15MB).`); continue; }
        const path = `images/${crypto.randomUUID()}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60)}`;
        const { error } = await supabase.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
        if (error) { toast.error(`Could not upload ${file.name}: ${error.message}`); continue; }
        uploaded.push(`/api/public/media/${path}`);
      }
      if (uploaded.length) { onChange([...value, ...uploaded]); toast.success("Project images uploaded."); }
    } finally { setUploading(false); onUploadingChange(false); }
  }
  function move(index: number, direction: number) {
    const next = [...value];
    const other = index + direction;
    if (other < 0 || other >= next.length) return;
    const current = next[index];
    const adjacent = next[other];
    if (current === undefined || adjacent === undefined) return;
    next[index] = adjacent; next[other] = current; onChange(next);
  }
  return <div className="space-y-3">
    <Button id={id} type="button" variant="outline" disabled={uploading} onClick={() => input.current?.click()} className="text-on-surface border-outline-variant"><Upload />{uploading ? "Uploading…" : "Upload images"}</Button>
    <input ref={input} type="file" accept="image/*" multiple className="hidden" aria-label="Upload project slideshow images" onChange={(event) => { const files = Array.from(event.target.files ?? []); event.target.value = ""; if (files.length) void upload(files); }} />
    <ol className="space-y-2">{value.map((url, index) => <li key={`${url}-${index}`} className="flex items-center gap-3 border border-outline-variant rounded-md p-2">
      <img src={url} alt={`Slideshow image ${index + 1}`} className="h-16 w-20 object-cover rounded-md" />
      <span className="text-on-surface-variant flex-1 text-sm">{index + 1}</span>
      <Button type="button" variant="ghost" size="icon" aria-label={`Move image ${index + 1} earlier`} title="Move earlier" disabled={uploading || index === 0} onClick={() => move(index, -1)}><ArrowUp /></Button>
      <Button type="button" variant="ghost" size="icon" aria-label={`Move image ${index + 1} later`} title="Move later" disabled={uploading || index === value.length - 1} onClick={() => move(index, 1)}><ArrowDown /></Button>
      <Button type="button" variant="ghost" size="icon" aria-label={`Remove image ${index + 1}`} title="Remove image" disabled={uploading} onClick={() => onChange(value.filter((_, i) => i !== index))} className="text-error"><Trash2 /></Button>
    </li>)}</ol>
  </div>;
}