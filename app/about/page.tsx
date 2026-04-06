export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">About KORAX</h1>
        <p className="mt-3 max-w-3xl text-white/70">
          KORAX is a blockchain launchpad ecosystem focused on transparent presales,
          structured token distribution, and long-term staking incentives.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">Mission</h2>
        <p className="mt-3 leading-relaxed text-white/65">
          The mission of KORAX is to simplify blockchain project creation and
          token launches while preserving transparency and fairness for both
          creators and participants.
        </p>

        <p className="mt-3 leading-relaxed text-white/65">
          KORAX begins with its own structured presale and staking model, then
          expands toward a launchpad ecosystem where projects can be introduced
          through clear infrastructure and guided tools.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white">What KORAX Builds</h2>
          <p className="mt-3 text-white/65 leading-relaxed">
            KORAX is designed to combine presale infrastructure, token claiming,
            staking rewards, and future creator tools such as Launch Your Project
            and Token Builder AI.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
          <h2 className="text-xl font-semibold text-white">Long-Term Vision</h2>
          <p className="mt-3 text-white/65 leading-relaxed">
            The long-term vision is to enable more people to build, launch, and
            grow blockchain projects through a platform that is easier to access
            and more transparent than traditional launch models.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-bold text-white">Core Principles</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Transparency",
              desc: "Presale mechanics, token claiming, and staking flows are designed to be visible and understandable.",
            },
            {
              title: "Simplicity",
              desc: "KORAX aims to reduce unnecessary complexity in project creation and token launch workflows.",
            },
            {
              title: "Sustainability",
              desc: "The token model is non-inflationary and staking rewards come from fixed supply allocation.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-black/25 p-5"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}