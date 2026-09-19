import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { supabaseServer } from "@/lib/supabase-server";

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

  // --------------------------------------------------
  // LOAD PROJECT
  // --------------------------------------------------

  const { data, error } = await supabaseServer
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    return (
      <>
        <Navbar />

        <main className="project-detail-page">
          <div className="project-container">
            <Link
              href="/projects"
              className="back-link"
            >
              <ArrowLeft size={15} />
              Back to projects
            </Link>

            <section className="project-hero">
              <p className="eyebrow">
                PROJECT NOT FOUND
              </p>

              <h1 className="project-title">
                Project not found.
              </h1>

              <p className="project-lead">
                The project may have been removed or is not
                currently published.
              </p>
            </section>
          </div>
        </main>
      </>
    );
  }

  // --------------------------------------------------
  // LOAD PROJECT IMAGES FROM SUPABASE
  // --------------------------------------------------

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

  // --------------------------------------------------
  // PROJECT DATA
  // --------------------------------------------------

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

  // --------------------------------------------------
  // CREATE PUBLIC STORAGE URLS
  // --------------------------------------------------

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

  const hasDatabaseImages =
    databaseImages.length > 0;

  return (
    <>
      <Navbar />

      <main className="project-detail-page">
        <div className="project-container">

          {/* ==================================================
              BACK
              ================================================== */}

          <Link
            href="/projects"
            className="back-link"
          >
            <ArrowLeft size={15} />
            Back to projects
          </Link>

          {/* ==================================================
              HERO
              ================================================== */}

          <section className="project-hero">
            <div>
              <p className="eyebrow">
                {project.category}
              </p>

              <h1 className="project-title">
                {project.title}
              </h1>

              <p className="project-lead">
                {project.shortDescription}
              </p>
            </div>

            <div className="project-meta">
              <span>
                {project.year}
              </span>
            </div>

            <div className="project-actions">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-button"
                >
                  GitHub

                  <ArrowUpRight
                    size={15}
                  />
                </a>
              )}

              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-button"
                >
                  Live project

                  <ExternalLink
                    size={15}
                  />
                </a>
              )}
            </div>
          </section>

          {/* ==================================================
              PROJECT GALLERY
              ================================================== */}

          {hasDatabaseImages && (
            <section className="project-gallery">
              <div className="gallery-intro">
                <p className="eyebrow">
                  PROJECT PREVIEW
                </p>

                <h2>
                  Interface & workflow.
                </h2>

                <p>
                  Explore the project interface,
                  workflow and key screens.
                </p>
              </div>

              {databaseImages.map(
                (image, index) => (
                  <div
                    className="gallery-section"
                    key={image.id}
                  >
                    <div className="gallery-text">
                      <p className="eyebrow">
                        SCREEN{" "}
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </p>

                      <h3>
                        {image.alt}
                      </h3>
                    </div>

                    <img
                      src={image.src}
                      alt={image.alt}
                      className="project-image"
                      loading={
                        index === 0
                          ? "eager"
                          : "lazy"
                      }
                    />
                  </div>
                )
              )}
            </section>
          )}

          {!hasDatabaseImages && (
            <section className="project-gallery">
              <div className="gallery-intro">
                <p className="eyebrow">
                  PROJECT PREVIEW
                </p>

                <h2>
                  Project preview.
                </h2>

                <p>
                  Project images will appear here
                  once they are added from the
                  project management dashboard.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-[#101010] p-8">
                <p className="text-sm leading-7 text-white/35">
                  No project images have been
                  uploaded yet.
                </p>

                <Link
                  href="/projects"
                  className="group mt-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
                >
                  Back to projects

                  <ArrowUpRight
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </section>
          )}

          {/* ==================================================
              OVERVIEW
              ================================================== */}

          <section className="project-section">
            <div>
              <p className="eyebrow">
                OVERVIEW
              </p>
            </div>

            <div>
              <p className="section-description">
                {project.description}
              </p>
            </div>
          </section>

          {/* ==================================================
              PROBLEM
              ================================================== */}

          <section className="project-section">
            <div>
              <p className="eyebrow">
                THE PROBLEM
              </p>
            </div>

            <div>
              <h2 className="section-title">
                {project.problem.title}
              </h2>

              <p className="section-description">
                {project.problem.description}
              </p>
            </div>
          </section>

          {/* ==================================================
              SOLUTION
              ================================================== */}

          <section className="project-section">
            <div>
              <p className="eyebrow">
                THE SOLUTION
              </p>
            </div>

            <div>
              <h2 className="section-title">
                {project.solution.title}
              </h2>

              <p className="section-description">
                {project.solution.description}
              </p>
            </div>
          </section>

          {/* ==================================================
              FEATURES
              ================================================== */}

          <section className="project-section">
            <div>
              <p className="eyebrow">
                KEY FEATURES
              </p>
            </div>

            <div className="feature-grid">
              {project.features.length ===
              0 ? (
                <p className="section-description">
                  Features will be added soon.
                </p>
              ) : (
                project.features.map(
                  (
                    feature: string,
                    index: number
                  ) => (
                    <div
                      className="feature-card"
                      key={`${feature}-${index}`}
                    >
                      <span>
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </span>

                      <h3>
                        {feature}
                      </h3>
                    </div>
                  )
                )
              )}
            </div>
          </section>

          {/* ==================================================
              TECHNOLOGIES
              ================================================== */}

          <section className="project-section">
            <div>
              <p className="eyebrow">
                TECHNOLOGIES
              </p>
            </div>

            <div className="technology-list">
              {project.technologies.length ===
              0 ? (
                <p className="section-description">
                  Technologies will be added soon.
                </p>
              ) : (
                project.technologies.map(
                  (
                    technology: string,
                    index: number
                  ) => (
                    <span
                      key={`${technology}-${index}`}
                    >
                      {technology}
                    </span>
                  )
                )
              )}
            </div>
          </section>

          {/* ==================================================
              BOTTOM
              ================================================== */}

          <section className="project-bottom">
            <div>
              <p className="eyebrow">
                MORE PROJECTS
              </p>

              <h2>
                Explore more of my work.
              </h2>
            </div>

            <Link
              href="/projects"
              className="project-button"
            >
              View all projects

              <ArrowUpRight
                size={15}
              />
            </Link>
          </section>

        </div>
      </main>
    </>
  );
}