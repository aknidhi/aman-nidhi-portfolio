"use client";

import {
  ArrowLeft,
  Check,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

type Skill = {
  id: string;
  category: string;
  name: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type SkillForm = {
  category: string;
  name: string;
  sort_order: string;
  published: boolean;
};

const emptyForm: SkillForm = {
  category: "AI / Machine Learning",
  name: "",
  sort_order: "1",
  published: true,
};

const categories = [
  "AI / Machine Learning",
  "Data Analytics",
  "Frameworks",
  "Databases",
  "AI Tools",
  "Languages",
];

export default function AdminSkillsPage() {
  const router = useRouter();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [form, setForm] = useState<SkillForm>(emptyForm);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  async function checkSession() {
    const {
      data: { session },
      error: refreshError,
    } = await supabase.auth.refreshSession();

    if (refreshError || !session) {
      router.push("/admin/login");
      return false;
    }

    return true;
  }

  async function loadSkills() {
    setLoading(true);
    setError("");

    const authenticated = await checkSession();

    if (!authenticated) {
      setLoading(false);
      return;
    }

    const { data, error: skillsError } = await supabase
      .from("portfolio_skills")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (skillsError) {
      setError(skillsError.message);
      setLoading(false);
      return;
    }

    setSkills((data || []) as Skill[]);
    setLoading(false);
  }

  function handleFormChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  function handlePublishedChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setForm((current) => ({
      ...current,
      published: event.target.checked,
    }));

    setMessage("");
    setError("");
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
  }

  function startEditing(skill: Skill) {
    setEditingId(skill.id);

    setForm({
      category: skill.category,
      name: skill.name,
      sort_order: String(skill.sort_order),
      published: skill.published,
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const authenticated = await checkSession();

    if (!authenticated) {
      setSaving(false);
      return;
    }

    const name = form.name.trim();
    const category = form.category.trim();

    if (!name) {
      setError("Skill name is required.");
      setSaving(false);
      return;
    }

    if (!category) {
      setError("Skill category is required.");
      setSaving(false);
      return;
    }

    const parsedOrder = Number.parseInt(
      form.sort_order,
      10
    );

    const sortOrder = Number.isFinite(parsedOrder)
      ? parsedOrder
      : 1;

    const skillData = {
      category,
      name,
      sort_order: sortOrder,
      published: form.published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from("portfolio_skills")
          .update(skillData)
          .eq("id", editingId);

        if (updateError) {
          throw new Error(updateError.message);
        }

        setMessage("Skill updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("portfolio_skills")
          .insert(skillData);

        if (insertError) {
          throw new Error(insertError.message);
        }

        setMessage("Skill added successfully.");
      }

      resetForm();
      await loadSkills();
    } catch (submitError) {
      const errorMessage =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong.";

      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(skill: Skill) {
    setActionId(skill.id);
    setMessage("");
    setError("");

    const authenticated = await checkSession();

    if (!authenticated) {
      setActionId(null);
      return;
    }

    const { error: updateError } = await supabase
      .from("portfolio_skills")
      .update({
        published: !skill.published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", skill.id);

    if (updateError) {
      setError(updateError.message);
      setActionId(null);
      return;
    }

    setSkills((current) =>
      current.map((item) =>
        item.id === skill.id
          ? {
              ...item,
              published: !item.published,
            }
          : item
      )
    );

    setActionId(null);
  }

  async function deleteSkill(skill: Skill) {
    const confirmed = window.confirm(
      `Delete "${skill.name}" permanently?`
    );

    if (!confirmed) {
      return;
    }

    setActionId(skill.id);
    setMessage("");
    setError("");

    const authenticated = await checkSession();

    if (!authenticated) {
      setActionId(null);
      return;
    }

    const { error: deleteError } = await supabase
      .from("portfolio_skills")
      .delete()
      .eq("id", skill.id);

    if (deleteError) {
      setError(deleteError.message);
      setActionId(null);
      return;
    }

    setSkills((current) =>
      current.filter((item) => item.id !== skill.id)
    );

    if (editingId === skill.id) {
      resetForm();
    }

    setMessage("Skill deleted successfully.");
    setActionId(null);
  }

  const groupedSkills = categories.map((category) => ({
    category,
    skills: skills
      .filter((skill) => skill.category === category)
      .sort((a, b) => a.sort_order - b.sort_order),
  }));

  const uncategorizedSkills = skills.filter(
    (skill) => !categories.includes(skill.category)
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090909] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-5">
          <div className="text-sm text-white/40">
            Loading skills...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <header className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-6 inline-flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to dashboard
            </Link>

            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
              Admin
            </p>

            <h1 className="mt-3 text-4xl tracking-[-0.04em] text-white sm:text-5xl">
              Skills
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Manage the skills displayed on your About page.
            </p>
          </div>

          <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/40">
            {skills.length}{" "}
            {skills.length === 1 ? "skill" : "skills"}
          </div>
        </header>

        {/* STATUS */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
            <Check size={16} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-300">
            {error}
          </div>
        )}

        {/* ADD / EDIT FORM */}
        <section className="mb-8 rounded-3xl border border-white/10 bg-[#101010] p-5 sm:p-7">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                {editingId ? "Edit skill" : "New skill"}
              </p>

              <h2 className="mt-2 text-xl tracking-[-0.02em] text-white">
                {editingId
                  ? "Update skill"
                  : "Add a skill"}
              </h2>

              <p className="mt-2 text-sm text-white/35">
                Add skills that should appear on your public
                About page.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white"
              >
                <X size={14} />
                Cancel editing
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-5 md:grid-cols-[1fr_1fr_120px_auto]"
          >
            <label className="block">
              <span className="mb-2 block text-xs text-white/40">
                Skill name
              </span>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Python"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/15 focus:border-white/25 focus:bg-white/[0.05]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs text-white/40">
                Category
              </span>

              <select
                name="category"
                value={form.category}
                onChange={handleFormChange}
                className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-white/25"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs text-white/40">
                Order
              </span>

              <input
                type="number"
                name="sort_order"
                min="0"
                value={form.sort_order}
                onChange={handleFormChange}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-white/25"
              />
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    Saving
                  </>
                ) : editingId ? (
                  <>
                    <Save size={15} />
                    Update
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Add skill
                  </>
                )}
              </button>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-xs text-white/45 md:col-span-4">
              <input
                type="checkbox"
                checked={form.published}
                onChange={handlePublishedChange}
                className="h-4 w-4 accent-violet-400"
              />

              Published — show this skill on the public
              About page
            </label>
          </form>
        </section>

        {/* SKILLS LIST */}
        <section className="space-y-6">
          {groupedSkills.map((group) => {
            if (group.skills.length === 0) {
              return null;
            }

            return (
              <SkillCategory
                key={group.category}
                category={group.category}
                skills={group.skills}
                actionId={actionId}
                onEdit={startEditing}
                onTogglePublished={togglePublished}
                onDelete={deleteSkill}
              />
            );
          })}

          {uncategorizedSkills.length > 0 && (
            <SkillCategory
              category="Other"
              skills={uncategorizedSkills}
              actionId={actionId}
              onEdit={startEditing}
              onTogglePublished={togglePublished}
              onDelete={deleteSkill}
            />
          )}

          {skills.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-[#101010] p-10 text-center">
              <p className="text-sm text-white/35">
                No skills found.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* CATEGORY                                                                    */
/* -------------------------------------------------------------------------- */

type SkillCategoryProps = {
  category: string;
  skills: Skill[];
  actionId: string | null;
  onEdit: (skill: Skill) => void;
  onTogglePublished: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
};

function SkillCategory({
  category,
  skills,
  actionId,
  onEdit,
  onTogglePublished,
  onDelete,
}: SkillCategoryProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-7">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
            Category
          </p>

          <h2 className="mt-1 text-lg text-white/80">
            {category}
          </h2>
        </div>

        <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/30">
          {skills.length}
        </span>
      </div>

      <div className="divide-y divide-white/10">
        {skills.map((skill) => {
          const busy = actionId === skill.id;

          return (
            <div
              key={skill.id}
              className="flex flex-col gap-4 px-5 py-5 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-7"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-[10px] text-white/25">
                  {String(skill.sort_order).padStart(
                    2,
                    "0"
                  )}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm text-white/80">
                    {skill.name}
                  </p>

                  <p className="mt-1 text-xs text-white/25">
                    {skill.published
                      ? "Visible on website"
                      : "Hidden from website"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onTogglePublished(skill)
                  }
                  disabled={busy}
                  className={`rounded-full border px-3 py-2 text-xs transition-all disabled:opacity-40 ${
                    skill.published
                      ? "border-emerald-400/20 text-emerald-300/70 hover:bg-emerald-400/5"
                      : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {skill.published
                    ? "Published"
                    : "Hidden"}
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(skill)}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs text-white/40 transition-all hover:border-white/20 hover:text-white disabled:opacity-40"
                >
                  <Pencil size={13} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(skill)}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-full border border-red-400/10 px-3 py-2 text-xs text-red-300/50 transition-all hover:border-red-400/25 hover:bg-red-400/5 hover:text-red-300 disabled:opacity-40"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}