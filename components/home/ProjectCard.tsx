import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ProjectCardProps = {
  number: string;
  title: string;
  category: string;
  description: string;
  slug: string;
};

export default function ProjectCard({
  number,
  title,
  category,
  description,
  slug,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${slug}`}
      className="group relative block min-h-[360px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#101010] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 active:scale-[0.99] sm:min-h-[400px] sm:rounded-[2rem] sm:p-7 md:min-h-[430px]"
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(167,139,250,0.13),transparent_38%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      {/* Subtle bottom gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col justify-between">
        {/* Top */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/25">
            {number}
          </span>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white group-hover:text-black">
            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </div>
        </div>

        {/* Content */}
        <div className="mt-12">
          <p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs">
            {category}
          </p>

          <h3 className="max-w-xl break-words text-[30px] leading-[1.05] tracking-[-0.04em] text-white sm:text-3xl md:text-4xl">
            {title}
          </h3>

          <p className="mt-4 max-w-lg text-[13px] leading-6 text-white/40 sm:text-sm">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}