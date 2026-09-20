"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createBrowserClient(
  supabaseUrl,
  supabasePublishableKey
);

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      setError(
        error.message ||
          "Invalid email or password."
      );

      setIsLoading(false);
      return;
    }

    /*
     * Full page navigation is intentional here.
     *
     * It allows the browser session cookies to be
     * available before the protected admin route
     * is loaded.
     */
    window.location.href = "/admin";
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-container">

        {/* BACK TO PORTFOLIO */}

        <Link
          href="/"
          className="admin-back-link"
        >
          <ArrowLeft size={16} />
          Back to portfolio
        </Link>


        {/* LOGIN CARD */}

        <div className="admin-login-card">

          <div className="admin-login-icon">
            <LockKeyhole size={20} />
          </div>

          <p className="eyebrow">
            ADMIN ACCESS
          </p>

          <h1>
            Welcome back.
          </h1>

          <p className="admin-login-description">
            Sign in to manage your portfolio,
            projects and messages.
          </p>


          {/* LOGIN FORM */}

          <form
            onSubmit={handleLogin}
            className="admin-login-form"
          >

            {/* EMAIL */}

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


            {/* PASSWORD */}

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


            {/* ERROR */}

            {error && (
              <p className="admin-login-error">
                {error}
              </p>
            )}


            {/* SUBMIT */}

            <button
              type="submit"
              className="admin-login-button"
              disabled={isLoading}
            >
              {isLoading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

        </div>

      </div>
    </main>
  );
}