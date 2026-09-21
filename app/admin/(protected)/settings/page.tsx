"use client";

import {
  ArrowLeft,
  Check,
  Save,
  Upload,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const supabase = createClient();

type Settings = {
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

const emptySettings: Settings = {
  id: "",

  profile_image_path: null,
  profile_image_alt: "Aman Nidhi",

  name: "Aman Nidhi",
  role: "AI/ML Developer",
  location: "Haryana, India",

  profile_card_name: "AMAN NIDHI",
  profile_card_role: "AI/ML Developer",
  profile_card_subtitle: "Data Analytics",

  hero_badge: "AVAILABLE FOR OPPORTUNITIES",
  hero_title: "Building intelligent systems with AI.",
  hero_description:
    "I'm Aman Nidhi — an AI/ML Developer working across machine learning, data analytics and intelligent applications. I build practical digital products that turn data and AI into useful solutions.",

  about_text:
    "I'm interested in building practical technology that solves real problems — combining artificial intelligence, machine learning and data analytics.",

  about_intro:
    "My interests sit at the intersection of artificial intelligence, machine learning, software and data.",

  about_description:
    "I like understanding a problem, exploring possible solutions and then building a working system around it. Projects are a major part of my learning process, especially when they allow me to combine AI, automation and data analytics.",

  about_languages: "Hindi · English",

  about_current_focus:
    "AI/ML · Agentic AI · Data Analytics",

  about_page_title:
    "Building with curiosity.",

  about_page_description:
    "I'm Aman Nidhi, an AI/ML Developer working across machine learning, data analytics and intelligent applications. I enjoy turning ideas, data and technology into practical digital products.",

  email: "aknidhi06@gmail.com",

  github_url:
    "https://github.com/aknidhi",

  linkedin_url:
    "https://www.linkedin.com/in/aman-kumar-nidhi-484454209",

  resume_path:
    "resume/Aman_Kumar_Nidhi_Resume.pdf",

  updated_at: null,
};

export default function AdminSettingsPage() {
  const router = useRouter();

  const [settings, setSettings] =
    useState<Settings>(emptySettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("portfolio_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Failed to load settings:",
        error
      );

      setLoading(false);
      return;
    }

    if (data) {
      setSettings({
        ...emptySettings,
        ...data,
      });

      if (data.profile_image_path) {
        const { data: publicData } =
          supabase.storage
            .from("project-images")
            .getPublicUrl(
              data.profile_image_path
            );

        setImagePreview(
          publicData.publicUrl
        );
      }
    }

    setLoading(false);
  }

  function updateField(
    field: keyof Settings,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setSaved(false);

    const updateData = {
      profile_image_path:
        settings.profile_image_path,

      profile_image_alt:
        settings.profile_image_alt,

      name:
        settings.name,

      role:
        settings.role,

      location:
        settings.location,

      profile_card_name:
        settings.profile_card_name,

      profile_card_role:
        settings.profile_card_role,

      profile_card_subtitle:
        settings.profile_card_subtitle,

      hero_badge:
        settings.hero_badge,

      hero_title:
        settings.hero_title,

      hero_description:
        settings.hero_description,

      about_text:
        settings.about_text,

      about_intro:
        settings.about_intro,

      about_description:
        settings.about_description,

      about_languages:
        settings.about_languages,

      about_current_focus:
        settings.about_current_focus,

      about_page_title:
        settings.about_page_title,

      about_page_description:
        settings.about_page_description,

      email:
        settings.email,

      github_url:
        settings.github_url,

      linkedin_url:
        settings.linkedin_url,

      resume_path:
        settings.resume_path,

      updated_at:
        new Date().toISOString(),
    };

    let error;

    if (settings.id) {
      const result = await supabase
        .from("portfolio_settings")
        .update(updateData)
        .eq("id", settings.id);

      error = result.error;
    } else {
      const result = await supabase
        .from("portfolio_settings")
        .insert(updateData);

      error = result.error;
    }

    if (error) {
      console.error(
        "Failed to save settings:",
        error
      );

      alert(
        `Failed to save settings: ${error.message}`
      );

      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);

    setTimeout(() => {
      setSaved(false);
    }, 2500);

    router.refresh();
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    setUploadingImage(true);

    try {
      const extension =
        file.name.split(".").pop() ||
        "jpg";

      const filePath =
        `profile/profile-${Date.now()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("project-images")
          .upload(
            filePath,
            file,
            {
              cacheControl: "3600",
              upsert: true,
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicData } =
        supabase.storage
          .from("project-images")
          .getPublicUrl(filePath);

      setImagePreview(
        publicData.publicUrl
      );

      setSettings((current) => ({
        ...current,
        profile_image_path:
          filePath,
      }));

      setSaved(false);
    } catch (error) {
      console.error(
        "Profile image upload failed:",
        error
      );

      alert(
        "Failed to upload profile image."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090909] text-white">
        <div className="container py-20">
          <p className="text-sm text-white/40">
            Loading settings...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <div className="container py-10">

        {/* HEADER */}

        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <Link
              href="/admin"
              className="group mb-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/30 transition-colors hover:text-white"
            >
              <ArrowLeft
                size={14}
                className="transition-transform group-hover:-translate-x-1"
              />

              Dashboard
            </Link>

            <h1 className="text-4xl tracking-[-0.04em] md:text-5xl">
              Portfolio Settings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
              Manage the content displayed across
              your public portfolio.
            </p>
          </div>

          <button
            type="submit"
            form="settings-form"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              "Saving..."
            ) : saved ? (
              <>
                <Check size={16} />
                Saved
              </>
            ) : (
              <>
                <Save size={16} />
                Save changes
              </>
            )}
          </button>
        </div>

        <form
          id="settings-form"
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* =====================================================
              01 PROFILE
          ===================================================== */}

          <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-7 md:p-10">
            <SectionHeader
              number="01"
              title="Profile"
              description="Main identity information used throughout the portfolio."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2">

              <Field
                label="Name"
                value={settings.name || ""}
                onChange={(value) =>
                  updateField("name", value)
                }
              />

              <Field
                label="Role"
                value={settings.role || ""}
                onChange={(value) =>
                  updateField("role", value)
                }
              />

              <Field
                label="Location"
                value={settings.location || ""}
                onChange={(value) =>
                  updateField("location", value)
                }
              />

              <Field
                label="Profile image alt text"
                value={
                  settings.profile_image_alt ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "profile_image_alt",
                    value
                  )
                }
                hint="Used only as image accessibility text."
              />

            </div>
          </section>

          {/* =====================================================
              02 PROFILE CARD
          ===================================================== */}

          <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-7 md:p-10">
            <SectionHeader
              number="02"
              title="Profile Card"
              description="Text displayed directly on the profile image card."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-3">

              <Field
                label="Card name"
                value={
                  settings.profile_card_name ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "profile_card_name",
                    value
                  )
                }
              />

              <Field
                label="Card role"
                value={
                  settings.profile_card_role ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "profile_card_role",
                    value
                  )
                }
              />

              <Field
                label="Card subtitle"
                value={
                  settings.profile_card_subtitle ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "profile_card_subtitle",
                    value
                  )
                }
              />

            </div>
          </section>

          {/* =====================================================
              03 PROFILE IMAGE
          ===================================================== */}

          <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-7 md:p-10">
            <SectionHeader
              number="03"
              title="Profile Image"
              description="Upload the image used on your homepage profile card."
            />

            <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-center">

              <div className="relative h-48 w-48 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#090909]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={
                      settings.profile_image_alt ||
                      "Profile image"
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <UserRound
                      size={48}
                      className="text-white/15"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-white/70 transition-all hover:border-white/30 hover:bg-white hover:text-black">
                  <Upload size={16} />

                  {uploadingImage
                    ? "Uploading..."
                    : "Upload image"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageUpload
                    }
                    disabled={
                      uploadingImage
                    }
                    className="hidden"
                  />
                </label>

                <p className="mt-3 text-xs leading-5 text-white/25">
                  Recommended: square image,
                  high resolution.
                </p>
              </div>

            </div>
          </section>

          {/* =====================================================
              04 HERO
          ===================================================== */}

          <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-7 md:p-10">
            <SectionHeader
              number="04"
              title="Hero"
              description="Main homepage hero content."
            />

            <div className="mt-10 space-y-6">

              <Field
                label="Hero badge"
                value={
                  settings.hero_badge || ""
                }
                onChange={(value) =>
                  updateField(
                    "hero_badge",
                    value
                  )
                }
              />

              <Field
                label="Hero title"
                value={
                  settings.hero_title || ""
                }
                onChange={(value) =>
                  updateField(
                    "hero_title",
                    value
                  )
                }
              />

              <TextArea
                label="Hero description"
                value={
                  settings.hero_description ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "hero_description",
                    value
                  )
                }
              />

            </div>
          </section>

          {/* =====================================================
              05 ABOUT
          ===================================================== */}

          <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-7 md:p-10">
            <SectionHeader
              number="05"
              title="About"
              description="Content used across the homepage and About page."
            />

            <div className="mt-10 space-y-6">

              <TextArea
                label="About text"
                value={
                  settings.about_text || ""
                }
                onChange={(value) =>
                  updateField(
                    "about_text",
                    value
                  )
                }
                hint="Used in the homepage About section."
              />

              <TextArea
                label="About intro"
                value={
                  settings.about_intro || ""
                }
                onChange={(value) =>
                  updateField(
                    "about_intro",
                    value
                  )
                }
                hint="Main introduction shown on the About page."
              />

              <TextArea
                label="About description"
                value={
                  settings.about_description ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "about_description",
                    value
                  )
                }
                hint="Supporting paragraph shown on the About page."
              />

              <div className="grid gap-6 md:grid-cols-2">

                <Field
                  label="Languages"
                  value={
                    settings.about_languages ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "about_languages",
                      value
                    )
                  }
                />

                <Field
                  label="Current focus"
                  value={
                    settings.about_current_focus ||
                    ""
                  }
                  onChange={(value) =>
                    updateField(
                      "about_current_focus",
                      value
                    )
                  }
                />

              </div>

            </div>
          </section>

          {/* =====================================================
              06 ABOUT PAGE
          ===================================================== */}

          <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-7 md:p-10">
            <SectionHeader
              number="06"
              title="About Page"
              description="Content specifically used in the main introduction of /about."
            />

            <div className="mt-10 space-y-6">

              <Field
                label="About page title"
                value={
                  settings.about_page_title ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "about_page_title",
                    value
                  )
                }
                hint="Example: Building with curiosity."
              />

              <TextArea
                label="About page description"
                value={
                  settings.about_page_description ||
                  ""
                }
                onChange={(value) =>
                  updateField(
                    "about_page_description",
                    value
                  )
                }
                hint="Description displayed below the About page title."
              />

            </div>
          </section>

          {/* =====================================================
              07 CONTACT & SOCIAL
          ===================================================== */}

          <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-7 md:p-10">
            <SectionHeader
              number="07"
              title="Contact & Social"
              description="Contact information and social profile links."
            />

            <div className="mt-10 space-y-6">

              <Field
                label="Email"
                type="email"
                value={
                  settings.email || ""
                }
                onChange={(value) =>
                  updateField(
                    "email",
                    value
                  )
                }
              />

              <Field
                label="GitHub URL"
                value={
                  settings.github_url || ""
                }
                onChange={(value) =>
                  updateField(
                    "github_url",
                    value
                  )
                }
              />

              <Field
                label="LinkedIn URL"
                value={
                  settings.linkedin_url || ""
                }
                onChange={(value) =>
                  updateField(
                    "linkedin_url",
                    value
                  )
                }
              />

            </div>
          </section>

          {/* =====================================================
              08 RESUME
          ===================================================== */}

          <section className="rounded-[2rem] border border-white/10 bg-[#101010] p-7 md:p-10">
            <SectionHeader
              number="08"
              title="Resume"
              description="Path to the resume displayed on the portfolio."
            />

            <div className="mt-10">

              <Field
                label="Resume path"
                value={
                  settings.resume_path || ""
                }
                onChange={(value) =>
                  updateField(
                    "resume_path",
                    value
                  )
                }
                hint="Example: resume/Aman_Kumar_Nidhi_Resume.pdf"
              />

            </div>
          </section>

        </form>
      </div>
    </main>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 pb-7 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-5">

        <span className="text-xs text-white/20">
          {number}
        </span>

        <div>
          <h2 className="text-2xl tracking-[-0.03em]">
            {title}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/30">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string;
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
        className="w-full rounded-xl border border-white/10 bg-[#090909] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/20 focus:border-white/25"
      />

      {hint && (
        <p className="mt-2 text-xs leading-5 text-white/20">
          {hint}
        </p>
      )}

    </div>
  );
}

/* ============================================================
   TEXT AREA
============================================================ */

function TextArea({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-white/30">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={5}
        className="w-full resize-y rounded-xl border border-white/10 bg-[#090909] px-4 py-3 text-sm leading-6 text-white outline-none transition-colors placeholder:text-white/20 focus:border-white/25"
      />

      {hint && (
        <p className="mt-2 text-xs leading-5 text-white/20">
          {hint}
        </p>
      )}

    </div>
  );
}