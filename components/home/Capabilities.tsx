"use client";

import { motion } from "framer-motion";

type CapabilityItem = {
  number: string;
  title: string;
  description: string;
};

const capabilities: CapabilityItem[] = [
  {
    number: "01",
    title: "AI / Machine Learning",
    description:
      "AI applications, machine learning workflows, NLP and intelligent systems.",
  },
  {
    number: "02",
    title: "Data Analytics",
    description:
      "Exploring data, finding patterns, creating visualizations and turning data into insights.",
  },
  {
    number: "03",
    title: "AI Applications",
    description:
      "Building practical products using LLMs, AI agents, APIs and automation.",
  },
  {
    number: "04",
    title: "Software Development",
    description:
      "Developing responsive web applications, APIs and database-backed systems.",
  },
];

export default function Capabilities() {
  return (
    <div className="grid gap-10 sm:gap-12 md:grid-cols-[180px_1fr]">
      {/* Section label */}
      <motion.p
        initial={{ opacity: 0, x: -15 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{
          once: true,
          amount: 0.4,
        }}
        transition={{
          duration: 0.6,
        }}
        className="text-[10px] uppercase tracking-[0.18em] text-white/30 sm:text-xs sm:tracking-[0.2em]"
      >
        Capabilities
      </motion.p>

      {/* Capability list */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="divide-y divide-white/10 border-y border-white/10"
      >
        {capabilities.map((capability) => (
          <motion.div
            key={capability.number}
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: "easeOut",
                },
              },
            }}
            className="group grid gap-4 py-7 transition-colors duration-300 hover:bg-white/[0.02] sm:py-8 md:grid-cols-[80px_280px_1fr]"
          >
            {/* Number */}
            <span className="text-xs text-white/20 transition-colors duration-300 group-hover:text-violet-400/60">
              {capability.number}
            </span>

            {/* Title */}
            <h3 className="text-base text-white/80 transition-colors duration-300 group-hover:text-white sm:text-lg">
              {capability.title}
            </h3>

            {/* Description */}
            <p className="max-w-xl text-[13px] leading-6 text-white/35 transition-colors duration-300 group-hover:text-white/50 sm:text-sm">
              {capability.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}