import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Icon } from "./Icon";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-background/80 border-b border-outline-variant/10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center h-20">
        <Link
          to="/"
          className="font-headline text-headline-md font-bold tracking-tighter text-on-surface"
        >
          Bernie Amponsah
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="text-on-surface-variant font-medium hover:text-primary transition-colors duration-300"
              activeProps={{ className: "text-primary font-bold border-b-2 border-primary pb-1" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          to="/contact"
          className="hidden md:inline-flex bg-primary-container text-on-primary-container px-6 py-3 rounded-lg font-bold hover:bg-primary-container/90 active:scale-95 transition-all"
        >
          Let's Talk
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-on-surface"
        >
          <Icon name={open ? "close" : "menu"} className="text-[32px]" />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-outline-variant/20 bg-background/95 backdrop-blur-xl px-margin-mobile py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              onClick={() => setOpen(false)}
              className="py-3 text-on-surface-variant font-medium"
              activeProps={{ className: "py-3 text-primary font-bold" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
