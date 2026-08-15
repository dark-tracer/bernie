export function SiteFooter() {
  return (
    <footer className="w-full py-section-gap bg-background border-t border-outline-variant/10">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-headline text-headline-md font-bold text-on-surface">
          Bernie Amponsah
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          {["Privacy Policy", "Terms of Service", "LinkedIn", "Dribbble"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-body-md text-on-surface-variant hover:text-on-surface transition-colors opacity-80 hover:opacity-100"
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="text-body-md text-on-surface-variant">
          © 2024 Bernie Amponsah. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
