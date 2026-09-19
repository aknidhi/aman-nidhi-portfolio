"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <div className="container flex min-h-screen flex-col justify-between py-8">
        <header>
          <Link
            href="/"
            className="text-sm font-medium tracking-[0.08em] text-white"
          >
            AMAN.
          </Link>
        </header>

        <section className="py-24">
          <p className="text-xs uppercase tracking-[0.2em] text-white/30">
            Something went wrong
          </p>

          <h1 className="mt-6 max-w-4xl text-5xl font-medium leading-[0.95] tracking-[-0.055em] sm:text-6xl md:text-8xl">
            Let&apos;s try that again.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-white/40">
            An unexpected error occurred while loading this
            page. You can try again or return to the homepage.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:-translate-y-1"
            >
              <RotateCcw size={15} />
              Try again
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition-all duration-300 hover:border-white/30 hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={15} />
              Back home
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/10 pt-6 text-xs text-white/25">
          © 2026 Aman Nidhi · AI/ML Developer
        </footer>
      </div>
    </main>
  );
}