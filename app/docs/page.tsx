export default function DocsPage() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.28em] text-white/45">
          KORAX Documentation
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
          KORAX Whitepaper
        </h1>

        <p className="mt-4 max-w-4xl leading-relaxed text-white/70">
          KORAX is a BNB Chain ecosystem built around presale, claim, staking,
          AI-assisted project creation, and future launch tools. The platform is
          designed to combine transparent on-chain infrastructure with practical
          tools that help users create, prepare, and launch blockchain projects
          with less technical friction.
        </p>
      </section>

      {/* VISION */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Vision</h2>

        <p className="mt-3 leading-relaxed text-white/65">
          The long-term vision of KORAX is to simplify blockchain project
          creation and make Web3 launch infrastructure more accessible. Instead
          of forcing builders to start from complex contract systems, scattered
          tools, and expensive development processes, KORAX aims to provide a
          more direct path from idea to project structure.
        </p>

        <p className="mt-3 leading-relaxed text-white/65">
          The ecosystem begins with KRX, the core KORAX token, and expands into
          staking-based access, Token Builder AI, Launch Your Project, and future
          Website Builder AI tools. KORAX is designed to support both long-term
          holders and future builders through a transparent, utility-focused
          ecosystem.
        </p>
      </section>

      {/* CURRENT STATUS */}
      <section className="rounded-2xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-[#c4ffbc]">
          Current Ecosystem Status
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs text-white/45">Presale</div>
            <div className="mt-1 font-semibold text-white">Live</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs text-white/45">Claim & Staking</div>
            <div className="mt-1 font-semibold text-white">
              Prepared After Presale
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs text-white/45">Token Builder AI</div>
            <div className="mt-1 font-semibold text-white">Ready / Draft Mode</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs text-white/45">Website Builder AI</div>
            <div className="mt-1 font-semibold text-white">
              Under Development
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-white/70">
          The current public user flow focuses on presale participation,
          AI-powered project drafts, tokenomics previews, roadmap direction, and
          project visual generation. Full on-chain builder activation is planned
          after the required presale, claim, and staking access rollout phases.
        </p>
      </section>

      {/* PRESALE */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Presale Model</h2>

        <p className="mt-3 leading-relaxed text-white/65">
          KORAX uses a structured five-stage presale model with a total presale
          allocation of 50,000,000 KRX tokens. The model is designed to provide
          clear stage-based pricing and transparent participation on BNB Smart
          Chain.
        </p>

        <ul className="mt-4 space-y-2 text-white/65">
          <li>Stage 1 — 10,000,000 KRX at $0.05</li>
          <li>Stage 2 — 10,000,000 KRX at $0.07</li>
          <li>Stage 3 — 10,000,000 KRX at $0.09</li>
          <li>Stage 4 — 10,000,000 KRX at $0.11</li>
          <li>Stage 5 — 10,000,000 KRX at $0.13</li>
        </ul>

        <p className="mt-4 leading-relaxed text-white/65">
          The presale supports participation through supported payment routes,
          including BNB, USDT, and USDC where available. Purchased tokens are
          recorded on-chain and become claimable only after the claim phase is
          activated.
        </p>
      </section>

      {/* TOKENOMICS */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Tokenomics</h2>

        <p className="mt-3 leading-relaxed text-white/65">
          KORAX has a fixed total supply of 100,000,000 KRX. The token model is
          designed as a non-inflationary structure, meaning the supply is not
          expanded through future minting.
        </p>

        <ul className="mt-4 space-y-2 text-white/65">
          <li>50,000,000 KRX allocated for presale participation</li>
          <li>50,000,000 KRX allocated for staking rewards and ecosystem support</li>
          <li>Fixed supply model with no inflationary reward minting</li>
        </ul>

        <p className="mt-4 leading-relaxed text-white/65">
          Rewards and ecosystem allocations are designed to come from existing
          token supply rather than newly created tokens. This helps preserve
          clarity around supply and long-term distribution.
        </p>
      </section>

      {/* CLAIM */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Claim System</h2>

        <p className="mt-3 leading-relaxed text-white/65">
          KORAX purchased during the presale is not delivered instantly during
          the active sale period. Instead, purchased balances are recorded and
          later released through the claim system after the presale has ended and
          claim has been enabled.
        </p>

        <p className="mt-3 leading-relaxed text-white/65">
          The claim logic is designed to protect against double execution and
          keep token release transparent. Once claim is activated, users can
          claim their purchased KRX according to the project’s release structure.
        </p>
      </section>

      {/* STAKING */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">
          Staking Infrastructure
        </h2>

        <p className="mt-3 leading-relaxed text-white/65">
          Staking becomes available after the presale and claim rollout.
          KORAX staking is designed around fixed-duration lock plans with
          predefined reward levels distributed from the staking allocation.
        </p>

        <ul className="mt-4 space-y-2 text-white/65">
          <li>1 Day staking plan</li>
          <li>14 Days staking plan</li>
          <li>1 Month staking plan</li>
          <li>3 Months staking plan</li>
          <li>6 Months staking plan</li>
          <li>9 Months staking plan</li>
          <li>12 Months staking plan</li>
        </ul>

        <p className="mt-4 leading-relaxed text-white/65">
          The 12-month staking plan is especially important because it can be
          connected to future builder access, project creation slots, and
          ecosystem-level participation.
        </p>
      </section>

      {/* FLEXIBLE ACCESS */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">
          Flexible Access Manager
        </h2>

        <p className="mt-3 leading-relaxed text-white/65">
          KORAX includes a flexible access infrastructure designed to connect
          staking commitment with builder permissions. Instead of permanently
          locking project creation requirements into hardcoded numbers, the
          access system is designed to remain adaptable over time.
        </p>

        <p className="mt-3 leading-relaxed text-white/65">
          This is important because if the value of KRX increases significantly,
          project creation should remain fair and accessible for real builders.
          The upgraded access structure gives the ecosystem more flexibility
          while maintaining on-chain transparency.
        </p>
      </section>

      {/* TOKEN BUILDER AI */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Token Builder AI</h2>

        <p className="mt-3 leading-relaxed text-white/65">
          Token Builder AI is one of the core future-facing tools inside KORAX.
          It is designed to help users turn a project idea into a structured
          blockchain project draft with clearer positioning, utility direction,
          tokenomics preview, roadmap planning, risk analysis, and improvement
          actions.
        </p>

        <p className="mt-3 leading-relaxed text-white/65">
          The system also supports AI project visual generation for branding
          direction, early marketing concepts, social media visuals, and project
          presentation. This helps builders move from raw idea to a more complete
          project concept before deployment or launch.
        </p>

        <p className="mt-3 leading-relaxed text-white/65">
          Full on-chain project deployment is prepared through the KORAX AI
          deployment infrastructure. When activated according to the ecosystem
          rollout plan, eligible users will be able to create project tokens,
          vaults, optional staking contracts, and registry entries through the
          KORAX builder flow.
        </p>
      </section>

      {/* LAUNCHPAD */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">
          Launch Your Project
        </h2>

        <p className="mt-3 leading-relaxed text-white/65">
          KORAX Launchpad infrastructure is designed to support project sale
          creation and participation through transparent on-chain logic. The
          launch system can support token sales, contribution limits, payment
          token options, claim phases, and access-based participation.
        </p>

        <p className="mt-3 leading-relaxed text-white/65">
          The long-term goal is to allow approved or eligible project creators
          to launch their own projects through KORAX infrastructure while giving
          committed KRX participants stronger access to ecosystem opportunities.
        </p>
      </section>

      {/* WEBSITE BUILDER AI */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">
          Website Builder AI
        </h2>

        <p className="mt-3 leading-relaxed text-white/65">
          Website Builder AI is currently under development. The goal is to help
          project creators generate Web3 website structures based on their token,
          roadmap, utility, staking logic, and launch plan.
        </p>

        <p className="mt-3 leading-relaxed text-white/65">
          Future versions may support website section generation, code output,
          preview flows, export options, and GitHub publishing support. This
          would allow users to move from a project idea to a real blockchain
          project website with much less manual setup.
        </p>
      </section>

      {/* SECURITY */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">
          Security & Transparency
        </h2>

        <p className="mt-3 leading-relaxed text-white/65">
          Transparency and security are central principles of KORAX. The
          ecosystem is built around verifiable smart contracts, public on-chain
          records, fixed supply logic, and clear separation between presale,
          claim, staking, AI deployment, registry, and launch infrastructure.
        </p>

        <p className="mt-3 leading-relaxed text-white/65">
          The project prioritizes verified contracts, transparent access rules,
          controlled claim activation, and responsible builder rollout. KORAX is
          designed to grow step by step while keeping its core infrastructure
          visible and understandable to the community.
        </p>
      </section>

      {/* DISCLAIMER */}
      <section className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Important Notice</h2>

        <p className="mt-3 leading-relaxed text-white/60">
          KORAX tools are designed to support project creation, launch planning,
          and ecosystem participation. Nothing in this documentation should be
          considered financial advice or a guarantee of profit. Users should
          always do their own research, understand blockchain risks, and review
          smart contract interactions carefully before participating.
        </p>
      </section>
    </div>
  );
}