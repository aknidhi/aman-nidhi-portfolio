"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const cleanEmail = email.trim();

    const { error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      setError(
        error.message || "Invalid email or password."
      );
      setIsLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-container">
        <Link
          href="/"
          className="admin-back-link"
        >
          <ArrowLeft size={16} />
          Back to portfolio
        </Link>

        <div className="admin-login-card">
          <div className="admin-login-icon">
            <LockKeyhole size={20} />
          </div>

          <p className="eyebrow">
            ADMIN ACCESS
          </p>

          <h1>Welcome back.</h1>

          <p className="admin-login-description">
            Sign in to manage your portfolio,
            projects and messages.
          </p>

          <form
            onSubmit={handleLogin}
            className="admin-login-form"
          >
            <div className="form-field">
              <label htmlFor="admin-email">
                Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="admin-password">
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="admin-login-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="admin-login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}