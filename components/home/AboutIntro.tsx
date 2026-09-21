import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type AboutIntroProps = {
  aboutText: string;
};

export default function AboutIntro({
  aboutText,
}: AboutIntroProps) {
  return (
    <section className="border-t border-white/10 py-28">
      <div className="container">

        <div className="grid gap-12 md:grid-cols-[180px_1fr]">

          {/* =====================================================
              SECTION LABEL
          ===================================================== */}

          <div className="pt-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/30">
              About
            </p>
          </div>


          {/* =====================================================
              CONTENT
          ===================================================== */}

          <div>

            <p className="max-w-5xl text-3xl leading-[1.15] tracking-[-0.035em] text-white/75 md:text-5xl">
              {aboutText}
            </p>


            {/* More about me */}

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

          </div>

        </div>

      </div>
    </section>
  );
}