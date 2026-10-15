import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { publicDb, check } from "./public-db.server";

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const db = await publicDb();
  return check("site_settings", await db.from("site_settings").select("*").maybeSingle());
});

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const db = await publicDb();
  const data = check(
    "projects list",
    await db.from("projects").select("*").eq("status", "published").order("sort_order", { ascending: true }),
  );
  return data ?? [];
});

export const getProject = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().max(200) }).parse(input))
  .handler(async ({ data }) => {
    const db = await publicDb();
    const project = check(
      "project by slug",
      await db.from("projects").select("*").eq("slug", data.slug).eq("status", "published").maybeSingle(),
    );
    const more = check(
      "more projects",
      await db
        .from("projects")
        .select("title, slug, category, image_url, alt_text")
        .eq("status", "published")
        .neq("slug", data.slug)
        .order("sort_order", { ascending: true })
        .limit(3),
    );
    return { project, more: more ?? [] };
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const db = await publicDb();
  const data = check(
    "posts list",
    await db.from("posts").select("*").eq("status", "published").order("published_on", { ascending: false }),
  );
  return data ?? [];
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().max(200) }).parse(input))
  .handler(async ({ data }) => {
    const db = await publicDb();
    return check(
      "post by slug",
      await db.from("posts").select("*").eq("slug", data.slug).eq("status", "published").maybeSingle(),
    );
  });

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const db = await publicDb();
  const data = check(
    "testimonials list",
    await db.from("testimonials").select("*").order("sort_order", { ascending: true }),
  );
  return data ?? [];
});

const submissionSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(5000),
});

export const sendMessage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => submissionSchema.parse(input))
  .handler(async ({ data }) => {
    const db = await publicDb();
    const { error } = await db.from("submissions").insert(data);
    if (error) {
      console.error(new Error(`Database insert failed (submissions): ${error.message}`));
      throw new Error("Your message could not be sent. Please try again.");
    }
    return { ok: true as const };
  });
