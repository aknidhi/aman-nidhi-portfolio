import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type ContactCTAProps = {
  email: string;
};

export default function ContactCTA({
  email,
}: ContactCTAProps) {
  return (
    <section className="border-t border-white/10 py-32">
      <div className="container">

        <div className="grid gap-12 md:grid-cols-[180px_1fr]">

          {/* =====================================================
              SECTION LABEL
          ===================================================== */}

          <div className="pt-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/30">
              Have an idea?
            </p>
          </div>


          {/* =====================================================
              CONTENT
          ===================================================== */}

          <div>

            <h2 className="max-w-5xl text-5xl leading-[0.95] tracking-[-0.055em] md:text-8xl">
              Let&apos;s build
              <br />
              something{" "}
              <span className="text-white/25">
                interesting.
              </span>
            </h2>


            {/* Description */}

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/35">
              Have a project, idea or opportunity in mind?
              Let&apos;s talk about it.
            </p>


            {/* Actions */}

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:-translate-y-1"
              >
                Start a conversation

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>


              <a
                href={`mailto:${email}`}
                className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm text-white/60 transition-all duration-300 hover:border-white/30 hover:text-white"
              >
                Email me

                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}