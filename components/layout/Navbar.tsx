"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="public-red-navbar fixed inset-x-0 top-0 z-50">
      <div className="container relative z-10">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm font-semibold tracking-[0.16em] text-white transition-opacity duration-300 hover:opacity-70"
          >
            AMAN.
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.16em] text-white/55 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="hidden rounded-full border border-white/20 px-5 py-2.5 text-xs uppercase tracking-[0.12em] text-white transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black sm:inline-flex md:inline-flex"
          >
            Let&apos;s talk
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:border-white/40 hover:bg-white hover:text-black md:hidden"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        {/* Mobile navigation panel */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="public-red-mobile-menu rounded-2xl border border-white/10 p-3">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-4 text-sm uppercase tracking-[0.14em] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <span>{link.label}</span>
                <span className="text-[10px] text-white/25">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="public-red-button mt-2 flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium"
            >
              Let&apos;s talk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
