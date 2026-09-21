type Skill = {
  id: string;
  category: string;
  name: string;
  fluency: string | null;
  sort_order: number;
  published: boolean;
};

type CapabilitiesProps = {
  skills: Skill[];
};

function SkillItem({
  number,
  name,
}: {
  number: string;
  name: string;
}) {
  return (
    <div className="grid gap-5 py-6 sm:grid-cols-[60px_1fr] sm:gap-8">

      <span className="text-xs text-white/25">
        {number}
      </span>

      <h3 className="text-xl tracking-[-0.025em] text-white/80">
        {name}
      </h3>

    </div>
  );
}

function SpeakingLanguageItem({
  number,
  name,
  fluency,
}: {
  number: string;
  name: string;
  fluency: string | null;
}) {
  return (
    <div className="grid gap-5 py-6 sm:grid-cols-[60px_1fr_auto] sm:items-center sm:gap-8">

      <span className="text-xs text-white/25">
        {number}
      </span>

      <h3 className="text-xl tracking-[-0.025em] text-white/80">
        {name}
      </h3>

      <p className="text-xs uppercase tracking-[0.14em] text-white/25 sm:text-right">
        {fluency || "Fluency not added"}
      </p>

    </div>
  );
}

export default function Capabilities({
  skills,
}: CapabilitiesProps) {

  /* =========================================================
     TECHNICAL SKILLS
  ========================================================= */

  const technicalSkills =
    skills.filter(
      (skill) =>
        skill.category !==
        "Speaking Languages"
    );

  const groupedTechnicalSkills =
    technicalSkills.reduce<
      Record<string, Skill[]>
    >((groups, skill) => {

      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }

      groups[skill.category].push(
        skill
      );

      return groups;
    }, {});

  /* =========================================================
     SPEAKING LANGUAGES
  ========================================================= */

  const speakingLanguages =
    skills
      .filter(
        (skill) =>
          skill.category ===
          "Speaking Languages"
      )
      .sort(
        (a, b) =>
          a.sort_order -
          b.sort_order
      );

  const technicalCategories =
    Object.entries(
      groupedTechnicalSkills
    );

  return (
    <section className="border-t border-white/10 py-28">

      <div className="container">

        <div className="grid gap-12 md:grid-cols-[180px_1fr]">

          {/* =================================================
              SECTION LABEL
          ================================================= */}

          <div className="pt-2">

            <p className="text-xs uppercase tracking-[0.2em] text-white/30">
              Skills
            </p>

          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="space-y-16">

            {/* =================================================
                TECHNICAL SKILLS
            ================================================= */}

            <div>

              {technicalCategories.length ===
              0 ? (

                <div className="border-y border-white/10 py-8">

                  <p className="text-sm text-white/30">
                    Skills will appear here
                    once they are added from
                    the admin panel.
                  </p>

                </div>

              ) : (

                <div className="divide-y divide-white/10 border-y border-white/10">

                  {technicalCategories.map(
                    (
                      [
                        category,
                        categorySkills,
                      ]
                    ) => (

                      <div
                        key={
                          category
                        }
                        className="py-2"
                      >

                        <div className="pb-1 pt-5">

                          <p className="text-xs uppercase tracking-[0.18em] text-white/25">
                            {category}
                          </p>

                        </div>

                        {categorySkills
                          .sort(
                            (
                              a,
                              b
                            ) =>
                              a.sort_order -
                              b.sort_order
                          )
                          .map(
                            (
                              skill,
                              index
                            ) => (

                              <SkillItem
                                key={
                                  skill.id
                                }
                                number={String(
                                  index +
                                    1
                                ).padStart(
                                  2,
                                  "0"
                                )}
                                name={
                                  skill.name
                                }
                              />

                            )
                          )}

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* =================================================
                SPEAKING LANGUAGES
            ================================================= */}

            <div>

              <div className="mb-5">

                <p className="text-xs uppercase tracking-[0.18em] text-white/25">
                  Speaking Languages
                </p>

              </div>

              {speakingLanguages.length ===
              0 ? (

                <div className="border-y border-white/10 py-8">

                  <p className="text-sm text-white/30">
                    Speaking languages will
                    appear here once they are
                    added from the admin panel.
                  </p>

                </div>

              ) : (

                <div className="divide-y divide-white/10 border-y border-white/10">

                  {speakingLanguages.map(
                    (
                      language,
                      index
                    ) => (

                      <SpeakingLanguageItem
                        key={
                          language.id
                        }
                        number={String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                        name={
                          language.name
                        }
                        fluency={
                          language.fluency
                        }
                      />

                    )
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}