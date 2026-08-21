import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icon";
import { portraitImage } from "@/data/site";
import { getSiteSettings } from "@/lib/content.functions";

export const Route = createFileRoute("/about")({
  loader: () => getSiteSettings(),
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
  errorComponent: () => <p className="p-10 text-on-surface">Could not load this page.</p>,
  notFoundComponent: () => <p className="p-10 text-on-surface">Page not found.</p>,
  component: About,
});

const statIcons = ["schedule", "handshake", "view_carousel"];

const fallbackStats = "4+ | Years Experience\n10+ | Global Clients\n50+ | Monthly Assets";
const fallbackTools = "Adobe Photoshop, Figma, Canva, Meta Business Suite, Google Analytics, GIMP";

function About() {
  const settings = (Route.useLoaderData() ?? {}) as Record<string, string | null>;

  const portrait = settings["portrait_url"] || portraitImage;
  const heading = settings["about_heading"] || "Crafting Digital Experiences.";
  const body =
    settings["about_body"] ||
    "I am Bernie Amponsah, a UI/UX strategist dedicated to merging technical precision with creative authority.";
  const cvUrl = settings["cv_url"] || "";
  const toolsHeading = settings["about_tools_heading"] || "Tools of the Trade";
  const toolsIntro =
    settings["about_tools_intro"] ||
    "Proficient in industry-standard software to deliver high-fidelity prototypes, seamless wireframes, and data-driven analytical insights.";
  const tools = (settings["about_tools"] || fallbackTools)
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const stats = (settings["about_stats"] || fallbackStats)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [value, label] = line.split("|");
      return {
        value: (value ?? "").trim(),
        label: (label ?? "").trim(),
        icon: statIcons[i % statIcons.length] as string,
      };
    });

  const headingWords = heading.trim().split(" ");
  const lastWord = headingWords.length > 1 ? headingWords.pop()! : "";
  const leadWords = headingWords.join(" ");

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-grow max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full pt-[120px] pb-section-gap">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-section-gap items-center pt-10">
          <div className="md:col-span-5 h-[500px] md:h-[700px] relative rounded-xl overflow-hidden group">
            <img
              src={portrait}
              alt="Portrait of Bernie Amponsah, UI/UX strategist, in cinematic lighting"
              className="object-cover w-full h-full absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 z-20 border border-outline-variant/50 rounded-xl pointer-events-none" />
          </div>

          <div className="md:col-span-7 flex flex-col justify-center pl-0 md:pl-10 mt-10 md:mt-0">
            <h1 className="font-display text-headline-lg-mobile md:text-display text-on-surface mb-6 leading-tight">
              {leadWords}
              {lastWord && (
                <>
                  <br />
                  <span className="text-primary">{lastWord}</span>
                </>
              )}
            </h1>
            <p className="text-body-lg text-on-surface-variant mb-8 max-w-2xl whitespace-pre-line">
              {body}
            </p>
            {cvUrl && (
              <div className="flex items-center space-x-6">
                <a
                  href={cvUrl}
                  download
                  className="bg-primary-container text-on-primary-container px-8 py-4 rounded-lg font-bold hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors flex items-center space-x-2"
                >
                  <span>Download CV</span>
                  <Icon name="download" />
                </a>
              </div>
            )}
          </div>
        </section>

        {stats.length > 0 && (
          <section className="mb-section-gap">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((s) => (
                <div
                  key={s.label || s.value}
                  className="bg-surface border border-outline-variant rounded-xl p-8 hover:shadow-[0_20px_40px_rgba(26,86,219,0.1)] transition-shadow duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon name={s.icon} className="text-primary text-4xl" />
                  </div>
                  <p className="font-headline text-headline-lg text-on-surface mb-2">{s.value}</p>
                  <p className="text-label-caps text-on-surface-variant uppercase tracking-widest">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-12">
            <h2 className="font-headline text-headline-md text-on-surface mb-2">{toolsHeading}</h2>
            <div className="w-16 h-1 bg-primary mb-6" />
            <p className="text-body-lg text-on-surface-variant max-w-xl">{toolsIntro}</p>
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
