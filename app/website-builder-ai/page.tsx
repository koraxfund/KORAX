export default function WebsiteBuilderPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.28em] text-white/45">
          KORAX AI
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          Website Builder AI
        </h1>

        <p className="mt-4 max-w-3xl leading-relaxed text-white/70">
          The KORAX Website Builder AI is being designed to help users generate
          complete Web3 websites for their blockchain projects, including landing
          pages, token sections, roadmap, staking/launch sections, and future
          GitHub publishing support.
        </p>

        <div className="mt-6 inline-flex rounded-xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 px-5 py-3 text-sm font-semibold text-[#c4ffbc]">
          Coming Soon
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 className="font-bold text-white">AI Website Structure</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Generate professional sections for crypto and Web3 projects.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 className="font-bold text-white">Project-Aware Design</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Build websites based on token utility, branding, roadmap, and launch goals.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <h3 className="font-bold text-white">Future GitHub Publishing</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Planned support for generating code and publishing project websites.
          </p>
        </div>
      </section>
    </div>
  );
}