type CapabilityProps = {
  number: string;
  title: string;
  description: string;
};

function Capability({
  number,
  title,
  description,
}: CapabilityProps) {
  return (
    <div className="grid gap-5 py-7 sm:grid-cols-[60px_1fr] sm:gap-8">

      {/* Number */}

      <span className="text-xs text-white/25">
        {number}
      </span>


      {/* Content */}

      <div>

        <h3 className="text-xl tracking-[-0.025em] text-white/80">
          {title}
        </h3>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/35">
          {description}
        </p>

      </div>

    </div>
  );
}


export default function Capabilities() {
  return (
    <section className="border-t border-white/10 py-28">
      <div className="container">

        <div className="grid gap-12 md:grid-cols-[180px_1fr]">

          {/* =====================================================
              SECTION LABEL
          ===================================================== */}

          <div className="pt-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/30">
              Capabilities
            </p>
          </div>


          {/* =====================================================
              CAPABILITY LIST
          ===================================================== */}

          <div className="divide-y divide-white/10 border-y border-white/10">

            <Capability
              number="01"
              title="AI / Machine Learning"
              description="AI applications, machine learning workflows, NLP and intelligent systems."
            />

            <Capability
              number="02"
              title="Data Analytics"
              description="Exploring data, finding patterns, creating visualizations and turning data into insights."
            />

            <Capability
              number="03"
              title="AI Applications"
              description="Building practical products using LLMs, AI agents, APIs and automation."
            />

            <Capability
              number="04"
              title="Software Development"
              description="Developing responsive web applications, APIs and database-backed systems."
            />

          </div>

        </div>

      </div>
    </section>
  );
}