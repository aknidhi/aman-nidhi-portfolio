import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import HeroContent from "@/components/home/HeroContent";
import ProfileCard from "@/components/home/ProfileCard";
import AboutIntro from "@/components/home/AboutIntro";
import ProjectGrid from "@/components/home/ProjectGrid";
import Capabilities from "@/components/home/Capabilities";
import ContactCTA from "@/components/home/ContactCTA";

import { supabaseServer } from "@/lib/supabase-server";

type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  category: string;
};

type PortfolioSettings = {
  id: string;

  profile_image_path: string | null;
  profile_image_alt: string | null;

  name: string | null;
  role: string | null;
  location: string | null;

  profile_card_name: string | null;
  profile_card_role: string | null;
  profile_card_subtitle: string | null;

  hero_badge: string | null;
  hero_title: string | null;
  hero_description: string | null;

  about_text: string | null;

  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;

  resume_path: string | null;

  updated_at: string | null;
};


export default async function Home() {

  /* =========================================================
     LOAD PROJECTS + SETTINGS
  ========================================================= */

  const [
    { data: projectData },
    { data: settingsData },
  ] = await Promise.all([

    supabaseServer
      .from("projects")
      .select(
        "id, slug, title, short_description, category"
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
      .select("*")
      .limit(1)
      .maybeSingle(),

  ]);


  const projects: Project[] =
    projectData || [];


  /* =========================================================
     SAFE SETTINGS
  ========================================================= */

  const settings: PortfolioSettings = {

    id:
      settingsData?.id || "",

    profile_image_path:
      settingsData?.profile_image_path || null,

    profile_image_alt:
      settingsData?.profile_image_alt ||
      "Aman Nidhi",

    name:
      settingsData?.name ||
      "Aman Nidhi",

    role:
      settingsData?.role ||
      "AI/ML Developer",

    location:
      settingsData?.location ||
      "Haryana, India",

    profile_card_name:
      settingsData?.profile_card_name ||
      "AMAN NIDHI",

    profile_card_role:
      settingsData?.profile_card_role ||
      "AI/ML Developer",

    profile_card_subtitle:
      settingsData?.profile_card_subtitle ||
      "Data Analytics",

    hero_badge:
      settingsData?.hero_badge ||
      "Available for opportunities",

    hero_title:
      settingsData?.hero_title ||
      "Building intelligent systems with AI.",

    hero_description:
      settingsData?.hero_description ||
      `I'm Aman Nidhi — an AI/ML Developer working across machine learning, data analytics and intelligent applications. I build practical digital products that turn data and AI into useful solutions.`,

    about_text:
      settingsData?.about_text ||
      "I'm interested in building practical technology that solves real problems — combining artificial intelligence, machine learning and data analytics.",

    email:
      settingsData?.email ||
      "aknidhi06@gmail.com",

    github_url:
      settingsData?.github_url ||
      "https://github.com/aknidhi",

    linkedin_url:
      settingsData?.linkedin_url ||
      "https://www.linkedin.com/in/aman-kumar-nidhi-484454209",

    resume_path:
      settingsData?.resume_path ||
      "resume/Aman_Kumar_Nidhi_Resume.pdf",

    updated_at:
      settingsData?.updated_at ||
      null,
  };


  /* =========================================================
     PROFILE IMAGE
  ========================================================= */

  let profileImageUrl: string | null =
    null;

  if (settings.profile_image_path) {

    const {
      data: publicData,
    } =
      supabaseServer.storage
        .from("project-images")
        .getPublicUrl(
          settings.profile_image_path
        );

    profileImageUrl =
      publicData.publicUrl;
  }


  return (
    <main className="min-h-screen overflow-hidden bg-[#090909] text-white">

      <Navbar />


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative flex min-h-screen items-center overflow-hidden">

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:80px_80px]" />

        <div className="pointer-events-none absolute left-[55%] top-[35%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[140px]" />


        <div className="container relative z-10 pt-24">

          <div className="grid items-center gap-16 lg:grid-cols-[1fr_300px]">

            <HeroContent
              settings={{
                name: settings.name,
                role: settings.role,
                hero_badge: settings.hero_badge,
                hero_title: settings.hero_title,
                hero_description:
                  settings.hero_description,
                email: settings.email,
                github_url:
                  settings.github_url,
                linkedin_url:
                  settings.linkedin_url,
              }}
            />


            <div className="hidden lg:block">

              <ProfileCard
                imageUrl={profileImageUrl}
                imageAlt={
                  settings.profile_image_alt ||
                  "Aman Nidhi"
                }
                cardName={
                  settings.profile_card_name ||
                  "AMAN NIDHI"
                }
                cardRole={
                  settings.profile_card_role ||
                  "AI/ML Developer"
                }
                cardSubtitle={
                  settings.profile_card_subtitle ||
                  "Data Analytics"
                }
              />

            </div>

          </div>


          <div className="absolute bottom-10 left-0 hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-white/25 md:flex">

            Scroll to explore

            <ArrowDown size={14} />

          </div>

        </div>

      </section>


      {/* =====================================================
          ABOUT
      ===================================================== */}

      <AboutIntro
        aboutText={
          settings.about_text || ""
        }
      />


      {/* =====================================================
          SELECTED WORK
      ===================================================== */}

      <section className="border-t border-white/10 py-28">

        <div className="container">

          <div className="grid gap-12 md:grid-cols-[180px_1fr]">

            {/* SECTION LABEL */}

            <div className="pt-2">

              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Selected work
              </p>

            </div>


            {/* CONTENT */}

            <div>

              <div className="mb-14 flex items-end justify-between">

                <h2 className="text-4xl tracking-[-0.045em] md:text-6xl">
                  Things I&apos;ve built.
                </h2>


                <Link
                  href="/projects"
                  className="group hidden items-center gap-2 text-sm text-white/40 transition-colors hover:text-white sm:flex"
                >
                  View all

                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>

              </div>


              <ProjectGrid
                projects={projects}
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CAPABILITIES
      ===================================================== */}

      <Capabilities />


      {/* =====================================================
          CONTACT CTA
      ===================================================== */}

      <ContactCTA
        email={
          settings.email ||
          "aknidhi06@gmail.com"
        }
      />


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/10 py-8">

        <div className="container flex flex-col justify-between gap-4 text-sm text-white/30 sm:flex-row">

          <p>
            © 2026{" "}
            {settings.name ||
              "Aman Nidhi"}
          </p>


          <div className="flex gap-6">

            <a
              href={
                settings.github_url ||
                "https://github.com/aknidhi"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </a>


            <a
              href={
                settings.linkedin_url ||
                "https://www.linkedin.com/in/aman-kumar-nidhi-484454209"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              LinkedIn
            </a>


            <a
              href={`mailto:${
                settings.email ||
                "aknidhi06@gmail.com"
              }`}
              className="transition-colors hover:text-white"
            >
              Email
            </a>

          </div>

        </div>

      </footer>

    </main>
  );
}