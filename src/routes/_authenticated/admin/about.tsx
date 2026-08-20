import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { SettingsForm, type SettingsGroup } from "@/components/SettingsForm";

export const Route = createFileRoute("/_authenticated/admin/about")({
  head: () => ({
    meta: [
      { title: "About Page Editor — Bernie Amponsah" },
      { name: "description", content: "Edit the public About page content, portrait and CV." },
      { property: "og:title", content: "About Page Editor — Bernie Amponsah" },
      {
        property: "og:description",
        content: "Edit the public About page content, portrait and CV.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AboutEditor,
});

const groups: SettingsGroup[] = [
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
      { name: "about_tools", label: "Tools", kind: "textarea", hint: "Comma separated" },
      {
        name: "cv_url",
        label: "CV / résumé",
        kind: "file",
        hint: "Visitors download this from the About page.",
      },
    ],
  },
];

function AboutEditor() {
  return (
    <AdminShell>
      <header className="mb-10">
        <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
          About Page
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Everything here appears on the public About page, including the downloadable CV.
        </p>
      </header>
      <SettingsForm groups={groups} />
    </AdminShell>
  );
}
