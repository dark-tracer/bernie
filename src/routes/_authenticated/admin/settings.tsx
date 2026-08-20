import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/AdminShell";
import { SettingsForm, type SettingsGroup } from "@/components/SettingsForm";

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

const groups: SettingsGroup[] = [
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
      {
        name: "cv_url",
        label: "CV / résumé",
        kind: "file",
        hint: "Visitors download this from the About page.",
      },
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
];

function SettingsPage() {
  return (
    <AdminShell>
      <header className="mb-10">
        <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
          Site Settings
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Contact details, social links and your CV power the live site.
        </p>
      </header>
      <SettingsForm groups={groups} />
    </AdminShell>
  );
}
