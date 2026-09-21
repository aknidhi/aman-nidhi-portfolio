"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="container pt-4 sm:pt-6">
        <nav className="flex h-16 items-center justify-between rounded-full border border-white/10 bg-[#090909]/80 px-5 backdrop-blur-xl sm:h-[68px] sm:px-6">

          {/* =====================================================
              LOGO
          ===================================================== */}

          <Link
            href="/"
            className="text-sm font-semibold tracking-[0.14em] text-white transition-opacity hover:opacity-70"
          >
            AMAN.
          </Link>


          {/* =====================================================
              MAIN NAVIGATION
          ===================================================== */}

          <div className="hidden items-center gap-8 md:flex">

            <Link
              href="/projects"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              Work
            </Link>

            <Link
              href="/about"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-sm text-white/55 transition-colors hover:text-white"
            >
              Contact
            </Link>

          </div>


          {/* =====================================================
              LET'S TALK
          ===================================================== */}

          <Link
            href="/contact"
            className="group flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black sm:px-5 sm:py-2.5"
          >
            <span>
              Let&apos;s talk
            </span>

            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>

        </nav>
      </div>
    </header>
  );
}