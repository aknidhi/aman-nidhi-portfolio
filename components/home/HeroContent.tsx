"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

type HeroSettings = {
  name: string | null;
  role: string | null;
  hero_badge: string | null;
  hero_title: string | null;
  hero_description: string | null;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
};

type HeroContentProps = {
  settings: HeroSettings;
};

export default function HeroContent({
  settings,
}: HeroContentProps) {
  const name = settings.name || "Aman Nidhi";
  const role = settings.role || "AI/ML Developer";

  const badge =
    settings.hero_badge ||
    "Available for opportunities";

  const title =
    settings.hero_title ||
    "Building intelligent systems with AI.";

  const description =
    settings.hero_description ||
    `I'm ${name} — an ${role} working across machine learning, data analytics and intelligent applications. I build practical digital products that turn data and AI into useful solutions.`;

  const email =
    settings.email || "aknidhi06@gmail.com";

  const github =
    settings.github_url ||
    "https://github.com/aknidhi";

  const linkedin =
    settings.linkedin_url ||
    "https://www.linkedin.com/in/aman-kumar-nidhi-484454209";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
    >
      {/* BADGE */}
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: 15,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
            },
          },
        }}
        className="mb-7 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-white/40 sm:mb-8 sm:text-xs sm:tracking-[0.2em]"
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-violet-400 shadow-[0_0_14px_rgba(167,139,250,0.9)]" />

        {badge}
      </motion.div>

      {/* TITLE */}
      <motion.h1
        variants={{
          hidden: {
            opacity: 0,
            y: 25,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              ease: "easeOut",
            },
          },
        }}
        className="max-w-5xl text-[clamp(48px,14vw,92px)] font-medium leading-[0.94] tracking-[-0.055em]"
      >
        {title}
      </motion.h1>

      {/* DESCRIPTION */}
      <motion.p
        variants={{
          hidden: {
            opacity: 0,
            y: 20,
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
        className="mt-7 max-w-2xl text-[15px] leading-7 text-white/50 sm:mt-8 sm:text-base sm:leading-7 md:text-lg"
      >
        {description}
      </motion.p>

      {/* BUTTONS */}
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: 20,
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
        className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4"
      >
        <Link
          href="/projects"
          className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 active:scale-[0.98]"
        >
          View my work

          <ArrowUpRight
            size={17}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>

        <Link
          href="/contact"
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-white active:scale-[0.98]"
        >
          Get in touch
        </Link>
      </motion.div>

      {/* SOCIAL LINKS */}
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: 15,
          },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.6,
              ease: "easeOut",
            },
          },
        }}
        className="mt-9 flex items-center gap-5 sm:mt-10"
      >
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/30 transition-colors hover:text-white"
        >
          GitHub
        </a>

        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/30 transition-colors hover:text-white"
        >
          LinkedIn
        </a>

        <a
          href={`mailto:${email}`}
          className="text-xs text-white/30 transition-colors hover:text-white"
        >
          Email
        </a>
      </motion.div>

      {/* NAME / ROLE - invisible to visual layout but useful for accessibility/context */}
      <span className="sr-only">
        {name} — {role}
      </span>
    </motion.div>
  );
}