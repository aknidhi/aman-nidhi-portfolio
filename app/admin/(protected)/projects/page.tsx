"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  FolderKanban,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type Project = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  category: string;
  year: string;
  github: string;
  live: string | null;
  technologies: string[];
  features: string[];
  problem_title: string;
  problem_description: string;
  solution_title: string;
  solution_description: string;
  sort_order: number;
  published: boolean;
  created_at: string;
};

type ProjectImage = {
  id: string;
  storage_path: string;
  alt: string;
  sort_order: number;
  public_url?: string;
};

const emptyForm = {
  title: "",
  slug: "",
  short_description: "",
  description: "",
  category: "",
  year: new Date().getFullYear().toString(),
  github: "",
  live: "",
  technologies: "",
  features: "",
  problem_title: "",
  problem_description: "",
  solution_title: "",
  solution_description: "",
  sort_order: "0",
  published: true,
};

type TextField =
  | "title"
  | "slug"
  | "short_description"
  | "description"
  | "category"
  | "year"
  | "github"
  | "live"
  | "technologies"
  | "features"
  | "problem_title"
  | "problem_description"
  | "solution_title"
  | "solution_description"
  | "sort_order";

export default function AdminProjectsPage() {
  const supabase = createClient();

  const router = useRouter();
  const searchParams = useSearchParams();
  const editProjectId = searchParams.get("edit");

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingProjectId, setEditingProjectId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState(emptyForm);

  const [selectedImages, setSelectedImages] =
    useState<File[]>([]);

  const [existingImages, setExistingImages] =
    useState<ProjectImage[]>([]);

  const [filledFields, setFilledFields] =
    useState<Set<TextField>>(new Set());

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [actionId, setActionId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  /*
   * Load projects.
   *
   * Authentication is handled by the protected
   * admin route and Supabase proxy.
   *
   * This page does NOT refresh or redirect the
   * admin session itself.
   */
  async function loadProjects() {
    setError("");

    const { data, error } =
      await supabase
        .from("projects")
        .select("*")
        .order("sort_order", {
          ascending: true,
        })
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(
        "PROJECT LOAD ERROR:",
        {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        }
      );

      setError(
        `Unable to load projects: ${error.message}${
          error.details
            ? ` | ${error.details}`
            : ""
        }${
          error.hint
            ? ` | Hint: ${error.hint}`
            : ""
        }`
      );

      setIsLoading(false);
      return;
    }

    setProjects(data || []);
    setIsLoading(false);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (!editProjectId) {
      return;
    }

    loadProjectForEdit(editProjectId);
  }, [editProjectId]);

  async function loadProjectForEdit(
    projectId: string
  ) {
    setError("");

    const { data, error } =
      await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

    if (error || !data) {
      setError(
        error?.message ||
          "Unable to load the selected project."
      );
      return;
    }

    const project = data as Project;

    setForm({
      title: project.title || "",
      slug: project.slug || "",
      short_description:
        project.short_description || "",
      description: project.description || "",
      category: project.category || "",
      year: project.year || "",
      github: project.github || "",
      live: project.live || "",
      technologies:
        Array.isArray(project.technologies)
          ? project.technologies.join(", ")
          : "",
      features:
        Array.isArray(project.features)
          ? project.features.join(", ")
          : "",
      problem_title:
        project.problem_title || "",
      problem_description:
        project.problem_description || "",
      solution_title:
        project.solution_title || "",
      solution_description:
        project.solution_description || "",
      sort_order: String(
        project.sort_order ?? 0
      ),
      published: project.published,
    });

    setFilledFields(
      new Set([
        "title",
        "slug",
        "short_description",
        "description",
        "category",
        "year",
        "github",
        ...(project.live
          ? ["live" as TextField]
          : []),
        ...(project.technologies?.length
          ? ["technologies" as TextField]
          : []),
        ...(project.features?.length
          ? ["features" as TextField]
          : []),
        "problem_title",
        "problem_description",
        "solution_title",
        "solution_description",
        "sort_order",
      ])
    );

    const {
      data: imageData,
      error: imageError,
    } = await supabase
      .from("project_images")
      .select(
        "id, storage_path, alt, sort_order"
      )
      .eq("project_id", project.id)
      .order("sort_order", {
        ascending: true,
      });

    if (imageError) {
      console.error(
        "PROJECT IMAGE LOAD ERROR:",
        {
          message: imageError.message,
          details: imageError.details,
          hint: imageError.hint,
          code: imageError.code,
          projectId: project.id,
        }
      );

      setError(
        `Project loaded, but screenshots could not be loaded: ${imageError.message}`
      );
    }

    const loadedImages: ProjectImage[] =
      (imageData || []).map((image) => ({
        id: image.id,
        storage_path: image.storage_path,
        alt: image.alt,
        sort_order: image.sort_order,
        public_url:
          supabase.storage
            .from("project-images")
            .getPublicUrl(
              image.storage_path
            ).data.publicUrl,
      }));

    setEditingProjectId(project.id);
    setShowForm(true);
    setSelectedImages([]);
    setExistingImages(loadedImages);
  }

  function updateTextField(
    field: TextField,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFilledFields((current) => {
      const next = new Set(current);

      if (value.trim().length > 0) {
        next.add(field);
      } else {
        next.delete(field);
      }

      return next;
    });
  }

  function updateBooleanField(
    field: "published",
    value: boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function isFieldFilled(
    field: TextField
  ) {
    return filledFields.has(field);
  }

  function handleImageSelection(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files || []
    );

    if (files.length === 0) {
      return;
    }

    const validFiles = files.filter(
      (file) => {
        if (!file.type.startsWith("image/")) {
          return false;
        }

        if (file.size > 10 * 1024 * 1024) {
          return false;
        }

        return true;
      }
    );

    if (
      validFiles.length !== files.length
    ) {
      setError(
        "Only image files up to 10 MB each are allowed."
      );
    } else {
      setError("");
    }

    setSelectedImages((current) => [
      ...current,
      ...validFiles,
    ]);

    event.target.value = "";
  }

  function removeSelectedImage(
    index: number
  ) {
    setSelectedImages((current) =>
      current.filter(
        (_, imageIndex) =>
          imageIndex !== index
      )
    );
  }

  async function uploadProjectImages(
    projectId: string,
    projectSlug: string
  ) {
    if (selectedImages.length === 0) {
      return;
    }

    for (
      let index = 0;
      index < selectedImages.length;
      index++
    ) {
      const file = selectedImages[index];

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() || "png";

      const safeName =
        file.name
          .replace(/\.[^/.]+$/, "")
          .replace(
            /[^a-zA-Z0-9-_]/g,
            "-"
          )
          .toLowerCase() || "image";

      const filePath =
        `${projectSlug}/${crypto.randomUUID()}-${safeName}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("project-images")
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          }
        );

      if (uploadError) {
        throw new Error(
          `Image upload failed for "${file.name}": ${uploadError.message}`
        );
      }

      const {
        error: imageRecordError,
      } = await supabase
        .from("project_images")
        .insert({
          project_id: projectId,
          storage_path: filePath,
          alt: `${form.title.trim()} screenshot ${
            index + 1
          }`,
          sort_order:
            existingImages.reduce(
              (max, image) =>
                Math.max(
                  max,
                  image.sort_order
                ),
              -1
            ) +
            index +
            1,
        });

      if (imageRecordError) {
        throw new Error(
          `Image record could not be saved: ${imageRecordError.message}`
        );
      }

      setExistingImages((current) => [
        ...current,
        {
          id: `new-${crypto.randomUUID()}`,
          storage_path: filePath,
          alt: `${form.title.trim()} screenshot ${
            index + 1
          }`,
          sort_order:
            current.reduce(
              (max, image) =>
                Math.max(
                  max,
                  image.sort_order
                ),
              -1
            ) + 1,
        },
      ]);
    }
  }

  async function deleteExistingImage(
    image: ProjectImage
  ) {
    const confirmed = window.confirm(
      "Delete this screenshot permanently?"
    );

    if (!confirmed) {
      return;
    }

    setError("");

    const {
      error: storageError,
    } = await supabase.storage
      .from("project-images")
      .remove([image.storage_path]);

    if (storageError) {
      setError(
        `Unable to delete screenshot: ${storageError.message}`
      );
      return;
    }

    const {
      error: recordError,
    } = await supabase
      .from("project_images")
      .delete()
      .eq("id", image.id);

    if (recordError) {
      setError(
        `Image file deleted, but database record could not be removed: ${recordError.message}`
      );
      return;
    }

    setExistingImages((current) =>
      current.filter(
        (item) => item.id !== image.id
      )
    );
  }

  async function handleCreateProject(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSaving(true);
    setError("");

    const technologies =
      form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const features =
      form.features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const {
      data: createdProject,
      error,
    } = await supabase
      .from("projects")
      .insert({
        title: form.title.trim(),
        slug: form.slug.trim(),
        short_description:
          form.short_description.trim(),
        description:
          form.description.trim(),
        category: form.category.trim(),
        year: form.year.trim(),
        github: form.github.trim(),
        live:
          form.live.trim() || null,
        technologies,
        features,
        problem_title:
          form.problem_title.trim(),
        problem_description:
          form.problem_description.trim(),
        solution_title:
          form.solution_title.trim(),
        solution_description:
          form.solution_description.trim(),
        sort_order:
          Number(form.sort_order) || 0,
        published: form.published,
      })
      .select("id, slug")
      .single();

    if (error || !createdProject) {
      console.error(
        "PROJECT CREATION ERROR:",
        {
          message: error?.message,
          details: error?.details,
          hint: error?.hint,
          code: error?.code,
        }
      );

      setError(
        error?.message ||
          error?.details ||
          error?.hint ||
          "Unable to create project."
      );

      setIsSaving(false);
      return;
    }

    try {
      await uploadProjectImages(
        createdProject.id,
        createdProject.slug
      );
    } catch (imageError) {
      setError(
        imageError instanceof Error
          ? `Project created, but ${imageError.message}`
          : "Project created, but image upload failed."
      );

      setForm(emptyForm);
      setSelectedImages([]);
      setFilledFields(new Set());
      setIsSaving(false);

      await loadProjects();
      return;
    }

    setForm(emptyForm);
    setSelectedImages([]);
    setFilledFields(new Set());
    setShowForm(false);
    setIsSaving(false);

    await loadProjects();
  }

  async function handleUpdateProject(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!editingProjectId) {
      return;
    }

    setIsSaving(true);
    setError("");

    const technologies =
      form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const features =
      form.features
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const { error } = await supabase
      .from("projects")
      .update({
        title: form.title.trim(),
        slug: form.slug.trim(),
        short_description:
          form.short_description.trim(),
        description:
          form.description.trim(),
        category: form.category.trim(),
        year: form.year.trim(),
        github: form.github.trim(),
        live:
          form.live.trim() || null,
        technologies,
        features,
        problem_title:
          form.problem_title.trim(),
        problem_description:
          form.problem_description.trim(),
        solution_title:
          form.solution_title.trim(),
        solution_description:
          form.solution_description.trim(),
        sort_order:
          Number(form.sort_order) || 0,
        published: form.published,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", editingProjectId);

    if (error) {
      setError(
        `Unable to update project: ${error.message}`
      );
      setIsSaving(false);
      return;
    }

    try {
      await uploadProjectImages(
        editingProjectId,
        form.slug.trim()
      );
    } catch (imageError) {
      setError(
        imageError instanceof Error
          ? `Project updated, but ${imageError.message}`
          : "Project updated, but image upload failed."
      );
    }

    setIsSaving(false);
    setSelectedImages([]);
    setExistingImages([]);
    setEditingProjectId(null);
    setShowForm(false);
    setFilledFields(new Set());
    setForm(emptyForm);

    router.push("/admin/projects");

    await loadProjects();
  }

  async function togglePublished(
    project: Project
  ) {
    setActionId(project.id);
    setError("");

    const { error } = await supabase
      .from("projects")
      .update({
        published: !project.published,
      })
      .eq("id", project.id);

    if (error) {
      setError(
        `Unable to update project: ${error.message}`
      );
      setActionId(null);
      return;
    }

    setProjects((current) =>
      current.map((item) =>
        item.id === project.id
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

  async function deleteProject(
    project: Project
  ) {
    const confirmed = window.confirm(
      `Delete "${project.title}" permanently?\n\nThis will also delete all screenshots belonging to this project.`
    );

    if (!confirmed) {
      return;
    }

    setActionId(project.id);
    setError("");

    try {
      /*
       * 1. Find all screenshots.
       */
      const {
        data: projectImages,
        error: imageLoadError,
      } = await supabase
        .from("project_images")
        .select(
          "id, storage_path"
        )
        .eq(
          "project_id",
          project.id
        );

      if (imageLoadError) {
        throw new Error(
          `Unable to find project screenshots: ${imageLoadError.message}`
        );
      }

      /*
       * 2. Delete screenshot files.
       */
      const storagePaths =
        projectImages
          ?.map(
            (image) =>
              image.storage_path
          )
          .filter(Boolean) || [];

      if (storagePaths.length > 0) {
        const {
          error: storageError,
        } = await supabase.storage
          .from("project-images")
          .remove(storagePaths);

        if (storageError) {
          throw new Error(
            `Unable to delete project screenshots: ${storageError.message}`
          );
        }
      }

      /*
       * 3. Delete screenshot records.
       */
      const {
        error: imageRecordError,
      } = await supabase
        .from("project_images")
        .delete()
        .eq(
          "project_id",
          project.id
        );

      if (imageRecordError) {
        throw new Error(
          `Screenshots were deleted, but their database records could not be removed: ${imageRecordError.message}`
        );
      }

      /*
       * 4. Delete project.
       */
      const {
        error: projectError,
      } = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id);

      if (projectError) {
        throw new Error(
          `Unable to delete project: ${projectError.message}`
        );
      }

      /*
       * 5. Remove from UI.
       */
      setProjects((current) =>
        current.filter(
          (item) =>
            item.id !== project.id
        )
      );
    } catch (deleteError) {
      console.error(
        "PROJECT DELETE ERROR:",
        deleteError
      );

      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete project."
      );
    } finally {
      setActionId(null);
    }
  }

  function closeForm() {
    setForm(emptyForm);
    setSelectedImages([]);
    setExistingImages([]);
    setFilledFields(new Set());
    setEditingProjectId(null);
    setShowForm(false);
    setError("");

    if (editProjectId) {
      router.push("/admin/projects");
    }
  }

  return (
    <>
      <style jsx global>{`
        .project-admin-form
          input:not([type="checkbox"]),
        .project-admin-form textarea,
        .project-admin-form select {
          transition:
            background-color 0.18s ease,
            color 0.18s ease,
            border-color 0.18s ease;
        }

        .project-admin-form
          input:not([type="checkbox"]):focus,
        .project-admin-form textarea:focus,
        .project-admin-form select:focus {
          background: #ffffff !important;
          color: #111111 !important;
          border-color: #ffffff !important;
          outline: none;
        }

        .project-admin-form
          .field-filled {
          background: #ffffff !important;
          color: #111111 !important;
          border-color: #ffffff !important;
        }

        .project-admin-form
          .field-filled::placeholder {
          color: #777777 !important;
        }

        .project-admin-form
          input:not([type="checkbox"]):focus::placeholder,
        .project-admin-form
          textarea:focus::placeholder {
          color: #777777 !important;
        }

        .project-admin-form
          input[type="file"] {
          background: var(--surface) !important;
          color: var(--foreground) !important;
          cursor: pointer;
        }

        .project-admin-form
          input[type="file"]:focus {
          background: #ffffff !important;
          color: #111111 !important;
        }

        .project-admin-form
          input:-webkit-autofill,
        .project-admin-form
          input:-webkit-autofill:hover,
        .project-admin-form
          input:-webkit-autofill:focus {
          -webkit-text-fill-color: #111111 !important;
          -webkit-box-shadow:
            0 0 0 1000px #ffffff inset !important;
          box-shadow:
            0 0 0 1000px #ffffff inset !important;
          caret-color: #111111;
        }

        .admin-page button,
        .admin-page a.message-action-button {
          transition:
            background-color 0.18s ease,
            color 0.18s ease,
            border-color 0.18s ease,
            transform 0.12s ease;
        }

        .admin-page
          button:not(:disabled):hover,
        .admin-page
          a.message-action-button:hover {
          background: #ffffff !important;
          color: #111111 !important;
          border-color: #ffffff !important;
        }

        .admin-page
          button:not(:disabled):active,
        .admin-page
          a.message-action-button:active {
          background: #ffffff !important;
          color: #111111 !important;
          border-color: #ffffff !important;
          transform: translateY(1px);
        }

        .admin-page button:focus-visible,
        .admin-page
          a.message-action-button:focus-visible {
          outline: 1px solid #ffffff;
          outline-offset: 3px;
        }

        .admin-page
          .message-delete-button:hover,
        .admin-page
          .message-delete-button:active {
          background: #ffffff !important;
          color: #111111 !important;
          border-color: #ffffff !important;
        }

        .project-existing-images {
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 14px;
          margin-top: 14px;
        }

        .project-existing-image {
          position: relative;
          overflow: hidden;
          border: 1px solid var(--border);
          background: #0b0b0b;
        }

        .project-existing-image img {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
        }

        .project-existing-image-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 10px;
          border-top: 1px solid var(--border);
        }

        .project-existing-image-info small {
          color: var(--muted);
          font-size: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .project-existing-images-empty {
          margin-top: 14px;
          padding: 16px;
          border: 1px dashed var(--border);
          color: var(--muted);
          font-size: 12px;
          background: var(--surface);
        }

        .project-existing-image-delete {
          flex: 0 0 auto;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 1px solid var(--border);
          background: transparent;
          color: #d5a0a0;
          cursor: pointer;
        }

        @media (max-width: 760px) {
          .project-existing-images {
            grid-template-columns: 1fr;
          }
        }

        .project-upload-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 14px;
        }

        .project-upload-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 12px 14px;
          border: 1px solid var(--border);
          background: var(--surface);
        }

        .project-upload-item strong {
          display: block;
          color: var(--foreground);
          font-size: 12px;
          font-weight: 500;
          word-break: break-all;
        }

        .project-upload-item small {
          display: block;
          margin-top: 4px;
          color: var(--muted-dark);
          font-size: 10px;
        }

        .project-upload-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--muted);
          cursor: pointer;
        }

        .project-upload-remove:hover,
        .project-upload-remove:active {
          background: #ffffff !important;
          color: #111111 !important;
          border-color: #ffffff !important;
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

              <h1>Projects.</h1>

              <p className="admin-header-description">
                Manage the projects displayed on
                your portfolio.
              </p>
            </div>

            <button
              type="button"
              className="admin-view-site"
              onClick={() =>
                setShowForm(
                  (current) => !current
                )
              }
            >
              <Plus size={15} />

              {showForm
                ? "Close form"
                : "Add project"}
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
                    {editingProjectId
                      ? "EDIT PROJECT"
                      : "NEW PROJECT"}
                  </p>

                  <h2>
                    {editingProjectId
                      ? "Edit project"
                      : "Add a project"}
                  </h2>
                </div>
              </div>

              <form
                className="project-admin-form"
                onSubmit={
                  editingProjectId
                    ? handleUpdateProject
                    : handleCreateProject
                }
                noValidate
              >
                <div className="project-form-grid">
                  <div className="form-field">
                    <label htmlFor="project-title">
                      Project title
                    </label>

                    <input
                      id="project-title"
                      className={
                        isFieldFilled("title")
                          ? "field-filled"
                          : ""
                      }
                      value={form.title}
                      onChange={(e) =>
                        updateTextField(
                          "title",
                          e.target.value
                        )
                      }
                      placeholder="FinSight AI"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="project-slug">
                      Slug
                    </label>

                    <input
                      id="project-slug"
                      className={
                        isFieldFilled("slug")
                          ? "field-filled"
                          : ""
                      }
                      value={form.slug}
                      onChange={(e) =>
                        updateTextField(
                          "slug",
                          e.target.value
                        )
                      }
                      placeholder="finsight-ai"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="project-category">
                      Category
                    </label>

                    <input
                      id="project-category"
                      className={
                        isFieldFilled(
                          "category"
                        )
                          ? "field-filled"
                          : ""
                      }
                      value={form.category}
                      onChange={(e) =>
                        updateTextField(
                          "category",
                          e.target.value
                        )
                      }
                      placeholder="AI / Financial Research"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="project-year">
                      Year
                    </label>

                    <input
                      id="project-year"
                      className={
                        isFieldFilled("year")
                          ? "field-filled"
                          : ""
                      }
                      value={form.year}
                      onChange={(e) =>
                        updateTextField(
                          "year",
                          e.target.value
                        )
                      }
                      placeholder="2026"
                      required
                    />
                  </div>

                  <div className="form-field project-form-full">
                    <label htmlFor="project-short">
                      Short description
                    </label>

                    <input
                      id="project-short"
                      className={
                        isFieldFilled(
                          "short_description"
                        )
                          ? "field-filled"
                          : ""
                      }
                      value={
                        form.short_description
                      }
                      onChange={(e) =>
                        updateTextField(
                          "short_description",
                          e.target.value
                        )
                      }
                      placeholder="Short description shown on project cards"
                      required
                    />
                  </div>

                  <div className="form-field project-form-full">
                    <label htmlFor="project-description">
                      Description
                    </label>

                    <textarea
                      id="project-description"
                      className={
                        isFieldFilled(
                          "description"
                        )
                          ? "field-filled"
                          : ""
                      }
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        updateTextField(
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Detailed project description"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="project-github">
                      GitHub URL
                    </label>

                    <input
                      id="project-github"
                      type="url"
                      className={
                        isFieldFilled("github")
                          ? "field-filled"
                          : ""
                      }
                      value={form.github}
                      onChange={(e) =>
                        updateTextField(
                          "github",
                          e.target.value
                        )
                      }
                      placeholder="https://github.com/..."
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="project-live">
                      Live URL
                    </label>

                    <input
                      id="project-live"
                      type="url"
                      className={
                        isFieldFilled("live")
                          ? "field-filled"
                          : ""
                      }
                      value={form.live}
                      onChange={(e) =>
                        updateTextField(
                          "live",
                          e.target.value
                        )
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-field project-form-full">
                    <label htmlFor="project-technologies">
                      Technologies
                    </label>

                    <input
                      id="project-technologies"
                      className={
                        isFieldFilled(
                          "technologies"
                        )
                          ? "field-filled"
                          : ""
                      }
                      value={form.technologies}
                      onChange={(e) =>
                        updateTextField(
                          "technologies",
                          e.target.value
                        )
                      }
                      placeholder="Python, Machine Learning, AI / LLM"
                      required
                    />

                    <small>
                      Separate each technology
                      with a comma.
                    </small>
                  </div>

                  <div className="form-field project-form-full">
                    <label htmlFor="project-features">
                      Features
                    </label>

                    <textarea
                      id="project-features"
                      className={
                        isFieldFilled(
                          "features"
                        )
                          ? "field-filled"
                          : ""
                      }
                      rows={4}
                      value={form.features}
                      onChange={(e) =>
                        updateTextField(
                          "features",
                          e.target.value
                        )
                      }
                      placeholder="Stock comparison, Portfolio analysis, AI reports"
                      required
                    />

                    <small>
                      Separate each feature
                      with a comma.
                    </small>
                  </div>

                  <div className="form-field">
                    <label htmlFor="problem-title">
                      Problem title
                    </label>

                    <input
                      id="problem-title"
                      className={
                        isFieldFilled(
                          "problem_title"
                        )
                          ? "field-filled"
                          : ""
                      }
                      value={
                        form.problem_title
                      }
                      onChange={(e) =>
                        updateTextField(
                          "problem_title",
                          e.target.value
                        )
                      }
                      placeholder="What problem does it solve?"
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="solution-title">
                      Solution title
                    </label>

                    <input
                      id="solution-title"
                      className={
                        isFieldFilled(
                          "solution_title"
                        )
                          ? "field-filled"
                          : ""
                      }
                      value={
                        form.solution_title
                      }
                      onChange={(e) =>
                        updateTextField(
                          "solution_title",
                          e.target.value
                        )
                      }
                      placeholder="How does it solve it?"
                      required
                    />
                  </div>

                  <div className="form-field project-form-full">
                    <label htmlFor="problem-description">
                      Problem description
                    </label>

                    <textarea
                      id="problem-description"
                      className={
                        isFieldFilled(
                          "problem_description"
                        )
                          ? "field-filled"
                          : ""
                      }
                      rows={4}
                      value={
                        form.problem_description
                      }
                      onChange={(e) =>
                        updateTextField(
                          "problem_description",
                          e.target.value
                        )
                      }
                      placeholder="Describe the problem..."
                      required
                    />
                  </div>

                  <div className="form-field project-form-full">
                    <label htmlFor="solution-description">
                      Solution description
                    </label>

                    <textarea
                      id="solution-description"
                      className={
                        isFieldFilled(
                          "solution_description"
                        )
                          ? "field-filled"
                          : ""
                      }
                      rows={4}
                      value={
                        form.solution_description
                      }
                      onChange={(e) =>
                        updateTextField(
                          "solution_description",
                          e.target.value
                        )
                      }
                      placeholder="Describe your solution..."
                      required
                    />
                  </div>

                  <div className="form-field project-form-full">
                    <label htmlFor="project-images">
                      Project screenshots
                    </label>

                    {existingImages.length >
                    0 ? (
                      <div className="project-existing-images">
                        {existingImages.map(
                          (image) => (
                            <div
                              key={image.id}
                              className="project-existing-image"
                            >
                              <img
                                src={
                                  image.public_url ||
                                  supabase.storage
                                    .from(
                                      "project-images"
                                    )
                                    .getPublicUrl(
                                      image.storage_path
                                    ).data
                                    .publicUrl
                                }
                                alt={image.alt}
                              />

                              <div className="project-existing-image-info">
                                <small>
                                  {image.alt}
                                </small>

                                <button
                                  type="button"
                                  className="project-existing-image-delete"
                                  onClick={() =>
                                    deleteExistingImage(
                                      image
                                    )
                                  }
                                  aria-label={`Delete ${image.alt}`}
                                >
                                  <Trash2
                                    size={14}
                                  />
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : editingProjectId ? (
                      <div className="project-existing-images-empty">
                        No existing screenshots
                        found for this project.
                      </div>
                    ) : null}

                    <input
                      id="project-images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={
                        handleImageSelection
                      }
                    />

                    <small>
                      Upload one or more
                      screenshots. Maximum 10 MB
                      per image.
                    </small>

                    {selectedImages.length >
                      0 && (
                      <div className="project-upload-list">
                        {selectedImages.map(
                          (
                            file,
                            index
                          ) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="project-upload-item"
                            >
                              <div>
                                <strong>
                                  {file.name}
                                </strong>

                                <small>
                                  {(
                                    file.size /
                                    (1024 *
                                      1024)
                                  ).toFixed(
                                    2
                                  )}{" "}
                                  MB
                                </small>
                              </div>

                              <button
                                type="button"
                                className="project-upload-remove"
                                onClick={() =>
                                  removeSelectedImage(
                                    index
                                  )
                                }
                                aria-label={`Remove ${file.name}`}
                              >
                                <X
                                  size={15}
                                />
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="project-order">
                      Display order
                    </label>

                    <input
                      id="project-order"
                      type="number"
                      className={
                        isFieldFilled(
                          "sort_order"
                        )
                          ? "field-filled"
                          : ""
                      }
                      value={form.sort_order}
                      onChange={(e) =>
                        updateTextField(
                          "sort_order",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <label className="project-published">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) =>
                        updateBooleanField(
                          "published",
                          e.target.checked
                        )
                      }
                    />

                    <span>
                      Publish this project
                    </span>
                  </label>
                </div>

                <div className="project-form-actions">
                  <button
                    type="submit"
                    className="message-action-button"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Upload size={15} />
                        Uploading...
                      </>
                    ) : editingProjectId ? (
                      "Update project"
                    ) : (
                      "Save project"
                    )}
                  </button>

                  <button
                    type="button"
                    className="message-action-button"
                    onClick={closeForm}
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
                  PORTFOLIO
                </p>

                <h2>
                  {projects.length}{" "}
                  {projects.length === 1
                    ? "project"
                    : "projects"}
                </h2>
              </div>
            </div>

            {isLoading ? (
              <div className="admin-empty-state">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="admin-empty-state">
                <FolderKanban size={24} />

                <p>
                  No projects in the
                  database yet.
                </p>
              </div>
            ) : (
              <div className="admin-project-list">
                {projects.map((project) => (
                  <article
                    key={project.id}
                    className="admin-project-item"
                  >
                    <div className="admin-project-info">
                      <div className="admin-project-title-row">
                        <h3>
                          {project.title}
                        </h3>

                        <span
                          className={
                            project.published
                              ? "project-published-status"
                              : "project-draft-status"
                          }
                        >
                          {project.published
                            ? "Published"
                            : "Draft"}
                        </span>
                      </div>

                      <p>
                        {
                          project.short_description
                        }
                      </p>

                      <div className="admin-project-meta">
                        <span>
                          {project.category}
                        </span>

                        <span>
                          {project.year}
                        </span>

                        <span>
                          {project.technologies
                            .slice(0, 3)
                            .join(" · ")}
                        </span>
                      </div>
                    </div>

                    <div className="admin-project-actions">
                      <button
                        type="button"
                        className="message-action-button"
                        onClick={() =>
                          togglePublished(
                            project
                          )
                        }
                        disabled={
                          actionId ===
                          project.id
                        }
                      >
                        {project.published
                          ? "Unpublish"
                          : "Publish"}
                      </button>

                      <Link
                        href={`/admin/projects?edit=${project.id}`}
                        className="message-action-button"
                      >
                        Edit
                      </Link>

                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="message-action-button"
                      >
                        View
                        <ArrowUpRight
                          size={14}
                        />
                      </Link>

                      <button
                        type="button"
                        className="message-delete-button"
                        onClick={() =>
                          deleteProject(
                            project
                          )
                        }
                        disabled={
                          actionId ===
                          project.id
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