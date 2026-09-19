import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
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
            404 · Page not found
          </p>

          <h1 className="mt-6 max-w-4xl text-6xl font-medium leading-[0.9] tracking-[-0.06em] sm:text-7xl md:text-9xl">
            Nothing here.
          </h1>

          <p className="mt-8 max-w-xl text-base leading-7 text-white/40">
            The page you are looking for may have been moved,
            removed, or never existed.
          </p>

          <Link
            href="/"
            className="group mt-10 inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:-translate-y-1"
          >
            <ArrowLeft size={16} />

            Back home

            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </section>

        <footer className="border-t border-white/10 pt-6 text-xs text-white/25">
          © 2026 Aman Nidhi · AI/ML Developer
        </footer>
      </div>
    </main>
  );
}