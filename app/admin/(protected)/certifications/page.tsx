"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Plus,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Certification = {
  id: string;
  title: string;
  organization: string;
  issue_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  description: string | null;
  sort_order: number;
  published: boolean;
  created_at: string;
};

type FormState = {
  title: string;
  organization: string;
  issue_date: string;
  credential_id: string;
  credential_url: string;
  description: string;
  sort_order: string;
  published: boolean;
};

const emptyForm: FormState = {
  title: "",
  organization: "",
  issue_date: "",
  credential_id: "",
  credential_url: "",
  description: "",
  sort_order: "0",
  published: true,
};

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<
    Certification[]
  >([]);

  const [form, setForm] =
    useState<FormState>(emptyForm);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [actionId, setActionId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  async function loadCertifications() {
    setIsLoading(true);
    setError("");

    const {
      data,
      error: loadError,
    } = await supabase
      .from("certifications")
      .select("*")
      .order("sort_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    if (loadError) {
      console.error(
        "CERTIFICATION LOAD ERROR:",
        loadError
      );

      setError(
        `Unable to load certifications: ${loadError.message}`
      );

      setIsLoading(false);
      return;
    }

    setCertifications(data || []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadCertifications();
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

  function openEditForm(
    certification: Certification
  ) {
    setError("");

    setEditingId(certification.id);

    setForm({
      title: certification.title || "",
      organization:
        certification.organization || "",
      issue_date:
        certification.issue_date || "",
      credential_id:
        certification.credential_id || "",
      credential_url:
        certification.credential_url || "",
      description:
        certification.description || "",
      sort_order: String(
        certification.sort_order ?? 0
      ),
      published: certification.published,
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
      title: form.title.trim(),
      organization:
        form.organization.trim(),
      issue_date:
        form.issue_date.trim() || null,
      credential_id:
        form.credential_id.trim() || null,
      credential_url:
        form.credential_url.trim() || null,
      description:
        form.description.trim() || null,
      sort_order:
        Number(form.sort_order) || 0,
      published: form.published,
      updated_at:
        new Date().toISOString(),
    };

    if (
      !payload.title ||
      !payload.organization
    ) {
      setError(
        "Title and organization are required."
      );

      setIsSaving(false);
      return;
    }

    if (editingId) {
      const {
        error: updateError,
      } = await supabase
        .from("certifications")
        .update(payload)
        .eq("id", editingId);

      if (updateError) {
        setError(
          `Unable to update certification: ${updateError.message}`
        );

        setIsSaving(false);
        return;
      }
    } else {
      const {
        error: insertError,
      } = await supabase
        .from("certifications")
        .insert(payload);

      if (insertError) {
        setError(
          `Unable to create certification: ${insertError.message}`
        );

        setIsSaving(false);
        return;
      }
    }

    resetForm();
    setIsSaving(false);

    await loadCertifications();
  }

  async function togglePublished(
    certification: Certification
  ) {
    setActionId(certification.id);
    setError("");

    const {
      error: updateError,
    } = await supabase
      .from("certifications")
      .update({
        published:
          !certification.published,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", certification.id);

    if (updateError) {
      setError(
        `Unable to update certification: ${updateError.message}`
      );

      setActionId(null);
      return;
    }

    setCertifications((current) =>
      current.map((item) =>
        item.id === certification.id
          ? {
              ...item,
              published:
                !item.published,
            }
          : item
      )
    );

    setActionId(null);
  }

  async function deleteCertification(
    certification: Certification
  ) {
    const confirmed =
      window.confirm(
        `Delete "${certification.title}" permanently?`
      );

    if (!confirmed) {
      return;
    }

    setActionId(certification.id);
    setError("");

    const {
      error: deleteError,
    } = await supabase
      .from("certifications")
      .delete()
      .eq("id", certification.id);

    if (deleteError) {
      setError(
        `Unable to delete certification: ${deleteError.message}`
      );

      setActionId(null);
      return;
    }

    setCertifications((current) =>
      current.filter(
        (item) =>
          item.id !== certification.id
      )
    );

    if (
      editingId === certification.id
    ) {
      resetForm();
    }

    setActionId(null);
  }

  return (
    <>
      <style jsx global>{`
        .certification-admin-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .certification-form-grid {
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 18px;
        }

        .certification-form-full {
          grid-column: 1 / -1;
        }

        .certification-admin-form input,
        .certification-admin-form textarea {
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

        .certification-admin-form input:focus,
        .certification-admin-form textarea:focus {
          background: #ffffff;
          color: #111111;
          border-color: #ffffff;
        }

        .certification-admin-form
          input:not(:placeholder-shown),
        .certification-admin-form
          textarea:not(:placeholder-shown) {
          background: #ffffff;
          color: #111111;
          border-color: #ffffff;
        }

        .certification-admin-form label {
          display: block;
          margin-bottom: 8px;
          color: var(--foreground);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .certification-published {
          display: flex;
          align-items: center;
          gap: 9px;
          color: var(--muted);
          font-size: 12px;
          cursor: pointer;
        }

        .certification-published input {
          width: auto;
        }

        .certification-form-actions {
          display: flex;
          gap: 10px;
        }

        .certification-list {
          display: flex;
          flex-direction: column;
        }

        .certification-item {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 30px;
          padding: 22px 0;
          border-bottom: 1px solid var(--border);
        }

        .certification-item:first-child {
          padding-top: 4px;
        }

        .certification-item:last-child {
          border-bottom: 0;
          padding-bottom: 4px;
        }

        .certification-info {
          min-width: 0;
        }

        .certification-title-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .certification-title-row h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 500;
        }

        .certification-info > p {
          margin: 7px 0 0;
          color: var(--muted);
          font-size: 13px;
        }

        .certification-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 18px;
          margin-top: 12px;
          color: var(--muted-dark);
          font-size: 11px;
        }

        .certification-description {
          max-width: 700px;
          margin-top: 10px;
          color: var(--muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .certification-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 7px;
          flex: 0 0 auto;
        }

        .certification-published-status,
        .certification-draft-status {
          display: inline-flex;
          padding: 4px 7px;
          border: 1px solid var(--border);
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .certification-published-status {
          color: #a9c8ad;
        }

        .certification-draft-status {
          color: var(--muted);
        }

        @media (max-width: 760px) {
          .certification-form-grid {
            grid-template-columns: 1fr;
          }

          .certification-form-full {
            grid-column: auto;
          }

          .certification-item {
            flex-direction: column;
          }

          .certification-actions {
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

              <h1>Certifications.</h1>

              <p className="admin-header-description">
                Manage the certifications displayed
                on your portfolio.
              </p>
            </div>

            <button
              type="button"
              className="admin-view-site"
              onClick={openAddForm}
            >
              <Plus size={15} />
              Add certification
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
                      ? "EDIT CERTIFICATION"
                      : "NEW CERTIFICATION"}
                  </p>

                  <h2>
                    {editingId
                      ? "Edit certification"
                      : "Add certification"}
                  </h2>
                </div>
              </div>

              <form
                className="certification-admin-form"
                onSubmit={handleSave}
              >
                <div className="certification-form-grid">
                  <div className="form-field">
                    <label htmlFor="cert-title">
                      Certification title
                    </label>

                    <input
                      id="cert-title"
                      value={form.title}
                      onChange={(e) =>
                        updateField(
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="Machine Learning Specialization"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="cert-organization">
                      Organization
                    </label>

                    <input
                      id="cert-organization"
                      value={form.organization}
                      onChange={(e) =>
                        updateField(
                          "organization",
                          e.target.value
                        )
                      }
                      placeholder="Coursera / Google / IBM"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="cert-date">
                      Issue date
                    </label>

                    <input
                      id="cert-date"
                      value={form.issue_date}
                      onChange={(e) =>
                        updateField(
                          "issue_date",
                          e.target.value
                        )
                      }
                      placeholder="August 2026"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="cert-id">
                      Credential ID
                    </label>

                    <input
                      id="cert-id"
                      value={form.credential_id}
                      onChange={(e) =>
                        updateField(
                          "credential_id",
                          e.target.value
                        )
                      }
                      placeholder="ABC123XYZ"
                    />
                  </div>

                  <div className="form-field certification-form-full">
                    <label htmlFor="cert-url">
                      Credential URL
                    </label>

                    <input
                      id="cert-url"
                      type="url"
                      value={form.credential_url}
                      onChange={(e) =>
                        updateField(
                          "credential_url",
                          e.target.value
                        )
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-field certification-form-full">
                    <label htmlFor="cert-description">
                      Description
                    </label>

                    <textarea
                      id="cert-description"
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        updateField(
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Add a short description about this certification..."
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="cert-order">
                      Display order
                    </label>

                    <input
                      id="cert-order"
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

                  <label className="certification-published">
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
                      Publish this certification
                    </span>
                  </label>
                </div>

                <div className="certification-form-actions">
                  <button
                    type="submit"
                    className="message-action-button"
                    disabled={isSaving}
                  >
                    {isSaving
                      ? "Saving..."
                      : editingId
                        ? "Update certification"
                        : "Save certification"}
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
                  CREDENTIALS
                </p>

                <h2>
                  {certifications.length}{" "}
                  {certifications.length === 1
                    ? "certification"
                    : "certifications"}
                </h2>
              </div>
            </div>

            {isLoading ? (
              <div className="admin-empty-state">
                Loading certifications...
              </div>
            ) : certifications.length === 0 ? (
              <div className="admin-empty-state">
                <Award size={24} />

                <p>
                  No certifications yet.
                </p>
              </div>
            ) : (
              <div className="certification-list">
                {certifications.map(
                  (certification) => (
                    <article
                      key={certification.id}
                      className="certification-item"
                    >
                      <div className="certification-info">
                        <div className="certification-title-row">
                          <h3>
                            {certification.title}
                          </h3>

                          <span
                            className={
                              certification.published
                                ? "certification-published-status"
                                : "certification-draft-status"
                            }
                          >
                            {certification.published
                              ? "Published"
                              : "Draft"}
                          </span>
                        </div>

                        <p>
                          {certification.organization}
                        </p>

                        <div className="certification-meta">
                          {certification.issue_date && (
                            <span>
                              {certification.issue_date}
                            </span>
                          )}

                          {certification.credential_id && (
                            <span>
                              ID:{" "}
                              {certification.credential_id}
                            </span>
                          )}
                        </div>

                        {certification.description && (
                          <p className="certification-description">
                            {certification.description}
                          </p>
                        )}
                      </div>

                      <div className="certification-actions">
                        <button
                          type="button"
                          className="message-action-button"
                          onClick={() =>
                            togglePublished(
                              certification
                            )
                          }
                          disabled={
                            actionId ===
                            certification.id
                          }
                        >
                          {certification.published
                            ? "Unpublish"
                            : "Publish"}
                        </button>

                        <button
                          type="button"
                          className="message-action-button"
                          onClick={() =>
                            openEditForm(
                              certification
                            )
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
                          <ArrowUpRight
                            size={14}
                          />
                        </Link>

                        {certification.credential_url && (
                          <a
                            href={
                              certification.credential_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="message-action-button"
                          >
                            Credential
                            <ArrowUpRight
                              size={14}
                            />
                          </a>
                        )}

                        <button
                          type="button"
                          className="message-delete-button"
                          onClick={() =>
                            deleteCertification(
                              certification
                            )
                          }
                          disabled={
                            actionId ===
                            certification.id
                          }
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </article>
                  )
                )}
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