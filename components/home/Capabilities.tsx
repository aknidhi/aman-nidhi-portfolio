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

function SkillPill({ name }: { name: string }) {
  return (
    <div className="public-skill-pill group inline-flex items-center rounded-full px-4 py-2.5 transition-all duration-300">
      <span className="text-sm text-white/80 transition-colors group-hover:text-white">
        {name}
      </span>
    </div>
  );
}

function LanguagePill({
  name,
  fluency,
}: {
  name: string;
  fluency: string | null;
}) {
  return (
    <div className="public-skill-pill group flex items-center gap-3 rounded-full px-4 py-2.5 transition-all duration-300">
      <span className="text-sm text-white/80 transition-colors group-hover:text-white">
        {name}
      </span>

      {fluency && (
        <span className="public-language-fluency border-l pl-3 text-[10px] uppercase tracking-[0.12em]">
          {fluency}
        </span>
      )}
    </div>
  );
}

export default function Capabilities({ skills }: CapabilitiesProps) {
  const technicalSkills = skills.filter(
    (skill) => skill.category !== "Speaking Languages"
  );

  const groupedTechnicalSkills = technicalSkills.reduce<
    Record<string, Skill[]>
  >((groups, skill) => {
    if (!groups[skill.category]) {
      groups[skill.category] = [];
    }

    groups[skill.category].push(skill);
    return groups;
  }, {});

  const technicalCategories = Object.entries(groupedTechnicalSkills);

  const speakingLanguages = skills
    .filter((skill) => skill.category === "Speaking Languages")
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section className="public-red-section border-t py-24">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-[180px_1fr]">
          <div className="pt-2">
            <p className="public-red-muted text-xs uppercase tracking-[0.2em]">
              Skills
            </p>
          </div>

          <div>
            {technicalCategories.length === 0 ? (
              <div className="border-y border-white/10 py-8">
                <p className="text-sm text-white">
                  Skills will appear here once they are added from the admin panel.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/10 border-y border-white/10">
                {technicalCategories.map(([category, categorySkills], categoryIndex) => (
                  <div key={category} className="py-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <p className="public-red-muted text-xs uppercase tracking-[0.18em]">
                        {category}
                      </p>

                      <span className="text-[10px] text-white/15">
                        {String(categoryIndex + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {categorySkills
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((skill) => (
                          <SkillPill key={skill.id} name={skill.name} />
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-14">
              <div className="mb-5 flex items-center justify-between">
                <p className="public-red-muted text-xs uppercase tracking-[0.18em]">
                  Speaking Languages
                </p>

                <span className="text-[10px] text-white/15">
                  {String(technicalCategories.length + 1).padStart(2, "0")}
                </span>
              </div>

              {speakingLanguages.length === 0 ? (
                <div className="border-y border-white/10 py-8">
                  <p className="text-sm text-white">
                    Speaking languages will appear here once they are added from the admin panel.
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5 border-y border-white/10 py-6">
                  {speakingLanguages.map((language) => (
                    <LanguagePill
                      key={language.id}
                      name={language.name}
                      fluency={language.fluency}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
