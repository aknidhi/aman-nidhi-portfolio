import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  category: string | null;
  published: boolean;
  sort_order: number;
};

type Education = {
  id: string;
  institution: string;
  degree: string;
  specialization: string | null;
  start_year: string;
  end_year: string | null;
  status: string | null;
  grade: string | null;
  description: string | null;
  sort_order: number;
  published: boolean;
};

type SpeakingLanguage = {
  id: string;
  name: string;
  fluency: string | null;
  sort_order: number;
  published: boolean;
};

type Certification = {
  id: string;
  title: string;
  organization: string | null;
  issue_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  sort_order: number;
  published: boolean;
};

type PortfolioSettings = {
  id: string;

  profile_image_path: string | null;
  profile_image_alt: string | null;

  name: string | null;
  role: string | null;
  location: string | null;

  about_text: string | null;
  about_intro: string | null;
  about_description: string | null;
  about_languages: string | null;
  about_current_focus: string | null;

  about_page_title: string | null;
  about_page_description: string | null;

  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;

  resume_path: string | null;

  updated_at: string | null;
};

export default async function AboutPage() {
  const [
    { data: education },
    { data: certifications },
    { data: projects },
    { data: speakingLanguageData },
    { data: settingsData },
  ] = await Promise.all([
    supabaseServer
      .from("education")
      .select(
        "id, institution, degree, specialization, start_year, end_year, status, grade, description, sort_order, published"
      )
      .eq("published", true)
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      }),

    supabaseServer
      .from("certifications")
      .select(
        "id, title, organization, issue_date, credential_id, credential_url, description, sort_order, published"
      )
      .eq("published", true)
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      }),

    supabaseServer
      .from("projects")
      .select(
        "id, slug, title, short_description, category, published, sort_order"
      )
      .eq("published", true)
      .order("sort_order", {
        ascending: true,
      }),

    supabaseServer
      .from("portfolio_skills")
      .select("id, name, fluency, sort_order, published")
      .eq("category", "Speaking Languages")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),

    supabaseServer
      .from("portfolio_settings")
      .select(
        "id, profile_image_path, profile_image_alt, name, role, location, about_text, about_intro, about_description, about_languages, about_current_focus, about_page_title, about_page_description, email, github_url, linkedin_url, resume_path, updated_at"
      )
      .limit(1)
      .maybeSingle(),
  ]);

  const educationList: Education[] = education || [];

  const certificationList: Certification[] =
    certifications || [];

  const projectList: Project[] = projects || [];

  const speakingLanguages: SpeakingLanguage[] =
    speakingLanguageData || [];

  const settings: PortfolioSettings = {
    id: settingsData?.id || "",

    profile_image_path:
      settingsData?.profile_image_path || null,

    profile_image_alt:
      settingsData?.profile_image_alt || "Aman Nidhi",

    name:
      settingsData?.name ||
      "Aman Nidhi",

    role:
      settingsData?.role ||
      "AI/ML Developer",

    location:
      settingsData?.location ||
      "Haryana, India",

    about_text:
      settingsData?.about_text ||
      "",

    about_intro:
      settingsData?.about_intro ||
      "My interests sit at the intersection of artificial intelligence, machine learning, software and data.",

    about_description:
      settingsData?.about_description ||
      "I like understanding a problem, exploring possible solutions and then building a working system around it. Projects are a major part of my learning process, especially when they allow me to combine AI, automation and data analytics.",

    about_languages:
      settingsData?.about_languages ||
      "Hindi · English",

    about_current_focus:
      settingsData?.about_current_focus ||
      "AI/ML · Agentic AI · Data Analytics",

    about_page_title:
      settingsData?.about_page_title ||
      "Building with curiosity.",

    about_page_description:
      settingsData?.about_page_description ||
      "I'm Aman Nidhi, an AI/ML Developer working across machine learning, data analytics and intelligent applications. I enjoy turning ideas, data and technology into practical digital products.",

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

  const resumeUrl =
    settings.resume_path
      ? `/${settings.resume_path.replace(/^\/+/, "")}`
      : "/resume/Aman_Kumar_Nidhi_Resume.pdf";

  let profileImageUrl: string | null = null;

  if (settings.profile_image_path) {
    const { data: publicData } = supabaseServer.storage
      .from("project-images")
      .getPublicUrl(settings.profile_image_path);

    profileImageUrl = publicData.publicUrl;
  }

  return (
    <main className="public-red-page min-h-screen">
      <Navbar />

      {/* =========================================================
          PAGE INTRO
      ========================================================= */}

      <section className="relative overflow-hidden pb-24 pt-40">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <div className="pointer-events-none absolute right-[10%] top-[25%] h-[400px] w-[400px] rounded-full bg-[#A52A2D]/[0.10] blur-[130px]" />

        <div className="container relative z-10">
          <div className="mb-12">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#FFFFFF] transition-colors hover:text-white"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />

              Back home
            </Link>
          </div>

          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#FFFFFF]">
                About me
              </p>

              <span className="mt-4 block text-xs text-[#FFFFFF]/55">
                01
              </span>
            </div>

            <div>
              <h1 className="max-w-5xl text-5xl font-medium leading-[0.95] tracking-[-0.055em] sm:text-7xl md:text-8xl">
                {settings.about_page_title}
              </h1>

              <p className="mt-10 max-w-3xl text-lg leading-8 text-[#FFFFFF]/80">
                {settings.about_page_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          INTRODUCTION
      ========================================================= */}

      <section className="border-t border-[#2A1717] py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#FFFFFF]">
                Introduction
              </p>

              <span className="mt-4 block text-xs text-[#FFFFFF]/55">
                02
              </span>
            </div>

            <div className="grid gap-10 lg:grid-cols-[1fr_220px] lg:items-start">
              <div className="max-w-4xl">
                <p className="text-2xl leading-[1.35] tracking-[-0.025em] text-[#FFFFFF]/80 md:text-4xl">
                  {settings.about_intro}
                </p>

                <p className="mt-8 max-w-3xl text-base leading-7 text-[#FFFFFF]/75">
                  {settings.about_description}
                </p>
              </div>

              {profileImageUrl && (
                <div className="lg:justify-self-end">
                  <div className="public-profile-cinematic relative overflow-hidden rounded-[1.5rem] border border-[#A52A2D]/25 bg-[#0A0707]">
                    <img
                      src={profileImageUrl}
                      alt={
                        settings.profile_image_alt ||
                        settings.name ||
                        "Aman Nidhi"
                      }
                      className="h-[260px] w-[220px] object-cover object-center"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    <div className="public-profile-light" />
                    <div className="public-profile-border rounded-[1.5rem]" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          EDUCATION
      ========================================================= */}

      <section className="border-t border-[#2A1717] py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#FFFFFF]">
                Education
              </p>

              <span className="mt-4 block text-xs text-[#FFFFFF]/55">
                03
              </span>
            </div>

            <div className="space-y-5">
              {educationList.length === 0 ? (
                <div className="rounded-[2rem] border border-[#2A1717] bg-[#0D0A0A] p-7 md:p-10">
                  <p className="text-sm text-[#FFFFFF]/75">
                    Education information
                    will be added soon.
                  </p>
                </div>
              ) : (
                educationList.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[2rem] border border-[#2A1717] bg-[#0D0A0A] p-7 md:p-10"
                  >
                    <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[#FFFFFF]">
                          {item.institution}
                        </p>

                        <h2 className="mt-4 text-3xl tracking-[-0.04em] md:text-4xl">
                          {item.degree}

                          {item.specialization
                            ? ` in ${item.specialization}`
                            : ""}
                        </h2>

                        <p className="mt-4 text-sm leading-6 text-[#FFFFFF]/80">
                          {item.institution}
                        </p>

                        {item.description && (
                          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#FFFFFF]">
                            {item.description}
                          </p>
                        )}

                        {item.grade && (
                          <p className="mt-4 text-xs uppercase tracking-[0.15em] text-[#FFFFFF]/80">
                            {item.grade}
                          </p>
                        )}
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-sm text-[#FFFFFF]/90">
                          {item.start_year}
                          {" — "}
                          {item.end_year ||
                            "Present"}
                        </p>

                        {item.status && (
                          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-[#FFFFFF]/80">
                            {item.status}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CERTIFICATIONS
      ========================================================= */}

      <section className="border-t border-[#2A1717] py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#FFFFFF]">
                Certifications
              </p>

              <span className="mt-4 block text-xs text-[#FFFFFF]/55">
                04
              </span>
            </div>

            <div className="space-y-5">
              {certificationList.length === 0 ? (
                <div className="rounded-[2rem] border border-[#2A1717] bg-[#0D0A0A] p-7 md:p-10">
                  <p className="text-sm text-[#FFFFFF]/75">
                    Certifications will be added soon.
                  </p>
                </div>
              ) : (
                certificationList.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[2rem] border border-[#2A1717] bg-[#0D0A0A] p-7 md:p-10"
                  >
                    <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-3xl">
                        <p className="text-xs uppercase tracking-[0.18em] text-[#FFFFFF]">
                          {item.organization ||
                            "Certification"}
                        </p>

                        <h2 className="mt-4 text-2xl tracking-[-0.04em] md:text-3xl">
                          {item.title}
                        </h2>

                        {item.description && (
                          <p className="mt-5 text-sm leading-7 text-[#FFFFFF]">
                            {item.description}
                          </p>
                        )}

                        {item.credential_id && (
                          <p className="mt-5 text-xs uppercase tracking-[0.12em] text-[#FFFFFF]/80">
                            Credential ID ·{" "}
                            {item.credential_id}
                          </p>
                        )}

                        {item.credential_url && (
                          <a
                            href={item.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group mt-6 inline-flex items-center gap-2 text-sm text-[#FFFFFF]/85 transition-colors hover:text-white"
                          >
                            View credential

                            <ArrowUpRight
                              size={15}
                              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            />
                          </a>
                        )}
                      </div>

                      {item.issue_date && (
                        <div className="text-left md:text-right">
                          <p className="text-sm text-[#FFFFFF]/90">
                            {item.issue_date}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PROJECTS
      ========================================================= */}

      <section className="border-t border-[#2A1717] py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#FFFFFF]">
                Projects
              </p>

              <span className="mt-4 block text-xs text-[#FFFFFF]/55">
                05
              </span>
            </div>

            <div>
              <h2 className="max-w-3xl text-3xl tracking-[-0.04em] md:text-5xl">
                Learning by building.
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-7 text-[#FFFFFF]/75">
                My projects let me explore new
                technologies and turn ideas
                into working systems.
              </p>

              {projectList.length === 0 ? (
                <div className="mt-8 rounded-[1.5rem] border border-[#2A1717] bg-[#0D0A0A] p-7">
                  <p className="text-sm text-[#FFFFFF]/75">
                    Projects will be added soon.
                  </p>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {projectList.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.slug}`}
                      className="group block rounded-[1.5rem] border border-[#2A1717] bg-[#0D0A0A] p-6 transition-all duration-300 hover:border-white/20 hover:bg-[#120C0C]"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          {project.category && (
                            <p className="text-xs uppercase tracking-[0.15em] text-[#FFFFFF]/80">
                              {project.category}
                            </p>
                          )}

                          <h3 className="mt-2 text-xl tracking-[-0.03em] text-[#FFFFFF]/90 transition-colors group-hover:text-white">
                            {project.title}
                          </h3>

                          {project.short_description && (
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#FFFFFF]/75">
                              {project.short_description}
                            </p>
                          )}
                        </div>

                        <ArrowUpRight
                          size={18}
                          className="shrink-0 text-[#FFFFFF]/80 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href="/projects"
                className="group mt-8 inline-flex items-center gap-2 text-sm text-[#FFFFFF]/80 transition-colors hover:text-white"
              >
                Explore all projects

                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <section className="border-t border-[#2A1717] py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#FFFFFF]">
                Background
              </p>

              <span className="mt-4 block text-xs text-[#FFFFFF]/55">
                06
              </span>
            </div>

            <div className="space-y-10">
              {/* EDUCATION */}
              <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#FFFFFF]">
                      Education
                    </p>

                    <p className="mt-2 text-sm text-[#FFFFFF]/80">
                      Academic background
                    </p>
                  </div>

                  {educationList.length > 0 && (
                    <span className="text-xs text-white/20">
                      {educationList.length}{" "}
                      {educationList.length === 1
                        ? "entry"
                        : "entries"}
                    </span>
                  )}
                </div>

                {educationList.length === 0 ? (
                  <div className="rounded-2xl border border-[#2A1717] bg-[#0D0A0A] px-5 py-6">
                    <p className="text-sm text-[#FFFFFF]/75">
                      Education information will be added soon.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-[#2A1717] bg-[#0D0A0A]">
                    <div className="divide-y divide-white/10">
                      {educationList.map((item) => (
                        <div
                          key={item.id}
                          className="px-5 py-5 sm:px-6 sm:py-6"
                        >
                          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <h2 className="text-lg tracking-[-0.025em] text-white/85 sm:text-xl">
                                  {item.degree}
                                  {item.specialization
                                    ? ` · ${item.specialization}`
                                    : ""}
                                </h2>

                                {item.status && (
                                  <span className="rounded-full border border-[#2A1717] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#FFFFFF]">
                                    {item.status}
                                  </span>
                                )}
                              </div>

                              <p className="mt-2 text-sm text-[#FFFFFF]/85">
                                {item.institution}
                              </p>

                              {item.grade && (
                                <p className="mt-2 text-xs text-[#FFFFFF]/80">
                                  {item.grade}
                                </p>
                              )}

                              {item.description && (
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#FFFFFF]">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            <p className="text-xs text-[#FFFFFF] md:pt-1 md:text-right">
                              {item.start_year}
                              {" — "}
                              {item.end_year || "Present"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* LANGUAGES + CURRENT FOCUS */}
              <div className="grid gap-px overflow-hidden rounded-2xl border border-[#2A1717] bg-white/10 md:grid-cols-2">
                <div className="bg-[#0D0A0A] p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-[#FFFFFF]/80">
                    Languages
                  </p>

                  {speakingLanguages.length > 0 ? (
                    <div className="mt-4 space-y-3">
                      {speakingLanguages.map((language) => (
                        <div
                          key={language.id}
                          className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                        >
                          <p className="text-sm text-[#FFFFFF]/80">
                            {language.name}
                          </p>

                          {language.fluency && (
                            <p className="text-xs text-[#FFFFFF]/80">
                              {language.fluency}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-[#FFFFFF]/85">
                      {settings.about_languages ||
                        "Not added yet"}
                    </p>
                  )}
                </div>

                <div className="bg-[#0D0A0A] p-5 sm:p-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-[#FFFFFF]/80">
                    Current focus
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(settings.about_current_focus ||
                      "AI/ML · Agentic AI · Data Analytics")
                      .split("·")
                      .map((item) => item.trim())
                      .filter(Boolean)
                      .map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-[#2A1717] px-3 py-1.5 text-xs text-[#FFFFFF]/80"
                        >
                          {item}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RESUME
      ========================================================= */}

      <section className="border-t border-[#2A1717] py-28">
        <div className="container">
          <div className="rounded-[2rem] border border-[#2A1717] bg-[#0D0A0A] p-8 md:p-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[#FFFFFF]">
              Resume
            </p>

            <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h2 className="text-3xl tracking-[-0.04em] md:text-5xl">
                  Want to know more?
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-[#FFFFFF]/75">
                  View my resume for a quick
                  overview of my education,
                  technical skills and current
                  career focus.
                </p>
              </div>

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-[#FFFFFF]/80 transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black"
              >
                View Resume

                <ArrowUpRight
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT
      ========================================================= */}

      <section className="border-t border-[#2A1717] py-32">
        <div className="container">
          <p className="mb-5 text-xs uppercase tracking-[0.2em] text-[#FFFFFF]">
            Next
          </p>

          <h2 className="max-w-4xl text-5xl leading-[0.95] tracking-[-0.055em] md:text-7xl">
            Let&apos;s talk about
            <br />
            <span className="text-[#FFFFFF]">
              what you&apos;re building.
            </span>
          </h2>

          <Link
            href="/contact"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:-translate-y-1"
          >
            Get in touch

            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-[#2A1717] py-8">
        <div className="container flex flex-col justify-between gap-5 text-sm text-[#FFFFFF] sm:flex-row">
          <div>
            <p>
              © 2026{" "}
              {settings.name ||
                "Aman Nidhi"}
            </p>

            <p className="mt-1 text-xs text-[#FFFFFF]/55">
              {settings.role ||
                "AI/ML Developer"}{" "}
              · Data Analytics
            </p>
          </div>

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
