import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icon";
import { getSiteSettings, sendMessage } from "@/lib/content.functions";

export const Route = createFileRoute("/contact")({
  loader: () => getSiteSettings(),
  head: () => ({
    meta: [
      { title: "Contact Bernie Amponsah — Let's Connect" },
      {
        name: "description",
        content:
          "Available for freelance projects and full-time opportunities. Send a message about design, branding or UI/UX work.",
      },
      { property: "og:title", content: "Contact Bernie Amponsah — Let's Connect" },
      {
        property: "og:description",
        content: "Reach out to discuss design, branding and UI/UX collaborations.",
      },
    ],
  }),
  component: Contact,
  errorComponent: () => <p className="p-12 text-on-surface">This page could not be loaded.</p>,
});

function Contact() {
  const settings = Route.useLoaderData();
  const [sending, setSending] = useState(false);

  const email = settings?.email ?? "bernieamponsah2@gmail.com";
  const phone = settings?.phone ?? "+233 50 260 5560";
  const location = settings?.location ?? "Accra, Ghana";
  const availability = settings?.availability_note ?? "Available for remote work globally.";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? "General Inquiry") || "General Inquiry",
      message: String(fd.get("message") ?? ""),
    };

    if (!payload.name || !payload.email || !payload.message) {
      toast.error("Please fill in your name, email and message.");
      return;
    }

    setSending(true);
    try {
      await sendMessage({ data: payload });
      form.reset();
      toast.success("Message sent — it's now in Bernie's inbox.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-grow pt-[120px] pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-5 flex flex-col justify-center space-y-12 pr-0 lg:pr-12">
            <div>
              <h1 className="font-display text-headline-lg-mobile md:text-display text-on-surface mb-6">
                Let's connect.
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-md">
                Available for freelance projects and full-time opportunities. Reach out to discuss
                how we can build something exceptional together.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <Icon name="mail" className="text-primary text-3xl" />
                <div>
                  <p className="text-label-caps text-outline mb-1 uppercase tracking-widest">
                    Email
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="font-headline text-headline-md text-on-surface hover:text-primary transition-colors break-all"
                  >
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Icon name="call" className="text-primary text-3xl" />
                <div>
                  <p className="text-label-caps text-outline mb-1 uppercase tracking-widest">
                    Phone
                  </p>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="font-headline text-headline-md text-on-surface hover:text-primary transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Icon name="location_on" className="text-primary text-3xl" />
                <div>
                  <p className="text-label-caps text-outline mb-1 uppercase tracking-widest">
                    Location
                  </p>
                  <p className="font-headline text-headline-md text-on-surface">{location}</p>
                  <p className="text-body-md text-on-surface-variant mt-1">{availability}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 mt-12 lg:mt-0">
            <div className="bg-surface-container/50 backdrop-blur-md border border-outline-variant/30 rounded-xl p-8 md:p-12 shadow-2xl">
              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-label-caps text-on-surface-variant uppercase tracking-wider block"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      maxLength={120}
                      placeholder="Jane Doe"
                      className="input-field w-full rounded-lg px-4 py-3 text-body-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-label-caps text-on-surface-variant uppercase tracking-wider block"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      maxLength={200}
                      placeholder="jane@example.com"
                      className="input-field w-full rounded-lg px-4 py-3 text-body-md"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-label-caps text-on-surface-variant uppercase tracking-wider block"
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      defaultValue="General Inquiry"
                      className="input-field w-full rounded-lg px-4 py-3 text-body-md appearance-none"
                    >
                      <option value="Graphic Design">Graphic Design</option>
                      <option value="Social Media">Social Media</option>
                      <option value="UI/UX">UI/UX</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
                      <Icon name="expand_more" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-label-caps text-on-surface-variant uppercase tracking-wider block"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    maxLength={5000}
                    placeholder="Tell me about your project..."
                    className="input-field w-full rounded-lg px-4 py-3 text-body-md resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary-container text-on-primary-container font-headline text-body-lg py-4 rounded-lg hover:bg-primary hover:text-on-primary transition-all duration-300 mt-4 flex justify-center items-center group disabled:opacity-60"
                >
                  {sending ? "Sending..." : "Send Message"}
                  <Icon
                    name="send"
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
