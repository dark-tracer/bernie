import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bernie Amponsah | UI/UX Designer & Strategist" },
      {
        name: "description",
        content:
          "Bernie Amponsah designs visuals that work — immersive digital experiences and strategic brand identities from Accra, Ghana.",
      },
      { property: "og:title", content: "Bernie Amponsah | UI/UX Designer & Strategist" },
      {
        property: "og:description",
        content:
          "Immersive digital experiences and strategic brand identities, designed in Accra, Ghana.",
      },
    ],
  }),
  component: Home,
});

const roles = ["Graphic Designer", "Social Media Manager", "UI/UX Designer"];
const clients = [
  "Cais Technology",
  "AquaTrack",
  "Arcane Branding",
  "Ridesmash",
  "Vodafone GH",
  "Peculiar Int.",
];

function useTypewriter() {
  const [text, setText] = useState("");

  useEffect(() => {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = roles[roleIndex] ?? "";
      let speed: number;

      if (deleting) {
        charIndex -= 1;
        speed = 50;
      } else {
        charIndex += 1;
        speed = 150;
      }
      setText(current.substring(0, charIndex));

      if (!deleting && charIndex === current.length) {
        deleting = true;
        speed = 2000;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 500;
      }

      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(tick, 1000);
    return () => clearTimeout(timer);
  }, []);

  return text;
}

function Home() {
  const typed = useTypewriter();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <SiteNav />

      <main className="flex-grow pt-20">
        <section className="min-h-[calc(100vh-5rem)] flex flex-col justify-center items-center text-center px-margin-mobile md:px-margin-desktop relative overflow-hidden py-24">
          <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-10">
            <div className="w-[800px] h-[800px] bg-primary rounded-full blur-[120px]" />
          </div>

          <div className="z-10 max-w-4xl mx-auto flex flex-col items-center gap-8">
            <h1 className="font-display text-headline-lg-mobile md:text-display text-on-surface tracking-tighter">
              Bernie Amponsah
            </h1>
            <div className="h-12 flex items-center justify-center">
              <span className="font-headline text-headline-md text-primary">{typed}</span>
              <span className="typewriter-caret font-headline text-headline-md text-primary" />
            </div>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              I design visuals that work. Based in Accra, Ghana, specializing in crafting immersive
              digital experiences and strategic brand identities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                to="/portfolio"
                className="bg-primary-container text-on-primary-container px-8 py-4 rounded-lg font-bold hover:bg-primary-container/90 transition-colors flex items-center justify-center gap-2 group"
              >
                View My Work
                <Icon name="arrow_forward" className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="border border-outline text-on-surface px-8 py-4 rounded-lg font-bold hover:bg-surface-variant transition-colors flex items-center justify-center"
              >
                Let's Talk
              </Link>
            </div>
          </div>
        </section>

        <section className="w-full border-y border-outline-variant/20 py-8 bg-surface-container-lowest overflow-hidden">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop mb-4">
            <p className="text-label-caps text-on-surface-variant text-center uppercase tracking-widest">
              Trusted By
            </p>
          </div>
          <div className="relative w-full flex overflow-hidden">
            <div className="scroll-strip whitespace-nowrap items-center gap-16 px-8">
              {[...clients, ...clients].map((c, i) => (
                <span
                  key={`${c}-${i}`}
                  className="font-headline text-headline-md text-outline font-bold opacity-50 hover:opacity-100 hover:text-primary transition-all cursor-default"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="h-section-gap" />
      </main>

      <SiteFooter />
    </div>
  );
}
