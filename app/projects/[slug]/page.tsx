import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  year: string;
  github: string;
  live: string;
  technologies: string[];
  features: string[];
  problem: {
    title: string;
    description: string;
  };
  solution: {
    title: string;
    description: string;
  };
};

type ProjectImage = {
  id: string;
  storage_path: string;
  alt: string;
  sort_order: number;
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /* =========================================================
     LOAD PROJECT
  ========================================================= */

  const { data, error } = await supabaseServer
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    return (
      <main className="public-red-page min-h-screen overflow-x-hidden text-white">
        <Navbar />

        <div className="container relative z-10 pt-40">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back to projects
          </Link>

          <section className="py-24 md:py-36">
            <p className="text-xs uppercase tracking-[0.2em] text-white/35">
              Project not found
            </p>

            <h1 className="mt-5 text-5xl tracking-[-0.055em] md:text-7xl">
              Project not found.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/45">
              The project may have been removed or is
              not currently published.
            </p>
          </section>
        </div>
      </main>
    );
  }

  /* =========================================================
     LOAD PROJECT IMAGES
  ========================================================= */

  const { data: imageData } =
    await supabaseServer
      .from("project_images")
      .select(
        "id, storage_path, alt, sort_order"
      )
      .eq("project_id", data.id)
      .order("sort_order", {
        ascending: true,
      });

  const projectImages: ProjectImage[] =
    Array.isArray(imageData)
      ? imageData.map((image) => ({
          id: String(image.id),
          storage_path: String(
            image.storage_path
          ),
          alt: String(image.alt),
          sort_order: Number(
            image.sort_order ?? 0
          ),
        }))
      : [];

  /* =========================================================
     PROJECT DATA
  ========================================================= */

  const project: Project = {
    slug: String(data.slug),

    title: String(data.title),

    shortDescription: String(
      data.short_description || ""
    ),

    description: String(
      data.description || ""
    ),

    category: String(
      data.category || ""
    ),

    year: String(
      data.year || ""
    ),

    github: String(
      data.github || ""
    ),

    live: data.live
      ? String(data.live)
      : "",

    technologies:
      Array.isArray(data.technologies)
        ? data.technologies.map(
            (item: unknown) =>
              String(item)
          )
        : [],

    features:
      Array.isArray(data.features)
        ? data.features.map(
            (item: unknown) =>
              String(item)
          )
        : [],

    problem: {
      title: String(
        data.problem_title || ""
      ),

      description: String(
        data.problem_description || ""
      ),
    },

    solution: {
      title: String(
        data.solution_title || ""
      ),

      description: String(
        data.solution_description || ""
      ),
    },
  };

  /* =========================================================
     STORAGE URLS
  ========================================================= */

  const databaseImages =
    projectImages.map((image) => {
      const {
        data: { publicUrl },
      } = supabaseServer.storage
        .from("project-images")
        .getPublicUrl(
          image.storage_path
        );

      return {
        id: image.id,
        src: publicUrl,
        alt: image.alt,
        sortOrder: image.sort_order,
      };
    });

  return (
    <main className="public-red-page min-h-screen overflow-x-hidden text-white">
      <Navbar />

      <div className="container relative z-10 pb-24 pt-36 md:pb-32 md:pt-44">

        {/* =====================================================
            BACK
        ===================================================== */}

        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />

          Back to projects
        </Link>

        {/* =====================================================
            HERO
        ===================================================== */}

        <section className="mt-12 border-b border-white/10 pb-20 md:mt-16 md:pb-28">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                {project.category}
              </p>

              <p className="mt-4 text-xs text-white/20">
                {project.year}
              </p>
            </div>

            <div>
              <h1 className="max-w-6xl text-5xl font-medium leading-[0.93] tracking-[-0.06em] sm:text-7xl md:text-8xl">
                {project.title}
              </h1>

              <p className="mt-9 max-w-3xl text-lg leading-8 text-white/50 md:text-xl">
                {project.shortDescription}
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="public-red-button group inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-1"
                  >
                    GitHub

                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                )}

                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="public-red-outline group inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-black"
                  >
                    Live project

                    <ExternalLink
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROJECT IMAGES
        ===================================================== */}

        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Project preview
              </p>

              <p className="mt-4 text-xs text-white/20">
                01
              </p>
            </div>

            <div>
              {databaseImages.length === 0 ? (
                <div className="rounded-[2rem] border border-white/10 bg-black/20 p-8 md:p-12">
                  <p className="text-sm leading-7 text-white/40">
                    Project images will appear here
                    once they are added from the
                    project management dashboard.
                  </p>
                </div>
              ) : (
                <div className="space-y-14">
                  {databaseImages.map(
                    (image, index) => (
                      <div key={image.id}>
                        <div className="mb-5 flex items-center justify-between gap-5">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                              Screen{" "}
                              {String(
                                index + 1
                              ).padStart(2, "0")}
                            </p>

                            <h2 className="mt-2 text-xl tracking-[-0.03em] text-white/80">
                              {image.alt}
                            </h2>
                          </div>

                          <span className="text-xs text-white/15">
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="public-project-image-card group overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/30">
                          <img
                            src={image.src}
                            alt={image.alt}
                            loading={
                              index === 0
                                ? "eager"
                                : "lazy"
                            }
                            className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.015]"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            OVERVIEW
        ===================================================== */}

        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Overview
              </p>
            </div>

            <div>
              <p className="max-w-4xl text-2xl leading-[1.35] tracking-[-0.025em] text-white/75 md:text-4xl">
                {project.description}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            PROBLEM
        ===================================================== */}

        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                The problem
              </p>
            </div>

            <div>
              <h2 className="max-w-3xl text-3xl tracking-[-0.04em] md:text-5xl">
                {project.problem.title}
              </h2>

              <p className="mt-7 max-w-3xl text-base leading-8 text-white/45">
                {project.problem.description}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            SOLUTION
        ===================================================== */}

        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                The solution
              </p>
            </div>

            <div>
              <h2 className="max-w-3xl text-3xl tracking-[-0.04em] md:text-5xl">
                {project.solution.title}
              </h2>

              <p className="mt-7 max-w-3xl text-base leading-8 text-white/45">
                {project.solution.description}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ===================================================== */}

        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Key features
              </p>
            </div>

            <div>
              {project.features.length === 0 ? (
                <p className="text-sm text-white/40">
                  Features will be added soon.
                </p>
              ) : (
                <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 sm:grid-cols-2">
                  {project.features.map(
                    (feature, index) => (
                      <div
                        key={`${feature}-${index}`}
                        className="bg-black/30 p-7 md:p-9"
                      >
                        <span className="text-xs text-white/20">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        <h3 className="mt-8 text-xl tracking-[-0.03em] text-white/80">
                          {feature}
                        </h3>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            TECHNOLOGIES
        ===================================================== */}

        <section className="border-b border-white/10 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Technologies
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {project.technologies.length === 0 ? (
                <p className="text-sm text-white/40">
                  Technologies will be added soon.
                </p>
              ) : (
                project.technologies.map(
                  (technology, index) => (
                    <span
                      key={`${technology}-${index}`}
                      className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2.5 text-sm text-white/65 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                    >
                      {technology}
                    </span>
                  )
                )
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}

        <section className="py-28 md:py-36">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                More work
              </p>

              <h2 className="mt-5 max-w-3xl text-4xl leading-[0.95] tracking-[-0.05em] md:text-6xl">
                Explore more of
                <br />
                <span className="text-white/35">
                  my work.
                </span>
              </h2>
            </div>

            <Link
              href="/projects"
              className="public-red-button group inline-flex w-fit items-center gap-3 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-1"
            >
              View all projects

              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}