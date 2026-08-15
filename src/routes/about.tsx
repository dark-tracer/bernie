import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icon";
import { portraitImage } from "@/data/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Bernie Amponsah — UI/UX Strategist" },
      {
        name: "description",
        content:
          "Bernie Amponsah architects systems that solve complex problems through high-contrast, structural modernism. Tools, stats and philosophy.",
      },
      { property: "og:title", content: "About Bernie Amponsah — UI/UX Strategist" },
      {
        property: "og:description",
        content: "Merging technical precision with creative authority in digital product design.",
      },
      { property: "og:image", content: portraitImage },
      { name: "twitter:image", content: portraitImage },
    ],
  }),
  component: About,
});

const stats = [
  { icon: "schedule", value: "4+", label: "Years Experience" },
  { icon: "handshake", value: "10+", label: "Global Clients" },
  { icon: "view_carousel", value: "50+", label: "Monthly Assets" },
];

const tools = [
  "Adobe Photoshop",
  "Figma",
  "Canva",
  "Meta Business Suite",
  "Google Analytics",
  "GIMP",
];

function About() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-grow max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full pt-[120px] pb-section-gap">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-section-gap items-center pt-10">
          <div className="md:col-span-5 h-[500px] md:h-[700px] relative rounded-xl overflow-hidden group">
            <img
              src={portraitImage}
              alt="Portrait of Bernie Amponsah, UI/UX strategist, in cinematic lighting"
              className="object-cover w-full h-full absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 z-20 border border-outline-variant/50 rounded-xl pointer-events-none" />
          </div>

          <div className="md:col-span-7 flex flex-col justify-center pl-0 md:pl-10 mt-10 md:mt-0">
            <h1 className="font-display text-headline-lg-mobile md:text-display text-on-surface mb-6 leading-tight">
              Crafting Digital
              <br />
              <span className="text-primary">Experiences.</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-2xl">
              I am Bernie Amponsah, a UI/UX strategist dedicated to merging technical precision with
              creative authority. I don't just design interfaces; I architect systems that solve
              complex problems through high-contrast, structural modernism. My philosophy centers on
              heavy whitespace—what I call "dark space"—to allow the work to speak for itself.
            </p>
            <div className="flex items-center space-x-6">
              <button
                type="button"
                className="bg-primary-container text-on-primary-container px-8 py-4 rounded-lg font-bold hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors flex items-center space-x-2"
              >
                <span>Download CV</span>
                <Icon name="download" />
              </button>
            </div>
          </div>
        </section>

        <section className="mb-section-gap">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-surface border border-outline-variant rounded-xl p-8 hover:shadow-[0_20px_40px_rgba(26,86,219,0.1)] transition-shadow duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon name={s.icon} className="text-primary text-4xl" />
                </div>
                <h3 className="font-headline text-headline-lg text-on-surface mb-2">{s.value}</h3>
                <p className="text-label-caps text-on-surface-variant uppercase tracking-widest">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-12">
            <h2 className="font-headline text-headline-md text-on-surface mb-2">
              Tools of the Trade
            </h2>
            <div className="w-16 h-1 bg-primary mb-6" />
            <p className="text-body-lg text-on-surface-variant max-w-xl">
              Proficient in industry-standard software to deliver high-fidelity prototypes, seamless
              wireframes, and data-driven analytical insights.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {tools.map((t) => (
              <div
                key={t}
                className="flex items-center space-x-2 bg-surface-container-high border border-outline-variant rounded-full px-6 py-3 cursor-default hover:border-primary transition-colors"
              >
                <span className="text-label-caps text-on-surface uppercase">{t}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
