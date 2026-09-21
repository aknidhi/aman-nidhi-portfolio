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
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

type Skill = {
  id: string;
  category: string;
  name: string;
  fluency: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

type SkillForm = {
  category: string;
  name: string;
  fluency: string[];
  sort_order: string;
  published: boolean;
};

type EditingSection = "technical" | "language" | null;

const technicalCategories = [
  "AI / Machine Learning",
  "Programming Languages",
  "Data Analytics",
  "Frameworks",
  "Databases",
  "AI Tools",
  "Other",
];

const emptyTechnicalForm: SkillForm = {
  category: "AI / Machine Learning",
  name: "",
  fluency: [],
  sort_order: "1",
  published: true,
};

const emptyLanguageForm: SkillForm = {
  category: "Speaking Languages",
  name: "",
  fluency: [],
  sort_order: "1",
  published: true,
};

const fluencyOptions = ["Speak", "Read", "Write"];

export default function AdminSkillsPage() {
  const supabase = createClient();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [technicalForm, setTechnicalForm] =
    useState<SkillForm>(emptyTechnicalForm);
  const [languageForm, setLanguageForm] =
    useState<SkillForm>(emptyLanguageForm);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSection, setEditingSection] =
    useState<EditingSection>(null);

  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] =
    useState<EditingSection>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSkills();
  }, []);

  async function loadSkills() {
    setLoading(true);
    setError("");

    const { data, error: skillsError } = await supabase
      .from("portfolio_skills")
      .select("*")
      .order("category", { ascending: true })
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (skillsError) {
      setError(`Unable to load skills: ${skillsError.message}`);
      setLoading(false);
      return;
    }

    setSkills((data || []) as Skill[]);
    setLoading(false);
  }

  function clearStatus() {
    setMessage("");
    setError("");
  }

  function handleTechnicalFormChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setTechnicalForm((current) => ({
      ...current,
      [name]: value,
    }));

    clearStatus();
  }

  function handleLanguageFormChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setLanguageForm((current) => ({
      ...current,
      [name]: value,
    }));

    clearStatus();
  }

  function handlePublishedChange(
    section: "technical" | "language",
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (section === "technical") {
      setTechnicalForm((current) => ({
        ...current,
        published: event.target.checked,
      }));
    } else {
      setLanguageForm((current) => ({
        ...current,
        published: event.target.checked,
      }));
    }

    clearStatus();
  }

  function handleFluencyChange(option: string) {
    setLanguageForm((current) => {
      const exists = current.fluency.includes(option);

      return {
        ...current,
        fluency: exists
          ? current.fluency.filter((item) => item !== option)
          : [...current.fluency, option],
      };
    });

    clearStatus();
  }

  function resetTechnicalForm() {
    setTechnicalForm(emptyTechnicalForm);
    if (editingSection === "technical") {
      setEditingId(null);
      setEditingSection(null);
    }
    clearStatus();
  }

  function resetLanguageForm() {
    setLanguageForm(emptyLanguageForm);
    if (editingSection === "language") {
      setEditingId(null);
      setEditingSection(null);
    }
    clearStatus();
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingSection(null);
    setTechnicalForm(emptyTechnicalForm);
    setLanguageForm(emptyLanguageForm);
    clearStatus();
  }

  function startEditing(skill: Skill) {
    const fluency =
      skill.fluency
        ?.split(" · ")
        .map((item) => item.trim())
        .filter(Boolean) || [];

    setEditingId(skill.id);

    if (skill.category === "Speaking Languages") {
      setEditingSection("language");
      setLanguageForm({
        category: "Speaking Languages",
        name: skill.name,
        fluency,
        sort_order: String(skill.sort_order),
        published: skill.published,
      });
    } else {
      setEditingSection("technical");
      setTechnicalForm({
        category: skill.category,
        name: skill.name,
        fluency: [],
        sort_order: String(skill.sort_order),
        published: skill.published,
      });
    }

    clearStatus();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    section: "technical" | "language"
  ) {
    event.preventDefault();

    setSavingSection(section);
    clearStatus();

    const form =
      section === "technical"
        ? technicalForm
        : languageForm;

    const category =
      section === "technical"
        ? form.category.trim()
        : "Speaking Languages";

    const name = form.name.trim();

    if (!name) {
      setError(
        section === "technical"
          ? "Technical skill name is required."
          : "Speaking language name is required."
      );
      setSavingSection(null);
      return;
    }

    if (!category) {
      setError("Category is required.");
      setSavingSection(null);
      return;
    }

    if (
      section === "language" &&
      form.fluency.length === 0
    ) {
      setError("Select at least one fluency option.");
      setSavingSection(null);
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
      fluency:
        section === "language"
          ? form.fluency.join(" · ")
          : null,
      sort_order: sortOrder,
      published: form.published,
      updated_at: new Date().toISOString(),
    };

    try {
      if (editingId && editingSection === section) {
        const { error: updateError } = await supabase
          .from("portfolio_skills")
          .update(skillData)
          .eq("id", editingId);

        if (updateError) {
          throw new Error(updateError.message);
        }

        setMessage(
          section === "technical"
            ? "Technical skill updated successfully."
            : "Speaking language updated successfully."
        );
      } else {
        const { error: insertError } = await supabase
          .from("portfolio_skills")
          .insert(skillData);

        if (insertError) {
          throw new Error(insertError.message);
        }

        setMessage(
          section === "technical"
            ? "Technical skill added successfully."
            : "Speaking language added successfully."
        );
      }

      setEditingId(null);
      setEditingSection(null);
      setTechnicalForm(emptyTechnicalForm);
      setLanguageForm(emptyLanguageForm);

      await loadSkills();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong."
      );
    } finally {
      setSavingSection(null);
    }
  }

  async function togglePublished(skill: Skill) {
    setActionId(skill.id);
    clearStatus();

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

    setMessage(
      skill.published
        ? "Entry hidden successfully."
        : "Entry published successfully."
    );

    setActionId(null);
  }

  async function deleteSkill(skill: Skill) {
    const confirmed = window.confirm(
      `Delete "${skill.name}" permanently?`
    );

    if (!confirmed) return;

    setActionId(skill.id);
    clearStatus();

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
      cancelEditing();
    }

    setMessage("Entry deleted successfully.");
    setActionId(null);
  }

  const groupedTechnicalSkills =
    technicalCategories.map((category) => ({
      category,
      skills: skills
        .filter((skill) => skill.category === category)
        .sort((a, b) => a.sort_order - b.sort_order),
    }));

  const speakingLanguages = skills
    .filter(
      (skill) => skill.category === "Speaking Languages"
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  const uncategorizedSkills = skills.filter(
    (skill) =>
      skill.category !== "Speaking Languages" &&
      !technicalCategories.includes(skill.category)
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
              Manage technical skills and speaking
              languages separately.
            </p>
          </div>

          <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/40">
            {skills.length}{" "}
            {skills.length === 1 ? "entry" : "entries"}
          </div>
        </header>

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

        {/* =====================================================
            TECHNICAL SKILLS
        ===================================================== */}
        <section className="mb-12">
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-violet-300/50">
              Technical
            </p>

            <h2 className="mt-2 text-2xl tracking-[-0.03em] text-white">
              Technical Skills
            </h2>

            <p className="mt-2 text-sm text-white/30">
              Add and manage programming, AI/ML,
              frameworks, databases and analytics skills.
            </p>
          </div>

          <div className="mb-7 rounded-3xl border border-white/10 bg-[#101010] p-5 sm:p-7">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  {editingSection === "technical"
                    ? "Edit technical skill"
                    : "New technical skill"}
                </p>

                <h3 className="mt-2 text-xl tracking-[-0.02em] text-white">
                  {editingSection === "technical"
                    ? "Update technical skill"
                    : "Add technical skill"}
                </h3>
              </div>

              {editingSection === "technical" && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white"
                >
                  <X size={14} />
                  Cancel
                </button>
              )}
            </div>

            <form
              onSubmit={(event) =>
                handleSubmit(event, "technical")
              }
              className="grid gap-5 md:grid-cols-[1fr_1fr_120px_auto]"
            >
              <label className="block">
                <span className="mb-2 block text-xs text-white/40">
                  Skill name
                </span>

                <input
                  type="text"
                  name="name"
                  value={technicalForm.name}
                  onChange={handleTechnicalFormChange}
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
                  value={technicalForm.category}
                  onChange={handleTechnicalFormChange}
                  className="w-full rounded-2xl border border-white/10 bg-[#151515] px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-white/25"
                >
                  {technicalCategories.map((category) => (
                    <option key={category} value={category}>
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
                  value={technicalForm.sort_order}
                  onChange={handleTechnicalFormChange}
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-white/25"
                />
              </label>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={savingSection === "technical"}
                  className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                >
                  {savingSection === "technical" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      Saving
                    </>
                  ) : editingSection === "technical" ? (
                    <>
                      <Save size={15} />
                      Update
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add
                    </>
                  )}
                </button>
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-xs text-white/45 md:col-span-4">
                <input
                  type="checkbox"
                  checked={technicalForm.published}
                  onChange={(event) =>
                    handlePublishedChange(
                      "technical",
                      event
                    )
                  }
                  className="h-4 w-4 accent-violet-400"
                />
                Published — show this skill on the public
                website
              </label>
            </form>
          </div>

          <div className="space-y-6">
            {groupedTechnicalSkills.map((group) => {
              if (group.skills.length === 0) return null;

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
          </div>
        </section>

        {/* =====================================================
            SPEAKING LANGUAGES
        ===================================================== */}
        <section className="mb-8 border-t border-white/10 pt-12">
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-violet-300/50">
              Communication
            </p>

            <h2 className="mt-2 text-2xl tracking-[-0.03em] text-white">
              Speaking Languages
            </h2>

            <p className="mt-2 text-sm text-white/30">
              Manage Hindi, English and other languages
              separately from your technical skills.
            </p>
          </div>

          <div className="mb-7 rounded-3xl border border-white/10 bg-[#101010] p-5 sm:p-7">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                  {editingSection === "language"
                    ? "Edit speaking language"
                    : "New speaking language"}
                </p>

                <h3 className="mt-2 text-xl tracking-[-0.02em] text-white">
                  {editingSection === "language"
                    ? "Update speaking language"
                    : "Add speaking language"}
                </h3>
              </div>

              {editingSection === "language" && (
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white"
                >
                  <X size={14} />
                  Cancel
                </button>
              )}
            </div>

            <form
              onSubmit={(event) =>
                handleSubmit(event, "language")
              }
              className="space-y-6"
            >
              <div className="grid gap-5 md:grid-cols-[1fr_120px_auto]">
                <label className="block">
                  <span className="mb-2 block text-xs text-white/40">
                    Language
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={languageForm.name}
                    onChange={handleLanguageFormChange}
                    placeholder="English"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-white/15 focus:border-white/25 focus:bg-white/[0.05]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs text-white/40">
                    Order
                  </span>

                  <input
                    type="number"
                    name="sort_order"
                    min="0"
                    value={languageForm.sort_order}
                    onChange={handleLanguageFormChange}
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none transition-all focus:border-white/25"
                  />
                </label>

                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={savingSection === "language"}
                    className="inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                  >
                    {savingSection === "language" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                        Saving
                      </>
                    ) : editingSection === "language" ? (
                      <>
                        <Save size={15} />
                        Update
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <span className="mb-3 block text-xs text-white/40">
                  Fluency
                </span>

                <div className="flex flex-wrap gap-3">
                  {fluencyOptions.map((option) => {
                    const selected =
                      languageForm.fluency.includes(option);

                    return (
                      <label
                        key={option}
                        className={`flex cursor-pointer items-center gap-3 rounded-full border px-4 py-2.5 text-xs transition-all ${
                          selected
                            ? "border-violet-400/30 bg-violet-400/10 text-violet-200"
                            : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/20 hover:text-white/70"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() =>
                            handleFluencyChange(option)
                          }
                          className="h-3.5 w-3.5 accent-violet-400"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>

                <p className="mt-3 text-xs text-white/20">
                  Select all that apply.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-3 text-xs text-white/45">
                <input
                  type="checkbox"
                  checked={languageForm.published}
                  onChange={(event) =>
                    handlePublishedChange(
                      "language",
                      event
                    )
                  }
                  className="h-4 w-4 accent-violet-400"
                />
                Published — show this language on the public
                website
              </label>
            </form>
          </div>

          {speakingLanguages.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#101010] p-8">
              <p className="text-sm text-white/35">
                No speaking languages added yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#101010]">
              <div className="divide-y divide-white/10">
                {speakingLanguages.map((skill) => {
                  const busy = actionId === skill.id;

                  return (
                    <div
                      key={skill.id}
                      className="flex flex-col gap-5 px-5 py-5 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-7"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-[10px] text-white/25">
                          {String(skill.sort_order).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <div className="min-w-0">
                          <p className="text-sm text-white/80">
                            {skill.name}
                          </p>

                          <p className="mt-1 text-xs text-white/30">
                            {skill.fluency ||
                              "No fluency selected"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            togglePublished(skill)
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
                          onClick={() =>
                            startEditing(skill)
                          }
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs text-white/40 transition-all hover:border-white/20 hover:text-white disabled:opacity-40"
                        >
                          <Pencil size={13} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteSkill(skill)
                          }
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
          )}
        </section>
      </div>
    </main>
  );
}

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
                  {String(skill.sort_order).padStart(2, "0")}
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
                  onClick={() => onTogglePublished(skill)}
                  disabled={busy}
                  className={`rounded-full border px-3 py-2 text-xs transition-all disabled:opacity-40 ${
                    skill.published
                      ? "border-emerald-400/20 text-emerald-300/70 hover:bg-emerald-400/5"
                      : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/60"
                  }`}
                >
                  {skill.published ? "Published" : "Hidden"}
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
