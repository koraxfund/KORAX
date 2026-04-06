export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
        <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        <p className="mt-3 max-w-3xl text-white/70">
          This page explains how KORAX approaches privacy and user data.
        </p>
      </section>

      <section className="space-y-4">
        {[
          {
            title: "1. General Approach",
            body: "KORAX is designed to minimize personal data collection wherever possible. The platform is focused on blockchain infrastructure rather than traditional account-based user storage.",
          },
          {
            title: "2. Wallet Connections",
            body: "When users connect a wallet, the connection is handled through third-party wallet providers. KORAX does not store private keys or wallet seed phrases.",
          },
          {
            title: "3. Blockchain Visibility",
            body: "Blockchain transactions are public by design. Users should understand that wallet activity on-chain may be visible to anyone through blockchain explorers.",
          },
          {
            title: "4. Personal Information",
            body: "KORAX does not intentionally collect personal information unless explicitly provided through contact forms, applications, or future creator submission tools.",
          },
          {
            title: "5. Third-Party Services",
            body: "Some platform features may interact with third-party providers such as wallet software, hosting infrastructure, or analytics services. Those providers may apply their own privacy practices.",
          },
          {
            title: "6. Security",
            body: "Reasonable technical measures may be used to protect platform integrity, but no online system can guarantee absolute security.",
          },
          {
            title: "7. Policy Updates",
            body: "This privacy policy may be updated over time as the KORAX platform evolves.",
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