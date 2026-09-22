import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  category: string | null;
  year: string | null;
  technologies: string[] | null;
};

export default async function ProjectsPage() {
  const { data, error } = await supabaseServer
    .from("projects")
    .select(
      "id, slug, title, short_description, category, year, technologies"
    )
    .eq("published", true)
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  const projects: Project[] = data || [];

  return (
    <main className="public-red-page min-h-screen overflow-x-hidden text-white">

      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden pb-24 pt-40 md:pb-32">
        <div className="container relative z-10">

          <Link
            href="/"
            className="group mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back home
          </Link>

          <div className="grid gap-12 md:grid-cols-[180px_1fr]">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Selected work
              </p>

              <span className="mt-4 block text-xs text-white/20">
                01
              </span>
            </div>

            <div>
              <h1 className="max-w-5xl text-5xl font-medium leading-[0.94] tracking-[-0.055em] sm:text-7xl md:text-8xl">
                Things I&apos;ve
                <br />
                <span className="text-white/40">
                  built.
                </span>
              </h1>

              <p className="mt-10 max-w-2xl text-base leading-7 text-white/50 md:text-lg md:leading-8">
                A collection of projects across AI,
                machine learning, data analytics and
                intelligent applications.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          PROJECT LIST
      ===================================================== */}

      <section className="border-t border-white/10 py-20 md:py-28">
        <div className="container">

          <div className="grid gap-12 md:grid-cols-[180px_1fr]">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Portfolio
              </p>

              <span className="mt-4 block text-xs text-white/20">
                {String(projects.length).padStart(
                  2,
                  "0"
                )}
              </span>
            </div>

            <div>

              {error ? (
                <div className="public-project-card rounded-[1.5rem] p-8">
                  <p className="text-sm text-white/50">
                    Projects could not be loaded right now.
                  </p>
                </div>
              ) : projects.length === 0 ? (
                <div className="public-project-card rounded-[1.5rem] p-8">
                  <p className="text-sm text-white/40">
                    No published projects yet.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5">
                  {projects.map(
                    (project, index) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="public-project-card group block rounded-[1.75rem] p-7 md:p-9"
                      >
                        <div className="relative z-10 grid gap-7 md:grid-cols-[70px_1fr_auto] md:items-start">

                          {/* Number */}
                          <span className="text-xs text-white/20">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          {/* Main */}
                          <div>

                            <div className="flex flex-wrap items-center gap-3">

                              {project.category && (
                                <span className="text-[10px] uppercase tracking-[0.18em] text-white/35">
                                  {project.category}
                                </span>
                              )}

                              {project.year && (
                                <span className="text-[10px] uppercase tracking-[0.18em] text-white/20">
                                  {project.year}
                                </span>
                              )}

                            </div>

                            <h2 className="mt-3 text-3xl tracking-[-0.04em] text-white/90 transition-colors duration-300 group-hover:text-white md:text-4xl">
                              {project.title}
                            </h2>

                            {project.short_description && (
                              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40">
                                {project.short_description}
                              </p>
                            )}

                            {project.technologies &&
                              project.technologies.length >
                                0 && (
                                <div className="mt-5 flex flex-wrap gap-2">
                                  {project.technologies
                                    .slice(0, 5)
                                    .map(
                                      (
                                        technology
                                      ) => (
                                        <span
                                          key={
                                            technology
                                          }
                                          className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-[10px] uppercase tracking-[0.12em] text-white/35 transition-all duration-300 group-hover:border-white/15 group-hover:text-white/50"
                                        >
                                          {
                                            technology
                                          }
                                        </span>
                                      )
                                    )}
                                </div>
                              )}

                          </div>

                          {/* Arrow */}
                          <div className="flex items-center justify-between md:justify-end">
                            <span className="text-[10px] uppercase tracking-[0.15em] text-white/20 md:hidden">
                              View project
                            </span>

                            <div className="public-project-icon flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300">
                              <ArrowUpRight
                                size={17}
                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              />
                            </div>
                          </div>

                        </div>
                      </Link>
                    )
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="border-t border-white/10 py-28 md:py-36">
        <div className="container">

          <div className="grid gap-12 md:grid-cols-[180px_1fr]">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Next
              </p>
            </div>

            <div>
              <h2 className="max-w-4xl text-4xl leading-[0.95] tracking-[-0.05em] md:text-6xl">
                Have something
                <br />
                <span className="text-white/35">
                  interesting in mind?
                </span>
              </h2>

              <Link
                href="/contact"
                className="public-red-button group mt-10 inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-1"
              >
                Get in touch

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/10 py-8">
        <div className="container flex flex-col justify-between gap-4 text-xs text-white/30 sm:flex-row">

          <p>
            © 2026 Aman Nidhi.
          </p>

          <div className="flex gap-5">
            <Link
              href="/about"
              className="transition-colors hover:text-white"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="transition-colors hover:text-white"
            >
              Contact
            </Link>
          </div>

        </div>
      </footer>

    </main>
  );
}