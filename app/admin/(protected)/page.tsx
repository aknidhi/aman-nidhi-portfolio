"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Award,
  Code2,
  FolderKanban,
  GraduationCap,
  LogOut,
  Mail,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [projectCount, setProjectCount] =
    useState<number>(0);

  const [educationCount, setEducationCount] =
    useState<number>(0);

  const [certificationCount, setCertificationCount] =
    useState<number>(0);

  const [skillCount, setSkillCount] =
    useState<number>(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      /*
       * Load messages
       */

      const { data: messageData } =
        await supabase
          .from("contact_messages")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (messageData) {
        setMessages(messageData);
      }

      /*
       * Load project count
       */

      const { count: projectsCount } =
        await supabase
          .from("projects")
          .select("id", {
            count: "exact",
            head: true,
          });

      /*
       * Load education count
       */

      const { count: educationTotal } =
        await supabase
          .from("education")
          .select("id", {
            count: "exact",
            head: true,
          });

      /*
       * Load certification count
       */

      const {
        count: certificationsTotal,
      } = await supabase
        .from("certifications")
        .select("id", {
          count: "exact",
          head: true,
        });

      /*
       * Load skills count
       */

      const { count: skillsTotal } =
        await supabase
          .from("portfolio_skills")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("published", true);

      setProjectCount(
        projectsCount ?? 0
      );

      setEducationCount(
        educationTotal ?? 0
      );

      setCertificationCount(
        certificationsTotal ?? 0
      );

      setSkillCount(
        skillsTotal ?? 0
      );

      setIsLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    setIsLoggingOut(true);

    await supabase.auth.signOut();

    router.replace("/admin/login");
  }

  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* =====================================
            HEADER
        ===================================== */}

        <header className="admin-header">

          <div>

            <p className="eyebrow">
              AMAN NIDHI / ADMIN
            </p>

            <h1>
              Dashboard.
            </h1>

            <p className="admin-header-description">
              Manage your portfolio, projects and
              incoming messages.
            </p>

          </div>

          <div className="admin-header-actions">

            <Link
              href="/"
              className="admin-view-site"
            >
              View site
              <ArrowUpRight size={15} />
            </Link>

            <button
              type="button"
              className="admin-logout"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              <LogOut size={15} />

              {isLoggingOut
                ? "Signing out..."
                : "Sign out"}
            </button>

          </div>

        </header>


        {/* =====================================
            MAIN STATS
        ===================================== */}

        <section className="admin-stats">

          {/* =================================
              TOTAL MESSAGES
          ================================= */}

          <Link
            href="/admin/messages"
            className="admin-stat-card admin-stat-link"
          >

            <div className="admin-stat-icon">
              <MessageSquare size={18} />
            </div>

            <div>

              <p>
                Total messages
              </p>

              <strong>
                {isLoading
                  ? "—"
                  : messages.length}
              </strong>

            </div>

            <ArrowUpRight
              className="admin-stat-arrow"
              size={15}
            />

          </Link>


          {/* =================================
              PROJECTS
          ================================= */}

          <Link
            href="/admin/projects"
            className="admin-stat-card admin-stat-link"
          >

            <div className="admin-stat-icon">
              <FolderKanban size={18} />
            </div>

            <div>

              <p>
                Projects
              </p>

              <strong>
                {isLoading
                  ? "—"
                  : projectCount}
              </strong>

            </div>

            <ArrowUpRight
              className="admin-stat-arrow"
              size={15}
            />

          </Link>


          {/* =================================
              SKILLS
          ================================= */}

          <Link
            href="/admin/skills"
            className="admin-stat-card admin-stat-link"
          >

            <div className="admin-stat-icon">
              <Code2 size={18} />
            </div>

            <div>

              <p>
                Skills
              </p>

              <strong>
                {isLoading
                  ? "—"
                  : skillCount}
              </strong>

            </div>

            <ArrowUpRight
              className="admin-stat-arrow"
              size={15}
            />

          </Link>


          {/* =================================
              EDUCATION
          ================================= */}

          <Link
            href="/admin/education"
            className="admin-stat-card admin-stat-link"
          >

            <div className="admin-stat-icon">
              <GraduationCap size={18} />
            </div>

            <div>

              <p>
                Education
              </p>

              <strong>
                {isLoading
                  ? "—"
                  : educationCount}
              </strong>

            </div>

            <ArrowUpRight
              className="admin-stat-arrow"
              size={15}
            />

          </Link>


          {/* =================================
              CERTIFICATIONS
          ================================= */}

          <Link
            href="/admin/certifications"
            className="admin-stat-card admin-stat-link"
          >

            <div className="admin-stat-icon">
              <Award size={18} />
            </div>

            <div>

              <p>
                Certifications
              </p>

              <strong>
                {isLoading
                  ? "—"
                  : certificationCount}
              </strong>

            </div>

            <ArrowUpRight
              className="admin-stat-arrow"
              size={15}
            />

          </Link>


          {/* =================================
              PORTFOLIO SETTINGS
          ================================= */}

          <Link
            href="/admin/settings"
            className="admin-stat-card admin-stat-link"
          >

            <div className="admin-stat-icon">
              <Settings size={18} />
            </div>

            <div>

              <p>
                Portfolio settings
              </p>

              <strong>
                Manage
              </strong>

            </div>

            <ArrowUpRight
              className="admin-stat-arrow"
              size={15}
            />

          </Link>

        </section>


        {/* =====================================
            DASHBOARD GRID
        ===================================== */}

        <section className="admin-grid">

          {/* ===================================
              MESSAGES
          =================================== */}

          <div className="admin-panel admin-messages-panel">

            <div className="admin-panel-header">

              <div>

                <p className="eyebrow">
                  INBOX
                </p>

                <h2>
                  Recent messages
                </h2>

              </div>

              <Link
                href="/admin/messages"
                className="admin-panel-link"
              >
                View all
                <ArrowUpRight size={14} />
              </Link>

            </div>


            {isLoading ? (

              <div className="admin-empty-state">
                Loading messages...
              </div>

            ) : messages.length === 0 ? (

              <div className="admin-empty-state">

                <Mail size={22} />

                <p>
                  No messages yet.
                </p>

              </div>

            ) : (

              <div className="admin-message-list">

                {messages
                  .slice(0, 5)
                  .map((message) => (

                    <div
                      key={message.id}
                      className="admin-message-item"
                    >

                      <div className="admin-message-main">

                        <div className="admin-message-title">

                          <strong>
                            {message.subject}
                          </strong>

                          {message.status ===
                            "unread" && (
                            <span className="admin-unread-dot" />
                          )}

                        </div>

                        <p>
                          {message.name}
                        </p>

                        <span>
                          {message.email}
                        </span>

                      </div>

                      <time>
                        {new Date(
                          message.created_at
                        ).toLocaleDateString()}
                      </time>

                    </div>

                  ))}

              </div>

            )}

          </div>


          {/* ===================================
              QUICK ACTIONS
          =================================== */}

          <div className="admin-panel">

            <div className="admin-panel-header">

              <div>

                <p className="eyebrow">
                  MANAGEMENT
                </p>

                <h2>
                  Quick actions
                </h2>

              </div>

            </div>


            <div className="admin-actions">

              {/* MESSAGES */}

              <Link
                href="/admin/messages"
                className="admin-action"
              >

                <div>
                  <Mail size={18} />
                </div>

                <span>

                  <strong>
                    Manage messages
                  </strong>

                  <small>
                    Read and manage inquiries
                  </small>

                </span>

                <ArrowUpRight size={16} />

              </Link>


              {/* PROJECTS */}

              <Link
                href="/admin/projects"
                className="admin-action"
              >

                <div>
                  <FolderKanban size={18} />
                </div>

                <span>

                  <strong>
                    Manage projects
                  </strong>

                  <small>
                    Add and edit portfolio projects
                  </small>

                </span>

                <ArrowUpRight size={16} />

              </Link>


              {/* EDUCATION */}

              <Link
                href="/admin/education"
                className="admin-action"
              >

                <div>
                  <GraduationCap size={18} />
                </div>

                <span>

                  <strong>
                    Manage education
                  </strong>

                  <small>
                    Add and edit education entries
                  </small>

                </span>

                <ArrowUpRight size={16} />

              </Link>


              {/* CERTIFICATIONS */}

              <Link
                href="/admin/certifications"
                className="admin-action"
              >

                <div>
                  <Award size={18} />
                </div>

                <span>

                  <strong>
                    Manage certifications
                  </strong>

                  <small>
                    Add courses and certifications
                  </small>

                </span>

                <ArrowUpRight size={16} />

              </Link>


              {/* PUBLIC PORTFOLIO */}

              <Link
                href="/projects"
                className="admin-action"
              >

                <div>
                  <ArrowUpRight size={18} />
                </div>

                <span>

                  <strong>
                    View portfolio
                  </strong>

                  <small>
                    Open the public project page
                  </small>

                </span>

                <ArrowUpRight size={16} />

              </Link>

            </div>

          </div>

        </section>


        {/* =====================================
            FOOTER
        ===================================== */}

        <footer className="admin-footer">

          <span>
            AMAN. ADMIN
          </span>

          <Link href="/">
            Back to portfolio
          </Link>

        </footer>

      </div>
    </main>
  );
}