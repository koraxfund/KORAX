export default function TermsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        <p className="mt-3 max-w-3xl text-white/70">
          By accessing or using the KORAX platform, you agree to the following terms.
        </p>
      </section>

      <section className="space-y-4">
        {[
          {
            title: "1. Use of Platform",
            body: "KORAX provides blockchain-related infrastructure, informational pages, and future launchpad tools. Access to the platform is subject to local laws and user responsibility.",
          },
          {
            title: "2. No Financial Advice",
            body: "Nothing on the KORAX platform should be interpreted as financial, investment, or legal advice. Users are solely responsible for their own decisions.",
          },
          {
            title: "3. Risk Acknowledgment",
            body: "Participation in token presales, staking, or blockchain-related activities involves risk and may result in partial or total loss of funds.",
          },
          {
            title: "4. User Responsibility",
            body: "Users are responsible for their wallets, private keys, connected devices, and all actions performed through their wallet connections.",
          },
          {
            title: "5. Future Creator Tools",
            body: "KORAX may introduce creator tools such as Launch Your Project and Token Builder AI. Project owners remain fully responsible for the projects they build or launch using such tools.",
          },
          {
            title: "6. Service Changes",
            body: "KORAX may modify, expand, suspend, or update platform features, documentation, and infrastructure at any time.",
          },
          {
            title: "7. Legal Compliance",
            body: "Users must ensure that their use of KORAX is lawful in their jurisdiction. KORAX does not guarantee regulatory suitability in every country.",
          },
        ].map((item) => (
          <section
            key={item.title}
            className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md"
          >
            <h2 className="text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-white/65 leading-relaxed">{item.body}</p>
          </section>
        ))}
      </section>
    </div>
  );
}