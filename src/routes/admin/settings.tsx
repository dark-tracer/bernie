import { createFileRoute } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Icon } from "@/components/Icon";
import { settingsAvatar } from "@/data/site";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Site Settings — Bernie Amponsah Admin" },
      {
        name: "description",
        content: "Manage public profile, contact information and social profiles.",
      },
      { property: "og:title", content: "Site Settings — Bernie Amponsah Admin" },
      { property: "og:description", content: "Manage profile and contact information." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SiteSettings,
});

const inputClass =
  "w-full bg-background border border-outline-variant text-on-surface rounded-lg px-4 py-3 focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors outline-none text-body-md";

function SiteSettings() {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      <AdminSidebar active="Settings" />

      <main className="flex-1 md:ml-64 w-full min-h-screen pb-24 md:pb-0">
        <header className="px-margin-mobile md:px-margin-desktop py-12 md:py-16 border-b border-outline-variant/30">
          <div className="max-w-container-max mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg text-on-surface">
                Site Settings
              </h1>
              <p className="text-body-md text-on-surface-variant mt-2">
                Manage your public profile and contact information.
              </p>
            </div>
            <button
              type="button"
              className="bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-bold hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors duration-300 hidden md:block"
            >
              Save Changes
            </button>
          </div>
        </header>

        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter md:py-section-gap space-y-16">
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter">
            <div className="md:col-span-4">
              <h2 className="font-headline text-[24px] text-on-surface">General Information</h2>
              <p className="text-on-surface-variant mt-2 text-sm">
                Update your core identity details shown across the site.
              </p>
            </div>
            <div className="md:col-span-8 bg-surface border border-outline-variant rounded-xl p-8 space-y-6">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-outline-variant/30">
                <div className="w-24 h-24 rounded-full overflow-hidden border border-outline-variant bg-surface-container-highest relative group cursor-pointer">
                  <img
                    src={settingsAvatar}
                    alt="Profile photo"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-background/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon name="upload" className="text-on-surface" />
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg border border-outline-variant hover:bg-surface-container-highest transition-colors text-sm font-bold"
                  >
                    Change Photo
                  </button>
                  <p className="text-xs text-on-surface-variant mt-2">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="block text-label-caps text-on-surface-variant uppercase"
                >
                  Full Name
                </label>
                <input id="fullName" type="text" defaultValue="Bernie Amponsah" className={inputClass} />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tagline"
                  className="block text-label-caps text-on-surface-variant uppercase"
                >
                  Professional Tagline
                </label>
                <input
                  id="tagline"
                  type="text"
                  defaultValue="UI/UX Strategist & Digital Designer"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <hr className="border-outline-variant/30" />

          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter">
            <div className="md:col-span-4">
              <h2 className="font-headline text-[24px] text-on-surface">Contact Details</h2>
              <p className="text-on-surface-variant mt-2 text-sm">
                Where clients and peers can reach you.
              </p>
            </div>
            <div className="md:col-span-8 bg-surface border border-outline-variant rounded-xl p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="contactEmail"
                    className="block text-label-caps text-on-surface-variant uppercase"
                  >
                    Public Email
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    defaultValue="hello@bernieamponsah.design"
                    className={inputClass}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contactPhone"
                    className="block text-label-caps text-on-surface-variant uppercase"
                  >
                    Phone Number (Optional)
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-outline-variant/30" />

          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-gutter pb-24">
            <div className="md:col-span-4">
              <h2 className="font-headline text-[24px] text-on-surface">Social Profiles</h2>
              <p className="text-on-surface-variant mt-2 text-sm">
                Links to your professional networks.
              </p>
            </div>
            <div className="md:col-span-8 bg-surface border border-outline-variant rounded-xl p-8 space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="linkedinLink"
                  className="block text-label-caps text-on-surface-variant uppercase"
                >
                  LinkedIn URL
                </label>
                <div className="relative flex items-center">
                  <Icon
                    name="link"
                    className="absolute left-4 text-on-surface-variant text-[18px]"
                  />
                  <input
                    id="linkedinLink"
                    type="url"
                    defaultValue="https://linkedin.com/in/bernieamponsah"
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="instagramLink"
                  className="block text-label-caps text-on-surface-variant uppercase"
                >
                  Instagram URL
                </label>
                <div className="relative flex items-center">
                  <Icon
                    name="link"
                    className="absolute left-4 text-on-surface-variant text-[18px]"
                  />
                  <input
                    id="instagramLink"
                    type="url"
                    placeholder="https://instagram.com/username"
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="fixed bottom-0 left-0 w-full p-4 bg-background border-t border-outline-variant/30 md:hidden z-50">
          <button
            type="button"
            className="w-full bg-primary-container text-on-primary-container px-6 py-4 rounded-lg font-bold"
          >
            Save Changes
          </button>
        </div>
      </main>
    </div>
  );
}
