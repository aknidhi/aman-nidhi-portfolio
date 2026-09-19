"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/home/ProjectCard";

type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: string;
};

type ProjectGridProps = {
  projects: Project[];
};

export default function ProjectGrid({
  projects,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-[#101010] p-8 text-sm text-white/35 sm:rounded-[2rem] sm:p-10">
        No published projects yet.
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: true,
        amount: 0.12,
      }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className="grid gap-4 sm:gap-5 md:grid-cols-2"
    >
      {projects.slice(0, 4).map((project, index) => (
        <motion.div
          key={project.id}
          variants={{
            hidden: {
              opacity: 0,
              y: 35,
            },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.7,
                ease: "easeOut",
              },
            },
          }}
          className="min-w-0"
        >
          <ProjectCard
            number={String(index + 1).padStart(2, "0")}
            title={project.title}
            category={project.category}
            description={project.short_description}
            slug={project.slug}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}