import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { publicDb } from "./public-db.server";

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicDb().from("site_settings").select("*").maybeSingle();
  return data;
});

export const listProjects = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicDb()
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getProject = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().max(200) }).parse(input))
  .handler(async ({ data }) => {
    const db = publicDb();
    const { data: project } = await db
      .from("projects")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    const { data: more } = await db
      .from("projects")
      .select("title, slug, category, image_url, alt_text")
      .eq("status", "published")
      .neq("slug", data.slug)
      .order("sort_order", { ascending: true })
      .limit(3);
    return { project, more: more ?? [] };
  });

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicDb()
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_on", { ascending: false });
  return data ?? [];
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().max(200) }).parse(input))
  .handler(async ({ data }) => {
    const { data: post } = await publicDb()
      .from("posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    return post;
  });

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicDb()
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
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
    const { error } = await publicDb().from("submissions").insert(data);
    if (error) throw new Error("Your message could not be sent. Please try again.");
    return { ok: true as const };
  });
