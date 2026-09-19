"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string | null;
  category: string;
  year: string | number | null;
  github: string | null;
  live: string | null;
  technologies: string[] | null;
  features: string[] | null;
};

type ProjectListProps = {
  projects: Project[];
};

export default function ProjectList({
  projects,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-8 sm:rounded-[2rem] sm:p-10">
        <p className="text-sm text-white/50">
          No published projects yet.
        </p>

        <p className="mt-2 text-xs leading-6 text-white/25">
          Published projects from the admin dashboard will
          appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.7,
            delay: Math.min(index * 0.05, 0.2),
          }}
        >
          <Link
            href={`/projects/${project.slug}`}
            className="group relative block overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101010] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 sm:rounded-[2rem] sm:p-8 md:p-10"
          >
            {/* HOVER GLOW */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(167,139,250,0.12),transparent_35%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative">
              {/* TOP ROW */}
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {project.year && (
                    <span className="text-xs text-white/25">
                      {project.year}
                    </span>
                  )}
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/35 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight
                    size={17}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </div>
              </div>

              {/* CONTENT */}
              <div className="mt-12 grid gap-8 md:grid-cols-[1fr_280px] md:gap-12">
                <div>
                  <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
                    {project.category}
                  </p>

                  <h2 className="max-w-3xl break-words text-[clamp(32px,6vw,56px)] leading-[1] tracking-[-0.045em] text-white/90">
                    {project.title}
                  </h2>

                  <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
                    {project.short_description}
                  </p>
                </div>

                {/* TECHNOLOGIES */}
                <div className="md:pt-2">
                  <p className="mb-4 text-[10px] uppercase tracking-[0.18em] text-white/25">
                    Technologies
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(project.technologies || [])
                      .slice(0, 8)
                      .map((technology) => (
                        <span
                          key={technology}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/35 transition-colors duration-300 group-hover:border-white/15 group-hover:text-white/50"
                        >
                          {technology}
                        </span>
                      ))}
                  </div>
                </div>
              </div>

              {/* BOTTOM */}
              <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-white/25">
                  View case study
                </span>

                <div className="flex flex-wrap gap-4">
                  {project.github && (
                    <span
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        window.open(
                          project.github!,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className="cursor-pointer text-xs text-white/30 transition-colors hover:text-white"
                    >
                      GitHub ↗
                    </span>
                  )}

                  {project.live && (
                    <span
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        window.open(
                          project.live!,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
                      className="cursor-pointer text-xs text-white/30 transition-colors hover:text-white"
                    >
                      Live demo ↗
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}