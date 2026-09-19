"use client";

import { motion } from "framer-motion";

type ProfileCardProps = {
  imageUrl: string | null;
  imageAlt: string;
  cardName: string;
  cardRole: string;
  cardSubtitle: string;
};

export default function ProfileCard({
  imageUrl,
  imageAlt,
  cardName,
  cardRole,
  cardSubtitle,
}: ProfileCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.97,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.9,
        delay: 0.35,
        ease: "easeOut",
      }}
      className="group relative mx-auto aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#101010]"
    >
      {/* PROFILE IMAGE */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={imageAlt || "Profile image"}
          className="absolute inset-0 h-full w-full object-cover grayscale-[20%] contrast-125 brightness-75 transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-[0.85]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-[#101010]">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 text-3xl font-medium text-white/40">
            AN
          </div>
        </div>
      )}

      {/* DARK GRADIENT */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

      {/* PURPLE LIGHT */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(167,139,250,0.16),transparent_42%)] mix-blend-screen" />

      {/* INNER BORDER */}
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-white/5" />

      {/* CARD CONTENT */}
      <div className="absolute bottom-7 left-7 right-7">
        <p className="text-xs uppercase tracking-[0.2em] text-white/70">
          {cardName}
        </p>

        <p className="mt-2 text-xs leading-5 text-white/45">
          {cardRole}
          <br />
          {cardSubtitle}
        </p>
      </div>

      {/* CARD NUMBER */}
      <span className="absolute bottom-7 right-7 text-xs text-white/25">
        01
      </span>
    </motion.div>
  );
}