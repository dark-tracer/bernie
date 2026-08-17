CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'UI/UX',
  client text NOT NULL DEFAULT '',
  image_url text,
  alt_text text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'published',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published projects" ON public.projects FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'Design',
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_url text,
  alt_text text NOT NULL DEFAULT '',
  read_time text NOT NULL DEFAULT '5 min read',
  published_on date NOT NULL DEFAULT current_date,
  featured boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read published posts" ON public.posts FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "admins manage posts" ON public.posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER posts_updated_at BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT '',
  quote text NOT NULL,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.site_settings (
  id boolean PRIMARY KEY DEFAULT true,
  full_name text NOT NULL DEFAULT 'Bernie Amponsah',
  tagline text NOT NULL DEFAULT 'UI/UX Designer & Brand Strategist',
  bio text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT 'bernieamponsah2@gmail.com',
  phone text NOT NULL DEFAULT '+233 50 260 5560',
  location text NOT NULL DEFAULT 'Accra, Ghana',
  availability_note text NOT NULL DEFAULT 'Available for remote work globally.',
  avatar_url text,
  linkedin_url text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  behance_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id)
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT 'General Inquiry',
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.submissions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can send a message" ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "admins read messages" ON public.submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update messages" ON public.submissions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete messages" ON public.submissions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (id, bio, avatar_url, linkedin_url, instagram_url, behance_url) VALUES (true,
 'Bernie Amponsah is a designer and brand strategist crafting high-contrast digital experiences that balance structural clarity with expressive detail.',
 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQvZJitmB6TGxomwCePMvBaHCXSWscnmpATa-xpbHwG4_v-Id16MYqSDTxwKQDc7CCFxNBF2BEBvsrwOZo7Siu_MKNTd3m3t4oFiYDcG2egSo94Z1cjglAf16bK6B25GUhXlC5mPX7fFSup6p_H2WU_jCtiTt41-ADR1cDeWKVq8CLOWhQSwp-8v9a5arwjQd2yVDWrhnjliMtlTJbWaRNTM5YWEqjS1wO8t7iOhL4Nzaarlb9S5-g',
 'https://www.linkedin.com/', '', '');

INSERT INTO public.projects (title, slug, category, client, image_url, alt_text, summary, content, sort_order) VALUES
('Fintech Nexus','fintech-nexus','UI/UX','Vertex Capital','https://lh3.googleusercontent.com/aida-public/AB6AXuABTsBvsmOtPok97cfzksQW52cdtp9xgWQLKc_MuekRz9y6z_WL3gmpQVCHuL9Nw91FbvhHXQpNrYeh5yxJxmYVLkZ1bI_0W2EcbZs3DYvBNyCcrX0n9DMV2bqrf8oJFEX24-RfRj_W22akL-vZDhLMdG07EhogW-P61Eam-Stvx_hOU3EqfIqIj4xW87kITFKI7umHn_rmVo4Xn1Na0KIMih-g6QwteOXMROcCvzutL3R_nvTM9TJy','Dark-mode mobile banking app interface with neon blue accents on a smartphone mockup','A dark-mode mobile banking experience built around clarity, speed and trust.','Vertex Capital needed a mobile banking product that felt calm rather than clinical. We rebuilt the information architecture around three core jobs — check balance, move money, understand spending — and layered a high-contrast dark interface on top.

The result was a 32% lift in weekly active usage and a measurable drop in support tickets about navigation.',1),
('Aura Roasters','aura-roasters','Branding','Aura Artisan','https://lh3.googleusercontent.com/aida-public/AB6AXuCLVqVSn0OHdfyAL_8GcjaXFPVmyxISoaWya-RzHpbHaCTYBI3EVFpC-Q3ICIdnCF93CCte7gKJttbSJENl9Bq0GSpl7E8uhIQRxl97ujqz54jti2HqqLia9rV42On6RWhBstyv4wsXWqiY6YVviojZM2SHwzR4C__lJp0zc2m9qQeHRdXv2NcCFdOTYleouC3-RSyZjECMIxOkdaDKfpEjTBoPYeivHwXmg2c-qAygRlXdRHRhFf3O','Artisanal coffee roastery brand identity with minimalist craft-paper packaging','A full identity system for an artisanal roastery, from mark to packaging.','Aura wanted packaging that felt handmade without looking rustic. The identity pairs a geometric monogram with warm craft substrates and a restrained type system that scales from bag to billboard.',2),
('LearnSphere','learnsphere','Educational','EdTech Innovations','https://lh3.googleusercontent.com/aida-public/AB6AXuDB9xBMgf70hg1H3Luvqxd8n3qqB7u-epS0EQVctsC3dAnta9zjoN8TUlOYX1bPnaZfvTrMbCMQxDjiabb8znZWnfdT6GfUTiiPAhQ1AlYeceU1AMZ_dMa8ntBv0Op_kQVptMUPO3G_as4h0M-reyrienFzAxx53umtuX80Fd-PT9EjJoFXadoQ6IlgKWDxWHfQvT9Q8-5bpp0h4Axr_2oNT6eSAstSkHbYetGRoTo7aBAvp_ubzpQN','Futuristic e-learning dashboard on a tablet with glowing data visualizations','An e-learning dashboard that turns progress data into motivation.','LearnSphere''s original dashboard buried progress in tables. We designed a visual learning path with clear next actions, weekly streaks and instructor insight panels.',3),
('Kinetic Identity','kinetic-identity','Motion','Synthwave Festival','https://lh3.googleusercontent.com/aida-public/AB6AXuAFt7XB8OrIC3E-ELeWw4ovuyiLpmkYQx7Jak8M5wZ0lT-FS0LDk3_sA2pmufBblfrZGscYTjg57Z8Caw3aRkoHiQ2Vxenl-6RUULt6w1ci_j4iDpE6-xdTFPhs-1kGwao0M00R6E94A3mNUSU8rEVwgJQPHFw8ECqwlBXsY2t_JA12EJl8tHhPXHffomVxavSqIQsb3Ngcf4KHqxBO6dSqZ6hLW-EBmeYxIWMZH39AXknS08fLoPbr','Abstract fluid 3D geometric motion graphics still in magenta and electric blue','A motion-first identity for a synthwave music festival.','Every touchpoint animates from the same fluid geometry: stage screens, socials, ticketing. A compact motion kit let the festival team produce on-brand assets without a designer in the loop.',4),
('Noir Campaign','noir-campaign','Social Media','Noir Apparel','https://lh3.googleusercontent.com/aida-public/AB6AXuCj8xKsCZFBJXIYvb_eH9EAt66vUl_351MSEJQHb4tec_6H94AV37RGYPvSOHBboWymmND3XSVaKwA9Ii06JnHOA82_NQY6SNr851leEv5iQ8lXmxegeGH0jy7twZ6lqPdmkza4_blql83TWgtEcSe0zGjuaW6hOEmOA1_Qhw8jRwMOEuBysYVrA0KDzW4EschOAUhXYKj1tsEZC7IlOmGQukkUVH7WBtcPj7p_HjU3q2ChLDHV_Y3L','Isometric grid of brutalist social media post designs for a fashion brand','A brutalist social campaign that tripled engagement for a fashion label.','A 30-day content system built on a strict grid, oversized type and product-first photography. Templates were handed over in a shared library so the in-house team could keep shipping.',5),
('Archis Space','archis-space','Web','Archis Studio','https://lh3.googleusercontent.com/aida-public/AB6AXuBu9CkxM5DNCzakH1vCHqNaUhwpuhMDsbmLEcrU0HeCRf-efT1z_9gYUKeK5wmjag5QOqmd2ieRuoSPe7eTebBg9GhxWkI1l_P31WDCYU11eIMpdMJ0oKuOBHpIuOYyxpd3Wp2Wo-3SdV_ZpktRbtXdHCIed1kIHA9PTgnbAgs73VQhVIPgksfMLMJEbXp12VbXHBK4Hy9B7lTxN4X5JN0mv5XfzQAUCZKsQsg7AeuIKZQ14Dze7NiV','Architectural portfolio website design shown on an ultra-wide desktop monitor','An architecture studio portfolio designed for ultra-wide displays.','Archis needed their work to breathe. The site uses full-bleed imagery, a fixed-fluid hybrid grid and a quiet type system so the architecture stays the loudest thing on the page.',6);

INSERT INTO public.posts (title, slug, category, excerpt, content, image_url, alt_text, read_time, published_on, featured) VALUES
('The Structural Integrity of High-Contrast Modernism','structural-integrity-high-contrast-modernism','Architecture','Why relying on tonal layering rather than heavy drop shadows creates a more resilient and authoritative visual hierarchy in complex enterprise applications.','Drop shadows are a shortcut. They imply depth without earning it, and in dense enterprise interfaces they quickly turn into visual noise.

Tonal layering asks more of you up front: you must decide what each surface *is* before you decide how it looks. Once that hierarchy exists, contrast alone communicates elevation — no blur radius required.

In practice this means defining a small set of surface tones, using them consistently, and reserving shadow for the two or three moments where something genuinely floats above the page.','https://lh3.googleusercontent.com/aida-public/AB6AXuBPC3HG_FllT8_1lL6YT26oGkwsQmcNDcEzssL5V01o1rAv0FgcrHwSZ2YrFt3pBnY5EHyes6YHEeEtqkdCTBVn-4boi8rokYFuy7Njc2o7emBhh0EpiGMsNVWyqWx0xK0FLTfGeOXX4K_8GCDbdlNYisodrr5aaHpXzcP7dcfKp_TR8SWrzjaNKZr-vRUb426a1cLGFWCPEseM4nHux3HkA5RCIIcpVp6sKjjLLR0tn8ZSN4UmqB8U','Abstract architectural rendering with sharp geometric structures in deep navy and electric blue','8 min read','2024-10-12',true),
('Mastering the Fixed-Fluid Hybrid Grid','fixed-fluid-hybrid-grid','Typography','A practical approach to grids that hold their rhythm from a phone to an ultra-wide monitor.','Pure fluid grids stretch type lines past readability. Pure fixed grids waste half a large display. The hybrid approach fixes the reading measure and lets the surrounding structure flex.

Set a max content width for prose, allow media and navigation to expand, and keep the gutter proportional. The rhythm survives every breakpoint.','https://lh3.googleusercontent.com/aida-public/AB6AXuARZjAbPGZ0LAPgt9S0KByRqmPunyeFyaXefjGyQcpK4V5eJ0lkFeR8mmwzSTbkwbX_glBb7c3soKYhp5IHyQ5-W1jdpI-n3kX0oKN9kTjyqWsmKDFtXejoVzBbaaorkpVnwrz86m2mP_pitNsDe4Hkxleb1q_ZqM4PSSRvNCjAxPVt6EfbES0x8aBlrMQ3jfPdIMePIx-W0s9FaSN7vApg0KemjGwGTnlgRwQmiQciJCBltQ3lbBz9','Typographic grid system layout study','5 min read','2024-09-28',false),
('Designing for Dark Space','designing-for-dark-space','UX Psychology','How aggressive whitespace in dark mode environments reduces cognitive load.','Dark interfaces amplify everything you put on them. A crowded dark layout feels heavier than the same layout on white, because every element glows against the background.

Give elements room. Increase spacing by roughly 15% over the light-mode equivalent, reduce the number of simultaneous accent colours, and let the background do the work of separating groups.',NULL,'','4 min read','2024-09-15',false),
('Glassmorphism Done Right','glassmorphism-done-right','Case Study','Restricting blur effects strictly to global navigation elements for impact.','Blur is expensive — for the GPU and for attention. Used everywhere it flattens hierarchy; used once it signals "this layer is always present".

The rule we settled on: glass belongs to persistent chrome only. Navigation bars, command palettes, and floating action surfaces. Everything else is solid.',NULL,'','6 min read','2024-08-30',false);

INSERT INTO public.testimonials (name, role, quote, image_url, sort_order) VALUES
('Elena Rostova','VP Product, Nexus AI','Bernie''s approach to UI design is nothing short of structural poetry. The balance of heavy whitespace and electric accents completely redefined our product''s identity, elevating it from a utility to an experience.','https://lh3.googleusercontent.com/aida-public/AB6AXuC5kHQOl_MDlUG5Fasv0enDVGoSlNQGO5uSoPvnYvjLLbzbWPSpaEil-z03sjiRHCASkMVDnIuBPTjcWUl9GoFBDEiwaleCgxc-03u2_ixcMd2hZrXO-bVzfUMUmtGO1qrJrtBRnTbu7zY3VaGrncLkH7R8gqQ9soDuS99_K_8uyltyEnqiwNJ3zK1rLsRfOR_dpuLwRHhEdhirfWBY6b3kJbdBm9hvih6ELPE4yyOdZQ3OSf_BNIDZ',1),
('Marcus Chen','Founder, SyncGrid','The transition to a Fixed-Fluid Hybrid Grid seemed risky, but the resulting readability and visual rhythm on both desktop and mobile were flawless. A true strategist.','https://lh3.googleusercontent.com/aida-public/AB6AXuBi5xw4i-Ff9e9aPhoVQbK5loQOGbLnN2Xwk_IxkXcOZTIOrXOiZtG-H8g_7y60S1Ii66hPC1un7zWAUqjZ89gvb8dZH9a4FTTWn94V_xWApKz17DCj_AFJGBBhYVBVoAF51yeVafbkyHDOwUHyYTGymZYf0hF-oEBxdfMIPmNWfIDK3HvQOrafNb2PM8Nz5Y1TjuP1R8Bneo-mkEVg4-YM2aXpJDS_jCC-LaIScspgCQhm3exgsWKX',2),
('Sarah Jenkins','Creative Director, Form & Function','We needed an authoritative digital presence. By utilizing Tonal Layering over heavy shadows, Bernie created a gallery-like atmosphere that put our core offerings center stage without distraction.','https://lh3.googleusercontent.com/aida-public/AB6AXuANoKltKjKwRHhtzO9oz5KmQoPn9Dj6CiCHl3kjRPAE9c_S0qThHoE7MLpNrR8WsE7Rha80YHRyh4N0Dj_mgMU8RQmV9S1eyvMy_c4qRB0rWwolaUoFGLj-1wAOXWwUgr32sDCC6BgUpsZhXr6SrRmLl9xaIwhg4XUSv6Eho3dzaHQ-CAdH2B-riAn0TzRxxRZHCHIT62wC0bWnee_xUqzyQ_46ZkXjKaQtALBu-CQwDlbBG-Vu9H9c',3);
