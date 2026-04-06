export default function DocsPage() {
  return (
    <div className="space-y-8">

      {/* HEADER */}
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">KORAX Whitepaper</h1>
        <p className="mt-3 text-white/70">
          Technical overview of the KORAX ecosystem, including the live presale
          model, tokenomics, claim logic, staking infrastructure, and the
          long-term vision of the KORAX launchpad and AI token builder.
        </p>
      </section>

      {/* VISION */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Vision</h2>
        <p className="mt-3 text-white/65 leading-relaxed">
          KORAX is designed to simplify blockchain project creation, token
          launches, and investor participation through a secure and transparent
          ecosystem built on BNB Smart Chain. The platform is intended to reduce
          unnecessary friction while keeping core on-chain functions verifiable
          and accessible.
        </p>

        <p className="mt-3 text-white/65 leading-relaxed">
          Through a combination of presale infrastructure, fixed-reward staking,
          launchpad tooling, and AI-assisted token creation features, KORAX aims
          to evolve into a creator-focused blockchain platform where both
          investors and builders can participate with greater clarity and trust.
        </p>
      </section>

      {/* PRESALE */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Presale Model</h2>

        <p className="mt-3 text-white/65 leading-relaxed">
          KORAX uses a structured five-stage presale model with a total presale
          allocation of 50,000,000 tokens. Buyers can participate using USDT,
          USDC, or BNB, while token pricing increases progressively across the
          stages.
        </p>

        <ul className="mt-4 space-y-2 text-white/65">
          <li>Stage 1 — 10,000,000 tokens at $0.05</li>
          <li>Stage 2 — 10,000,000 tokens at $0.07</li>
          <li>Stage 3 — 10,000,000 tokens at $0.09</li>
          <li>Stage 4 — 10,000,000 tokens at $0.11</li>
          <li>Stage 5 — 10,000,000 tokens at $0.13</li>
        </ul>

        <p className="mt-4 text-white/65">
          The presale remains active until the full allocation is sold or the
          sale is manually closed according to the project’s operational plan.
          Tokens purchased during the presale are recorded on-chain and later
          become claimable when claim is activated.
        </p>
      </section>

      {/* TOKENOMICS */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Tokenomics</h2>

        <p className="mt-3 text-white/65">
          The total supply of KORAX is permanently fixed at 100,000,000 tokens.
          The project is designed as a non-inflationary ecosystem where no new
          tokens are minted beyond the original supply.
        </p>

        <ul className="mt-4 space-y-2 text-white/65">
          <li>50,000,000 tokens allocated for presale participation</li>
          <li>50,000,000 tokens allocated for staking rewards and ecosystem support</li>
        </ul>

        <p className="mt-4 text-white/65">
          This fixed-supply design ensures that rewards and distributions are
          sourced from the existing allocation rather than inflationary token
          expansion.
        </p>
      </section>

      {/* CLAIM */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Claim System</h2>

        <p className="mt-3 text-white/65">
          Claim is activated only after the presale phase is completed and
          enabled by the project. Purchased tokens are not delivered instantly
          during the sale; instead, they are claimed later through the claim
          contract flow.
        </p>

        <p className="mt-3 text-white/65">
          Once claim becomes active, token release follows a vesting structure:
          25% becomes available at claim activation, and the remaining
          allocation unlocks in additional 25% portions every 30 days until the
          full purchased balance is released.
        </p>
      </section>

      {/* STAKING */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Staking Infrastructure</h2>

        <p className="mt-3 text-white/65">
          Staking becomes available after the presale is closed. Users can lock
          KORAX tokens in fixed-duration plans in exchange for predefined reward
          levels distributed from the staking allocation pool.
        </p>

        <ul className="mt-4 space-y-2 text-white/65">
          <li>1 Day</li>
          <li>14 Days</li>
          <li>1 Month</li>
          <li>3 Months</li>
          <li>6 Months</li>
          <li>9 Months</li>
          <li>12 Months</li>
        </ul>

        <p className="mt-4 text-white/65">
          Longer staking durations receive stronger fixed reward percentages,
          encouraging sustained participation and long-term alignment with the
          ecosystem.
        </p>
      </section>

      {/* LAUNCHPAD */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Launchpad Infrastructure</h2>

        <p className="mt-3 text-white/65">
          One of the long-term objectives of KORAX is to enable project creators
          to launch their own tokens and fundraising campaigns through the
          platform. The launchpad infrastructure is intended to provide a more
          structured path for presenting, verifying, and launching blockchain
          projects.
        </p>

        <p className="mt-3 text-white/65">
          Over time, KORAX aims to support a creator-driven environment where
          projects can be introduced to the community through transparent sale
          structures and platform-native launch tools.
        </p>
      </section>

      {/* TOKEN BUILDER AI */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Token Builder AI</h2>

        <p className="mt-3 text-white/65">
          KORAX plans to introduce an AI-assisted token builder to simplify
          blockchain project creation. This tool is intended to help users
          structure token parameters, deployment logic, and launch preparation
          without requiring advanced technical knowledge from the beginning.
        </p>

        <p className="mt-3 text-white/65">
          The long-term objective is to lower the technical barrier for project
          creators while still preserving transparency, contract clarity, and
          responsible deployment practices.
        </p>
      </section>

      {/* SECURITY */}
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 backdrop-blur-md">
        <h2 className="text-xl font-semibold text-white">Security & Transparency</h2>

        <p className="mt-3 text-white/65">
          Transparency and security are central principles of the KORAX
          ecosystem. The smart contract infrastructure, token allocation model,
          presale tracking, claim logic, and staking mechanics are designed to
          be publicly visible and verifiable on-chain.
        </p>

        <p className="mt-3 text-white/65">
          The ecosystem also includes operational protections such as controlled
          claim activation, on-chain purchase accounting, and anti-bot measures
          on the presale side. Future upgrades and infrastructure improvements
          will continue to prioritize reliability, verifiability, and
          responsible development standards.
        </p>
      </section>

    </div>
  );
}