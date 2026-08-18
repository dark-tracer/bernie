import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Expertise & Services — Bernie Amponsah" },
      {
        name: "description",
        content:
          "Graphic design, social media management, UI/UX design and brand identity services for modern digital ecosystems.",
      },
      { property: "og:title", content: "Expertise & Services — Bernie Amponsah" },
      {
        property: "og:description",
        content: "High-fidelity design solutions and strategic brand management.",
      },
    ],
  }),
  component: Services,
});

const services = [
  {
    icon: "brush",
    title: "Graphic Design",
    body: "Crafting compelling visual narratives through flyers, posters, and impactful social media graphics that demand attention and drive engagement.",
  },
  {
    icon: "campaign",
    title: "Social Media Management",
    body: "Developing comprehensive digital strategies, managing robust content calendars, and providing detailed analytics reporting for sustained growth.",
  },
  {
    icon: "web",
    title: "UI/UX Design",
    body: "Architecting intuitive digital experiences via meticulous wireframes, interactive prototypes, and pixel-perfect high-fidelity mockups.",
  },
  {
    icon: "diamond",
    title: "Brand Identity",
    body: "Establishing enduring brand foundations through iconic logo design and comprehensive visual guidelines that ensure consistency across all touchpoints.",
  },
];

function Services() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-grow pt-32 pb-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full">
        <header className="mb-20">
          <h1 className="font-display text-headline-lg-mobile md:text-display mb-6">
            Expertise &amp; Services
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Delivering high-fidelity design solutions and strategic brand management tailored for
            modern digital ecosystems.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {services.map((s) => (
            <div
              key={s.title}
              className="glass-panel p-8 rounded-xl flex flex-col group hover:-translate-y-1 transition-transform duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center mb-6 border border-outline-variant">
                <Icon name={s.icon} className="text-primary text-2xl" />
              </div>
              <h2 className="font-headline text-headline-md mb-4 text-on-surface group-hover:text-primary transition-colors">
                {s.title}
              </h2>
              <p className="text-body-md text-on-surface-variant flex-grow">{s.body}</p>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
