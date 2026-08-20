import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminShell } from "@/components/AdminShell";
import { Icon } from "@/components/Icon";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/submissions")({
  head: () => ({
    meta: [
      { title: "Inbox — Bernie Amponsah" },
      { name: "description", content: "Messages sent through the website contact form." },
      { property: "og:title", content: "Inbox — Bernie Amponsah" },
      { property: "og:description", content: "Messages sent through the website contact form." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Submissions,
});

function Submissions() {
  const queryClient = useQueryClient();
  const queryKey = ["admin", "submissions"];

  const { data: messages = [], isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleRead = useMutation({
    mutationFn: async ({ id, isRead }: { id: string; isRead: boolean }) => {
      const { error } = await supabase.from("submissions").update({ is_read: isRead }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: () => toast.error("Could not update this message."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("submissions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success("Message deleted.");
    },
    onError: () => toast.error("Could not delete this message."),
  });

  return (
    <AdminShell>
      <header className="mb-10">
        <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
          Inbox
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Every message sent through the website contact form lands here.
        </p>
      </header>

      {isLoading && <p className="text-on-surface-variant">Loading…</p>}
      {!isLoading && messages.length === 0 && (
        <p className="text-on-surface-variant">No messages yet.</p>
      )}

      <div className="space-y-4">
        {messages.map((m) => (
          <article
            key={m.id}
            className={`bg-surface-container border rounded-xl p-6 ${
              m.is_read ? "border-outline-variant" : "border-primary"
            }`}
          >
            <div className="flex flex-wrap justify-between gap-4 mb-3">
              <div>
                <h2 className="font-headline text-body-lg font-bold text-on-surface">
                  {m.subject}
                </h2>
                <p className="text-body-md text-on-surface-variant">
                  {m.name} ·{" "}
                  <a href={`mailto:${m.email}`} className="text-primary hover:underline">
                    {m.email}
                  </a>
                </p>
              </div>
              <p className="text-body-md text-on-surface-variant whitespace-nowrap">
                {new Date(m.created_at).toLocaleString()}
              </p>
            </div>
            <p className="text-body-md text-on-surface whitespace-pre-line mb-5">{m.message}</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => toggleRead.mutate({ id: m.id, isRead: !m.is_read })}
                className="text-primary text-body-md hover:underline flex items-center gap-1"
              >
                <Icon name={m.is_read ? "mark_email_unread" : "mark_email_read"} className="text-[18px]" />
                {m.is_read ? "Mark unread" : "Mark read"}
              </button>
              <a
                href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                className="text-on-surface-variant text-body-md hover:underline flex items-center gap-1"
              >
                <Icon name="reply" className="text-[18px]" /> Reply
              </a>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Delete this message?")) remove.mutate(m.id);
                }}
                className="text-error text-body-md hover:underline flex items-center gap-1"
              >
                <Icon name="delete" className="text-[18px]" /> Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
