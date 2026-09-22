"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Loader2,
  Send,
} from "lucide-react";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import Navbar from "@/components/layout/Navbar";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type PortfolioSettings = {
  name: string | null;
  role: string | null;
  location: string | null;
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
};

const defaultSettings: PortfolioSettings = {
  name: "Aman Nidhi",
  role: "AI/ML Developer",
  location: "Haryana, India",
  email: "aknidhi06@gmail.com",
  github_url: "https://github.com/aknidhi",
  linkedin_url:
    "https://www.linkedin.com/in/aman-kumar-nidhi-484454209",
};

export default function ContactPage() {
  const [settings, setSettings] =
    useState<PortfolioSettings>(
      defaultSettings
    );

  const [loadingSettings, setLoadingSettings] =
    useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoadingSettings(true);

    const { data, error } =
      await supabase
        .from("portfolio_settings")
        .select(
          "name, role, location, email, github_url, linkedin_url"
        )
        .limit(1)
        .maybeSingle();

    if (error) {
      console.error(
        "Failed to load contact settings:",
        error
      );

      setLoadingSettings(false);
      return;
    }

    if (data) {
      setSettings({
        ...defaultSettings,
        ...data,
      });
    }

    setLoadingSettings(false);
  }

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.message.trim()
    ) {
      setError(
        "Please fill in all fields."
      );

      return;
    }

    setSending(true);

    try {
      const { error: insertError } =
        await supabase
          .from("contact_messages")
          .insert({
            name: form.name.trim(),
            email: form.email.trim(),
            subject: form.subject.trim(),
            message: form.message.trim(),
            status: "unread",
          });

      if (insertError) {
        throw insertError;
      }

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      setSuccess(true);
    } catch (err) {
      console.error(
        "Contact form submission failed:",
        err
      );

      setError(
        "Something went wrong while sending your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="public-red-page min-h-screen overflow-x-hidden text-white">
      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden pb-24 pt-40 md:pb-32">
        <div className="container relative z-10">
          <Link
            href="/"
            className="group mb-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back home
          </Link>

          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Get in touch
              </p>

              <span className="mt-4 block text-xs text-white/20">
                01
              </span>
            </div>

            <div>
              <h1 className="max-w-5xl text-5xl font-medium leading-[0.94] tracking-[-0.055em] sm:text-7xl md:text-8xl">
                Let&apos;s build
                <br />
                <span className="text-white/40">
                  something useful.
                </span>
              </h1>

              <p className="mt-10 max-w-2xl text-base leading-7 text-white/50 md:text-lg md:leading-8">
                Have a project, opportunity or
                idea you&apos;d like to discuss?
                Feel free to reach out.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PERSONAL CONTACT
      ========================================================= */}

      <section className="border-t border-white/10 py-20 md:py-28">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Personal contact
              </p>

              <span className="mt-4 block text-xs text-white/20">
                02
              </span>
            </div>

            <div>
              <h2 className="text-3xl tracking-[-0.04em] md:text-5xl">
                Let&apos;s connect.
              </h2>

              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/40">
                You can also reach me directly
                through the contact details below.
              </p>

              <div className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">

                {/* EMAIL */}

                <div className="bg-black/25 p-6 md:p-7">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                    Email
                  </p>

                  {loadingSettings ? (
                    <p className="mt-4 text-sm text-white/30">
                      Loading...
                    </p>
                  ) : settings.email ? (
                    <a
                      href={`mailto:${settings.email}`}
                      className="group mt-4 inline-flex items-center gap-2 break-all text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {settings.email}

                      <ArrowUpRight
                        size={14}
                        className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  ) : (
                    <p className="mt-4 text-sm text-white/30">
                      Not available
                    </p>
                  )}
                </div>

                {/* LOCATION */}

                <div className="bg-black/25 p-6 md:p-7">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                    Location
                  </p>

                  <p className="mt-4 text-sm text-white/65">
                    {settings.location ||
                      "India"}
                  </p>
                </div>

                {/* GITHUB */}

                <div className="bg-black/25 p-6 md:p-7">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                    GitHub
                  </p>

                  {settings.github_url ? (
                    <a
                      href={settings.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-4 inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white"
                    >
                      github.com/aknidhi

                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  ) : (
                    <p className="mt-4 text-sm text-white/30">
                      Not available
                    </p>
                  )}
                </div>

                {/* LINKEDIN */}

                <div className="bg-black/25 p-6 md:p-7">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                    LinkedIn
                  </p>

                  {settings.linkedin_url ? (
                    <a
                      href={settings.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-4 inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white"
                    >
                      LinkedIn profile

                      <ArrowUpRight
                        size={14}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  ) : (
                    <p className="mt-4 text-sm text-white/30">
                      Not available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT FORM
      ========================================================= */}

      <section className="border-t border-white/10 py-20 md:py-28">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-[180px_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Conversation
              </p>

              <span className="mt-4 block text-xs text-white/20">
                03
              </span>
            </div>

            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              {/* LEFT */}

              <div>
                <h2 className="max-w-md text-3xl tracking-[-0.04em] md:text-5xl">
                  Start a conversation.
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-white/40">
                  Have a project, opportunity or
                  idea you&apos;d like to discuss?
                  Send me a message using the
                  form and I&apos;ll get back to you.
                </p>

                <div className="mt-10 border-t border-white/10 pt-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-white/25">
                    {settings.name}
                  </p>

                  <p className="mt-2 text-sm text-white/40">
                    {settings.role}
                  </p>

                  {settings.location && (
                    <p className="mt-1 text-xs text-white/25">
                      {settings.location}
                    </p>
                  )}
                </div>
              </div>

              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="public-contact-card rounded-[2rem] border border-white/10 bg-black/25 p-7 md:p-10"
              >
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      label="Name"
                      value={form.name}
                      onChange={(value) =>
                        updateField(
                          "name",
                          value
                        )
                      }
                      placeholder="Your name"
                    />

                    <FormField
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(value) =>
                        updateField(
                          "email",
                          value
                        )
                      }
                      placeholder="you@example.com"
                    />
                  </div>

                  <FormField
                    label="Subject"
                    value={form.subject}
                    onChange={(value) =>
                      updateField(
                        "subject",
                        value
                      )
                    }
                    placeholder="What would you like to discuss?"
                  />

                  <div>
                    <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Message
                    </label>

                    <textarea
                      value={form.message}
                      onChange={(event) =>
                        updateField(
                          "message",
                          event.target.value
                        )
                      }
                      rows={7}
                      placeholder="Write your message..."
                      className="w-full resize-y rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-7 text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-white/25 focus:bg-black/55"
                    />
                  </div>

                  {/* ERROR */}

                  {error && (
                    <div className="rounded-xl border border-red-300/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  {/* SUCCESS */}

                  {success && (
                    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75">
                      <Check size={16} />

                      <span>
                        Message sent successfully.
                        Thank you for reaching out.
                      </span>
                    </div>
                  )}

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    disabled={sending}
                    className="public-red-button inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />

                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />

                        Send message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/10 py-10">
        <div className="container">
          <div className="flex flex-col justify-between gap-4 text-xs text-white/30 sm:flex-row">
            <p>
              © {new Date().getFullYear()}{" "}
              {settings.name || "Aman Nidhi"}.
              All rights reserved.
            </p>

            <div className="flex gap-5">
              <Link
                href="/"
                className="transition-colors hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/about"
                className="transition-colors hover:text-white"
              >
                About
              </Link>

              <Link
                href="/projects"
                className="transition-colors hover:text-white"
              >
                Projects
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/20 focus:border-white/25 focus:bg-black/55"
      />
    </div>
  );
}