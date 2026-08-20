ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS cv_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS portrait_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_heading text NOT NULL DEFAULT 'Crafting Digital Experiences.',
  ADD COLUMN IF NOT EXISTS about_body text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_tools_heading text NOT NULL DEFAULT 'Tools of the Trade',
  ADD COLUMN IF NOT EXISTS about_tools_intro text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_tools text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS about_stats text NOT NULL DEFAULT '';

UPDATE public.site_settings SET
  about_body = COALESCE(NULLIF(about_body,''), 'I am Bernie Amponsah, a UI/UX strategist dedicated to merging technical precision with creative authority. I don''t just design interfaces; I architect systems that solve complex problems through high-contrast, structural modernism.'),
  about_tools = COALESCE(NULLIF(about_tools,''), 'Adobe Photoshop, Figma, Canva, Meta Business Suite, Google Analytics, GIMP'),
  about_tools_intro = COALESCE(NULLIF(about_tools_intro,''), 'Proficient in industry-standard software to deliver high-fidelity prototypes, seamless wireframes, and data-driven analytical insights.'),
  about_stats = COALESCE(NULLIF(about_stats,''), '4+ | Years Experience
10+ | Global Clients
50+ | Monthly Assets');