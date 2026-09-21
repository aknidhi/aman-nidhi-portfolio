"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  GraduationCap,
  Plus,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

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
  created_at: string;
};

type FormState = {
  institution: string;
  degree: string;
  specialization: string;
  start_year: string;
  end_year: string;
  status: string;
  grade: string;
  description: string;
  sort_order: string;
  published: boolean;
};

const emptyForm: FormState = {
  institution: "",
  degree: "",
  specialization: "",
  start_year: "",
  end_year: "",
  status: "",
  grade: "",
  description: "",
  sort_order: "0",
  published: true,
};

export default function AdminEducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const [error, setError] = useState("");

  async function loadEducation() {
    setIsLoading(true);
    setError("");

    const { data, error: loadError } = await supabase
      .from("education")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (loadError) {
      console.error("EDUCATION LOAD ERROR:", loadError);

      setError(
        `Unable to load education: ${loadError.message}`
      );

      setIsLoading(false);
      return;
    }

    setEducation(data || []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadEducation();
  }, []);

  function updateField(
    field: keyof FormState,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function openAddForm() {
    setError("");
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(item: Education) {
    setError("");

    setEditingId(item.id);

    setForm({
      institution: item.institution || "",
      degree: item.degree || "",
      specialization: item.specialization || "",
      start_year: item.start_year || "",
      end_year: item.end_year || "",
      status: item.status || "",
      grade: item.grade || "",
      description: item.description || "",
      sort_order: String(item.sort_order ?? 0),
      published: item.published,
    });

    setShowForm(true);
  }

  async function handleSave(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSaving(true);
    setError("");

    const payload = {
      institution: form.institution.trim(),
      degree: form.degree.trim(),
      specialization:
        form.specialization.trim() || null,
      start_year: form.start_year.trim(),
      end_year: form.end_year.trim() || null,
      status: form.status.trim() || null,
      grade: form.grade.trim() || null,
      description: form.description.trim() || null,
      sort_order: Number(form.sort_order) || 0,
      published: form.published,
      updated_at: new Date().toISOString(),
    };

    if (
      !payload.institution ||
      !payload.degree ||
      !payload.start_year
    ) {
      setError(
        "Institution, degree and start year are required."
      );

      setIsSaving(false);
      return;
    }

    if (editingId) {
      const { error: updateError } = await supabase
        .from("education")
        .update(payload)
        .eq("id", editingId);

      if (updateError) {
        setError(
          `Unable to update education: ${updateError.message}`
        );

        setIsSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("education")
        .insert(payload);

      if (insertError) {
        setError(
          `Unable to create education: ${insertError.message}`
        );

        setIsSaving(false);
        return;
      }
    }

    resetForm();
    setIsSaving(false);

    await loadEducation();
  }

  async function togglePublished(item: Education) {
    setActionId(item.id);
    setError("");

    const { error: updateError } = await supabase
      .from("education")
      .update({
        published: !item.published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    if (updateError) {
      setError(
        `Unable to update education: ${updateError.message}`
      );

      setActionId(null);
      return;
    }

    setEducation((current) =>
      current.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              published: !entry.published,
            }
          : entry
      )
    );

    setActionId(null);
  }

  async function deleteEducation(item: Education) {
    const confirmed = window.confirm(
      `Delete "${item.degree}" from ${item.institution} permanently?`
    );

    if (!confirmed) {
      return;
    }

    setActionId(item.id);
    setError("");

    const { error: deleteError } = await supabase
      .from("education")
      .delete()
      .eq("id", item.id);

    if (deleteError) {
      setError(
        `Unable to delete education: ${deleteError.message}`
      );

      setActionId(null);
      return;
    }

    setEducation((current) =>
      current.filter((entry) => entry.id !== item.id)
    );

    if (editingId === item.id) {
      resetForm();
    }

    setActionId(null);
  }

  return (
    <>
      <style jsx global>{`
        .education-admin-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .education-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .education-form-full {
          grid-column: 1 / -1;
        }

        .education-admin-form input,
        .education-admin-form textarea {
          width: 100%;
          padding: 13px 14px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--foreground);
          outline: none;
          font: inherit;
          transition:
            background-color 0.18s ease,
            color 0.18s ease,
            border-color 0.18s ease;
        }

        .education-admin-form input:focus,
        .education-admin-form textarea:focus {
          background: #ffffff;
          color: #111111;
          border-color: #ffffff;
        }

        .education-admin-form
          input:not(:placeholder-shown),
        .education-admin-form
          textarea:not(:placeholder-shown) {
          background: #ffffff;
          color: #111111;
          border-color: #ffffff;
        }

        .education-admin-form label {
          display: block;
          margin-bottom: 8px;
          color: var(--foreground);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .education-admin-form small {
          display: block;
          margin-top: 7px;
          color: var(--muted-dark);
          font-size: 10px;
        }

        .education-published {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--muted);
          font-size: 12px;
          cursor: pointer;
        }

        .education-published input {
          width: auto;
        }

        .education-form-actions {
          display: flex;
          gap: 10px;
          padding-top: 4px;
        }

        .education-list {
          display: flex;
          flex-direction: column;
        }

        .education-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 30px;
          padding: 22px 0;
          border-bottom: 1px solid var(--border);
        }

        .education-item:first-child {
          padding-top: 4px;
        }

        .education-item:last-child {
          border-bottom: 0;
          padding-bottom: 4px;
        }

        .education-item-info {
          min-width: 0;
        }

        .education-title-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .education-title-row h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 500;
        }

        .education-item-info > p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .education-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 18px;
          margin-top: 12px;
          color: var(--muted-dark);
          font-size: 11px;
        }

        .education-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 7px;
          flex: 0 0 auto;
        }

        .education-published-status,
        .education-draft-status {
          display: inline-flex;
          padding: 4px 7px;
          border: 1px solid var(--border);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .education-published-status {
          color: #a9c8ad;
        }

        .education-draft-status {
          color: var(--muted);
        }

        @media (max-width: 760px) {
          .education-form-grid {
            grid-template-columns: 1fr;
          }

          .education-form-full {
            grid-column: auto;
          }

          .education-item {
            flex-direction: column;
          }

          .education-actions {
            justify-content: flex-start;
          }
        }
      `}</style>

      <main className="admin-page">
        <div className="admin-container">
          <header className="admin-header admin-subpage-header">
            <div>
              <Link
                href="/admin"
                className="admin-back-link"
              >
                <ArrowLeft size={15} />
                Dashboard
              </Link>

              <p className="eyebrow">
                AMAN NIDHI / ADMIN
              </p>

              <h1>Education.</h1>

              <p className="admin-header-description">
                Manage the education displayed on your
                portfolio.
              </p>
            </div>

            <button
              type="button"
              className="admin-view-site"
              onClick={openAddForm}
            >
              <Plus size={15} />
              Add education
            </button>
          </header>

          {error && (
            <div className="admin-error">
              {error}
            </div>
          )}

          {showForm && (
            <section className="project-form-panel">
              <div className="admin-panel-header">
                <div>
                  <p className="eyebrow">
                    {editingId
                      ? "EDIT EDUCATION"
                      : "NEW EDUCATION"}
                  </p>

                  <h2>
                    {editingId
                      ? "Edit education"
                      : "Add education"}
                  </h2>
                </div>
              </div>

              <form
                className="education-admin-form"
                onSubmit={handleSave}
              >
                <div className="education-form-grid">
                  <div className="form-field">
                    <label htmlFor="institution">
                      Institution
                    </label>

                    <input
                      id="institution"
                      value={form.institution}
                      onChange={(e) =>
                        updateField(
                          "institution",
                          e.target.value
                        )
                      }
                      placeholder="Gurugram University"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="degree">
                      Degree
                    </label>

                    <input
                      id="degree"
                      value={form.degree}
                      onChange={(e) =>
                        updateField(
                          "degree",
                          e.target.value
                        )
                      }
                      placeholder="B.Tech"
                      required
                    />
                  </div>

                  <div className="form-field education-form-full">
                    <label htmlFor="specialization">
                      Specialization
                    </label>

                    <input
                      id="specialization"
                      value={form.specialization}
                      onChange={(e) =>
                        updateField(
                          "specialization",
                          e.target.value
                        )
                      }
                      placeholder="CSE (AI&DS)"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="start-year">
                      Start year
                    </label>

                    <input
                      id="start-year"
                      value={form.start_year}
                      onChange={(e) =>
                        updateField(
                          "start_year",
                          e.target.value
                        )
                      }
                      placeholder="2025"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="end-year">
                      End year
                    </label>

                    <input
                      id="end-year"
                      value={form.end_year}
                      onChange={(e) =>
                        updateField(
                          "end_year",
                          e.target.value
                        )
                      }
                      placeholder="2028"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="status">
                      Status
                    </label>

                    <input
                      id="status"
                      value={form.status}
                      onChange={(e) =>
                        updateField(
                          "status",
                          e.target.value
                        )
                      }
                      placeholder="Pursuing"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="grade">
                      Grade / CGPA
                    </label>

                    <input
                      id="grade"
                      value={form.grade}
                      onChange={(e) =>
                        updateField(
                          "grade",
                          e.target.value
                        )
                      }
                      placeholder="8.2 CGPA"
                    />
                  </div>

                  <div className="form-field education-form-full">
                    <label htmlFor="description">
                      Description
                    </label>

                    <textarea
                      id="description"
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        updateField(
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Add a short description about your education..."
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="sort-order">
                      Display order
                    </label>

                    <input
                      id="sort-order"
                      type="number"
                      value={form.sort_order}
                      onChange={(e) =>
                        updateField(
                          "sort_order",
                          e.target.value
                        )
                      }
                    />

                    <small>
                      Lower numbers appear first.
                    </small>
                  </div>

                  <label className="education-published">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) =>
                        updateField(
                          "published",
                          e.target.checked
                        )
                      }
                    />

                    <span>
                      Publish this education entry
                    </span>
                  </label>
                </div>

                <div className="education-form-actions">
                  <button
                    type="submit"
                    className="message-action-button"
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "Saving..."
                      : editingId
                        ? "Update education"
                        : "Save education"}
                  </button>

                  <button
                    type="button"
                    className="message-action-button"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="admin-project-list-panel">
            <div className="admin-panel-header">
              <div>
                <p className="eyebrow">
                  ACADEMIC BACKGROUND
                </p>

                <h2>
                  {education.length}{" "}
                  {education.length === 1
                    ? "entry"
                    : "entries"}
                </h2>
              </div>
            </div>

            {isLoading ? (
              <div className="admin-empty-state">
                Loading education...
              </div>
            ) : education.length === 0 ? (
              <div className="admin-empty-state">
                <GraduationCap size={24} />

                <p>
                  No education entries yet.
                </p>
              </div>
            ) : (
              <div className="education-list">
                {education.map((item) => (
                  <article
                    key={item.id}
                    className="education-item"
                  >
                    <div className="education-item-info">
                      <div className="education-title-row">
                        <h3>{item.degree}</h3>

                        <span
                          className={
                            item.published
                              ? "education-published-status"
                              : "education-draft-status"
                          }
                        >
                          {item.published
                            ? "Published"
                            : "Draft"}
                        </span>
                      </div>

                      <p>
                        {item.institution}
                        {item.specialization
                          ? ` · ${item.specialization}`
                          : ""}
                      </p>

                      <div className="education-meta">
                        <span>
                          {item.start_year}
                          {" — "}
                          {item.end_year || "Present"}
                        </span>

                        {item.status && (
                          <span>
                            {item.status}
                          </span>
                        )}

                        {item.grade && (
                          <span>
                            {item.grade}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="education-actions">
                      <button
                        type="button"
                        className="message-action-button"
                        onClick={() =>
                          togglePublished(item)
                        }
                        disabled={
                          actionId === item.id
                        }
                      >
                        {item.published
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <button
                        type="button"
                        className="message-action-button"
                        onClick={() =>
                          openEditForm(item)
                        }
                      >
                        Edit
                      </button>

                      <Link
                        href="/about"
                        target="_blank"
                        className="message-action-button"
                      >
                        View
                        <ArrowUpRight size={14} />
                      </Link>

                      <button
                        type="button"
                        className="message-delete-button"
                        onClick={() =>
                          deleteEducation(item)
                        }
                        disabled={
                          actionId === item.id
                        }
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="admin-footer">
            <span>
              AMAN. ADMIN
            </span>

            <Link href="/admin">
              Back to dashboard
            </Link>
          </footer>
        </div>
      </main>
    </>
  );
}