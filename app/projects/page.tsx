import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { supabaseServer } from "@/lib/supabase-server";
import ProjectList from "@/components/projects/ProjectList";

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

type PortfolioSettings = {
  name: string | null;
  role: string | null;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
};

export default async function ProjectsPage() {
  const [
    { data, error },
    { data: settingsData },
  ] = await Promise.all([
    supabaseServer
      .from("projects")
      .select(
        `
          id,
          slug,
          title,
          short_description,
          description,
          category,
          year,
          github,
          live,
          technologies,
          features
        `
      )
      .eq("published", true)
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      }),

    supabaseServer
      .from("portfolio_settings")
      .select(
        "name, role, email, github_url, linkedin_url"
      )
      .limit(1)
      .maybeSingle(),
  ]);

  const projects: Project[] = data || [];

  const settings: PortfolioSettings = {
    name:
      settingsData?.name ||
      "Aman Nidhi",

    role:
      settingsData?.role ||
      "AI/ML Developer",

    email:
      settingsData?.email ||
      "aknidhi06@gmail.com",

    github_url:
      settingsData?.github_url ||
      "https://github.com/aknidhi",

    linkedin_url:
      settingsData?.linkedin_url ||
      "https://www.linkedin.com/in/aman-kumar-nidhi-484454209",
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#090909] text-white">
      {/* =========================================================
          HEADER
      ========================================================= */}

      <header className="border-b border-white/10">
        <div className="container">
          <div className="flex min-h-[72px] items-center justify-between">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-xs text-white/40 transition-colors duration-300 hover:text-white"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              Back home
            </Link>

            <Link
              href="/"
              className="text-sm font-semibold tracking-[0.18em]"
            >
              {settings.name?.toUpperCase() || "AMAN"}
              <span className="text-white/40">.</span>
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="border-b border-white/10 py-24 sm:py-28 md:py-36">
        <div className="container">
          <div className="max-w-5xl">
            <p className="mb-7 text-[10px] uppercase tracking-[0.18em] text-white/30 sm:mb-8 sm:text-xs sm:tracking-[0.2em]">
              Selected work
            </p>

            <h1 className="text-[clamp(48px,12vw,92px)] font-medium leading-[0.94] tracking-[-0.055em]">
              Things I&apos;ve
              <br />
              built.
            </h1>

            <p className="mt-8 max-w-2xl text-[15px] leading-7 text-white/45 sm:mt-10 sm:text-lg sm:leading-8">
              A collection of projects where I&apos;ve
              explored AI, machine learning, data analytics
              and software development to build practical
              solutions.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROJECT LIST
      ========================================================= */}

      <section className="py-20 sm:py-24 md:py-28">
        <div className="container">
          {error ? (
            <div className="rounded-[1.75rem] border border-red-400/20 bg-red-400/[0.03] p-7 sm:rounded-[2rem] sm:p-10">
              <p className="text-sm text-red-300/70">
                Unable to load projects right now.
              </p>

              <p className="mt-2 text-xs leading-6 text-white/30">
                Please refresh the page and try again.
              </p>
            </div>
          ) : (
            <ProjectList projects={projects} />
          )}
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="border-t border-white/10 py-24 sm:py-28">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-[180px_1fr]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs sm:tracking-[0.2em]">
              Contact
            </p>

            <div>
              <h2 className="max-w-4xl text-[clamp(36px,9vw,60px)] leading-[1.03] tracking-[-0.045em] text-white/80">
                Have an idea or project?
                <span className="text-white/35">
                  {" "}
                  Let&apos;s build it.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-white/40">
                I&apos;m open to interesting projects,
                collaborations and opportunities involving
                AI, machine learning, data and software.
              </p>

              <Link
                href="/contact"
                className="group mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white hover:text-black active:scale-[0.98]"
              >
                Start a conversation

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/10 py-10">
        <div className="container">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-white/70">
                {settings.name}
              </p>

              <p className="mt-2 text-xs text-white/30">
                {settings.role}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <a
                href={settings.github_url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 transition-colors hover:text-white"
              >
                GitHub
              </a>

              <a
                href={settings.linkedin_url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 transition-colors hover:text-white"
              >
                LinkedIn
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="text-xs text-white/30 transition-colors hover:text-white"
              >
                Email
              </a>

              <Link
                href="/contact"
                className="text-xs text-white/30 transition-colors hover:text-white"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/20 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()}{" "}
              {settings.name}. All rights reserved.
            </p>

            <p>Built with Next.js</p>
          </div>
        </div>
      </footer>
    </main>
  );
}