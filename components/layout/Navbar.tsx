"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Work", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className="container pt-3 sm:pt-4 md:pt-5">
        <nav
          className={`relative flex items-center justify-between border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-xl transition-all duration-300 sm:px-5 ${
            open
              ? "rounded-3xl"
              : "rounded-full"
          }`}
        >
          {/* LOGO */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="relative z-10 text-sm font-semibold tracking-[0.18em]"
          >
            AMAN<span className="text-white/40">.</span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/60 transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* DESKTOP CTA */}
          <Link
            href="/contact"
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-white transition-all duration-300 hover:border-white/30 hover:bg-white hover:text-black md:block"
          >
            Let&apos;s talk
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white active:scale-95 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <X size={18} />
            ) : (
              <Menu size={18} />
            )}
          </button>
        </nav>

        {/* MOBILE NAVIGATION */}
        <div
          className={`grid transition-all duration-300 ease-out md:hidden ${
            open
              ? "mt-2 grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="rounded-3xl border border-white/10 bg-[#101010]/95 p-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
              {/* Navigation Links */}
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-2xl px-4 py-3.5 text-sm text-white/65 transition-all duration-300 hover:bg-white/5 hover:text-white active:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="mt-2 border-t border-white/10 pt-3">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:bg-white/90 active:scale-[0.99]"
                >
                  <span>Let&apos;s talk</span>

                  <span className="text-black/50">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}