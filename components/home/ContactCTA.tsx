"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

type ContactCTAProps = {
  email: string;
};

export default function ContactCTA({
  email,
}: ContactCTAProps) {
  const contactEmail =
    email || "aknidhi06@gmail.com";

  return (
    <section className="border-t border-white/10 py-20 sm:py-24 md:py-28">
      <div className="container">
        <div className="grid gap-9 sm:gap-10 md:grid-cols-[180px_1fr]">
          <motion.p
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs sm:tracking-[0.2em]"
          >
            Contact
          </motion.p>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="max-w-4xl text-[clamp(36px,9vw,60px)] leading-[1.03] tracking-[-0.045em] text-white/80"
            >
              Have an idea, project, or opportunity?
              <span className="text-white/35">
                {" "}
                Let&apos;s build something useful.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: "easeOut",
              }}
              className="mt-5 max-w-xl text-[13px] leading-6 text-white/40 sm:mt-6 sm:text-sm"
            >
              I&apos;m open to interesting projects,
              collaborations and opportunities involving AI,
              machine learning, data and software.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                duration: 0.6,
                delay: 0.25,
              }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contact"
                className="group mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-white hover:text-black active:scale-[0.98]"
              >
                Start a conversation

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>

              <a
                href={`mailto:${contactEmail}`}
                className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full px-3 py-3 text-sm text-white/30 transition-colors hover:text-white"
              >
                {contactEmail}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}