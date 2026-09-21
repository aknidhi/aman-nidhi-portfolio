"use client";

import {
  ArrowUpRight,
  Check,
  Loader2,
  Send,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

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
    useState<PortfolioSettings>(defaultSettings);

  const [loadingSettings, setLoadingSettings] =
    useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoadingSettings(true);

    const { data, error } = await supabase
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
      setError("Please fill in all fields.");
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
    <main className="min-h-screen overflow-x-hidden bg-[#090909] text-white">

      {/* =========================================================
          NAVBAR
      ========================================================= */}

      <Navbar />

      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="border-b border-white/10 py-24 sm:py-28 md:py-36">
        <div className="container">

          <div className="grid gap-12 md:grid-cols-[180px_1fr]">

            {/* SECTION LABEL */}

            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Get in touch
              </p>
            </div>

            {/* HERO CONTENT */}

            <div className="max-w-5xl">

              <h1 className="text-[clamp(48px,10vw,88px)] font-medium leading-[0.94] tracking-[-0.055em]">
                Let&apos;s build
                <br />
                something useful.
              </h1>

              <p className="mt-8 max-w-2xl text-[15px] leading-7 text-white/45 sm:mt-10 sm:text-lg sm:leading-8">
                Have a project, opportunity or idea
                you&apos;d like to discuss? Feel free
                to reach out.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          PERSONAL CONTACT
      ========================================================= */}

      <section className="border-b border-white/10 py-20 sm:py-24 md:py-28">
        <div className="container">

          <div className="grid gap-12 md:grid-cols-[180px_1fr]">

            {/* SECTION LABEL */}

            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Personal contact
              </p>
            </div>

            {/* CONTACT INFORMATION */}

            <div>

              <h2 className="text-3xl tracking-[-0.03em] md:text-4xl">
                Let&apos;s connect.
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/40">
                You can also reach me directly through
                the contact details below.
              </p>

              <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">

                {/* EMAIL */}

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                    Email
                  </p>

                  {loadingSettings ? (
                    <p className="mt-4 text-sm text-white/30">
                      Loading...
                    </p>
                  ) : settings.email ? (
                    <a
                      href={`mailto:${settings.email}`}
                      className="group mt-4 inline-flex items-center gap-2 break-all text-sm text-white/70 transition hover:text-white"
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

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                    Location
                  </p>

                  <p className="mt-4 text-sm text-white/70">
                    {settings.location || "India"}
                  </p>
                </div>

                {/* GITHUB */}

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                    GitHub
                  </p>

                  {settings.github_url ? (
                    <a
                      href={settings.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-4 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
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

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/30">
                    LinkedIn
                  </p>

                  {settings.linkedin_url ? (
                    <a
                      href={settings.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group mt-4 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
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
          CONVERSATION
      ========================================================= */}

      <section className="border-b border-white/10 py-20 sm:py-24 md:py-28">
        <div className="container">

          <div className="grid gap-12 md:grid-cols-[180px_1fr]">

            {/* SECTION LABEL */}

            <div className="pt-2">
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Conversation
              </p>
            </div>

            {/* CONVERSATION CONTENT */}

            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">

              {/* LEFT SIDE */}

              <div>

                <h2 className="max-w-md text-3xl tracking-[-0.03em] md:text-4xl">
                  Start a conversation.
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-white/40">
                  Have a project, opportunity or idea
                  you&apos;d like to discuss? Send me a
                  message using the form and I&apos;ll get
                  back to you.
                </p>

                <div className="mt-8">
                  <p className="text-xs uppercase tracking-[0.15em] text-white/25">
                    {settings.name}
                  </p>

                  <p className="mt-2 text-sm text-white/40">
                    {settings.role}
                  </p>
                </div>

              </div>

              {/* FORM */}

              <div>

                <form
                  onSubmit={handleSubmit}
                  className="rounded-[2rem] border border-white/10 bg-[#101010] p-7 md:p-10"
                >

                  <div className="space-y-6">

                    {/* NAME + EMAIL */}

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

                    {/* SUBJECT */}

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

                    {/* MESSAGE */}

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/30">
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
                        className="w-full resize-y rounded-xl border border-white/10 bg-[#090909] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/20 focus:border-white/25"
                      />
                    </div>

                    {/* ERROR */}

                    {error && (
                      <div className="rounded-xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                        {error}
                      </div>
                    )}

                    {/* SUCCESS */}

                    {success && (
                      <div className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
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
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition-all hover:-translate-y-0.5 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
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

        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer className="border-t border-white/10 py-10">
        <div className="container">

          <div className="flex flex-col gap-4 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between">

            <p>
              © {new Date().getFullYear()}{" "}
              {settings.name || "Aman Nidhi"}.
              All rights reserved.
            </p>

            <p>
              {settings.role || "AI/ML Developer"}
              {settings.location
                ? ` · ${settings.location}`
                : ""}
            </p>

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

      <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/30">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-white/25"
      />

    </div>
  );
}