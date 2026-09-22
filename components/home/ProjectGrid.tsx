import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  category: string | null;
};

type ProjectGridProps = {
  projects: Project[];
};

export default function ProjectGrid({
  projects,
}: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="border-y border-white/10 py-12">
        <p className="text-sm text-white/30">
          Projects will appear here once they are
          added from the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {projects.map((project, index) => (
        <Link
          key={project.id}
          href={`/projects/${project.slug}`}
          className="public-project-card group relative block min-h-[360px] overflow-hidden rounded-[1.75rem] border p-7 transition-all duration-500 md:min-h-[400px] md:p-8"
        >
          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between">

            {/* Top */}
            <div className="flex items-start justify-between gap-5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {project.category && (
                  <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-white/40">
                    {project.category}
                  </p>
                )}
              </div>

              <div className="public-project-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300">
                <ArrowUpRight
                  size={17}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>
            </div>

            {/* Bottom */}
            <div>
              <h3 className="max-w-xl text-3xl font-medium leading-[1.02] tracking-[-0.045em] text-white md:text-4xl">
                {project.title}
              </h3>

              {project.short_description && (
                <p className="mt-5 max-w-xl text-sm leading-6 text-white/45">
                  {project.short_description}
                </p>
              )}

              <div className="mt-7 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white/25 transition-colors duration-300 group-hover:text-white/50">
                View project

                <ArrowUpRight
                  size={13}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </div>
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
}