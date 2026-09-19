import type { MetadataRoute } from "next";
import { supabaseServer } from "@/lib/supabase-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const { data: projects } = await supabaseServer
    .from("projects")
    .select("slug, updated_at")
    .eq("published", true)
    .order("sort_order", {
      ascending: true,
    });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];

  const projectPages: MetadataRoute.Sitemap =
    (projects || []).map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: project.updated_at
        ? new Date(project.updated_at)
        : new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [...staticPages, ...projectPages];
}