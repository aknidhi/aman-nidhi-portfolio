"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

type AboutIntroProps = {
  aboutText: string;
};

export default function AboutIntro({
  aboutText,
}: AboutIntroProps) {
  const text =
    aboutText ||
    "I'm interested in building practical technology that solves real problems — combining artificial intelligence, machine learning and data analytics.";

  return (
    <div className="grid gap-10 md:grid-cols-[180px_1fr]">
      <motion.p
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
        className="text-xs uppercase tracking-[0.2em] text-white/30"
      >
        About
      </motion.p>

      <div>
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="max-w-5xl text-3xl leading-[1.15] tracking-[-0.035em] text-white/75 md:text-5xl"
        >
          {text}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{
            duration: 0.6,
            delay: 0.15,
          }}
        >
          <Link
            href="/about"
            className="group mt-8 inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            More about me

            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}