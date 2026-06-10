import { NextResponse } from "next/server";
import {
  buildWebsiteSystemPrompt,
  buildWebsiteUserPrompt,
  buildWebsiteReviewerSystemPrompt,
  buildWebsiteReviewerUserPrompt,
  REQUIRED_WEBSITE_FILES,
} from "@/lib/ai/website-prompts";

const MODEL = "gpt-4.1";

function cleanText(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function safeJsonParse(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    const first = content.indexOf("{");
    const last = content.lastIndexOf("}");

    if (first >= 0 && last > first) {
      return JSON.parse(content.slice(first, last + 1));
    }

    throw new Error("AI returned invalid JSON.");
  }
}

async function createJsonCompletion(
  apiKey: string,
  system: string,
  user: string
) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.72,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI request failed.");
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content returned from OpenAI.");
  }

  return safeJsonParse(content);
}

function normalizeFilePath(path: string) {
  const cleaned = path.trim().replace(/^\/+/, "");
  const lower = cleaned.toLowerCase();

  const aliases: Record<string, string> = {
    "components/nav bar.tsx": "components/Navbar.tsx",
    "components/nav.tsx": "components/Navbar.tsx",
    "components/navigation.tsx": "components/Navbar.tsx",
    "components/header.tsx": "components/Navbar.tsx",

    "components/hero section.tsx": "components/Hero.tsx",
    "components/hero.tsx": "components/Hero.tsx",

    "components/stat.tsx": "components/Stats.tsx",
    "components/stats.tsx": "components/Stats.tsx",

    "components/about section.tsx": "components/About.tsx",
    "components/about.tsx": "components/About.tsx",

    "components/tokenomics section.tsx": "components/Tokenomics.tsx",
    "components/tokenomics.tsx": "components/Tokenomics.tsx",

    "components/staking section.tsx": "components/Staking.tsx",
    "components/staking.tsx": "components/Staking.tsx",

    "components/launch.tsx": "components/LaunchSection.tsx",
    "components/launch section.tsx": "components/LaunchSection.tsx",
    "components/launchsection.tsx": "components/LaunchSection.tsx",

    "components/roadmap section.tsx": "components/Roadmap.tsx",
    "components/roadmap.tsx": "components/Roadmap.tsx",

    "components/contracts section.tsx": "components/Contracts.tsx",
    "components/contracts.tsx": "components/Contracts.tsx",

    "components/security section.tsx": "components/Security.tsx",
    "components/security.tsx": "components/Security.tsx",

    "components/how to buy.tsx": "components/HowToBuy.tsx",
    "components/howtobuy.tsx": "components/HowToBuy.tsx",
    "components/how-to-buy.tsx": "components/HowToBuy.tsx",

    "components/community section.tsx": "components/Community.tsx",
    "components/community.tsx": "components/Community.tsx",

    "components/partners section.tsx": "components/Partners.tsx",
    "components/partners.tsx": "components/Partners.tsx",

    "components/disclaimer section.tsx": "components/Disclaimer.tsx",
    "components/disclaimer.tsx": "components/Disclaimer.tsx",

    "components/faqs.tsx": "components/FAQ.tsx",
    "components/faq.tsx": "components/FAQ.tsx",

    "components/footer section.tsx": "components/Footer.tsx",
    "components/footer.tsx": "components/Footer.tsx",

    "lib/sitedata.ts": "lib/site-data.ts",
    "lib/siteData.ts": "lib/site-data.ts",
    "lib/site-data.ts": "lib/site-data.ts",

    "lib/utils.ts": "lib/format.ts",
    "lib/helpers.ts": "lib/format.ts",
    "lib/format.ts": "lib/format.ts",

    "docs/page.tsx": "app/docs/page.tsx",
    "terms/page.tsx": "app/terms/page.tsx",
    "privacy/page.tsx": "app/privacy/page.tsx",

    "public/logo.svg": "public/logo.svg",
    "public/hero-bg.svg": "public/hero-bg.svg",
  };

  return aliases[lower] || cleaned;
}

function normalizeFiles(files: any[]) {
  return files
    .filter((file) => file && typeof file.path === "string")
    .map((file) => ({
      path: normalizeFilePath(file.path),
      content: typeof file.content === "string" ? file.content : "",
    }));
}

function componentNameFromPath(path: string) {
  const fileName = path.split("/").pop()?.replace(".tsx", "") || "Section";
  const cleaned = fileName.replace(/[^a-zA-Z0-9]/g, "");

  if (!cleaned) return "Section";

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function fallbackComponent(path: string, projectName: string, symbol: string) {
  const componentName = componentNameFromPath(path);
  const safeProjectName = JSON.stringify(projectName || "Project");
  const safeSymbol = JSON.stringify(symbol || "TOKEN");

  if (path === "components/Stats.tsx") {
    return `export default function Stats() {
  const stats = [
    { label: "Project", value: ${safeProjectName} },
    { label: "Symbol", value: ${safeSymbol} },
    { label: "Network", value: "BNB Chain" },
    { label: "Status", value: "Launch Ready" },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-white/50">{item.label}</div>
            <div className="mt-2 text-xl font-bold text-white">{item.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
  }

  if (path === "components/Security.tsx") {
    return `export default function Security() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-[#7CFF6A]">Security</p>
        <h2 className="mt-3 text-3xl font-black text-white">Built for trust and transparency.</h2>
        <p className="mt-4 max-w-3xl text-white/65">
          ${projectName || "This project"} presents clear contract information, launch details,
          and transparent project sections so users can review the ecosystem carefully.
        </p>
      </div>
    </section>
  );
}
`;
  }

  if (path === "components/HowToBuy.tsx") {
    return `export default function HowToBuy() {
  const steps = ["Connect wallet", "Check network", "Review project details", "Follow official launch instructions"];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <p className="text-sm uppercase tracking-[0.25em] text-[#7CFF6A]">How to buy</p>
      <h2 className="mt-3 text-3xl font-black text-white">Simple launch flow.</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm text-[#7CFF6A]">Step {index + 1}</div>
            <div className="mt-2 font-bold text-white">{step}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;
  }

  if (path === "components/Community.tsx") {
    return `export default function Community() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="rounded-3xl border border-[#7CFF6A]/20 bg-[#7CFF6A]/10 p-8">
        <p className="text-sm uppercase tracking-[0.25em] text-[#c4ffbc]">Community</p>
        <h2 className="mt-3 text-3xl font-black text-white">Join the ${projectName || "project"} community.</h2>
        <p className="mt-4 max-w-3xl text-white/70">
          Follow official channels, review updates, and participate carefully. Always do your own research.
        </p>
      </div>
    </section>
  );
}
`;
  }

  if (path === "components/Partners.tsx") {
    return `export default function Partners() {
  const partners = ["BNB Chain", "MetaMask", "Trust Wallet", "KORAX"];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <p className="text-sm uppercase tracking-[0.25em] text-[#7CFF6A]">Ecosystem</p>
      <h2 className="mt-3 text-3xl font-black text-white">Compatible ecosystem tools.</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {partners.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center font-bold text-white">
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
`;
  }

  return `export default function ${componentName}() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-3xl font-black text-white">${componentName}</h2>
        <p className="mt-4 text-white/65">
          This section was automatically completed by KORAX Website Builder AI.
        </p>
      </div>
    </section>
  );
}
`;
}

function addFallbackFiles(
  files: any[],
  requiredFiles: string[],
  projectName: string,
  symbol: string
) {
  const map = new Map<string, any>();

  for (const file of files) {
    if (!file?.path) continue;

    map.set(file.path, {
      path: file.path,
      content: typeof file.content === "string" ? file.content : "",
    });
  }

  for (const path of requiredFiles) {
    const existing = map.get(path);

    if (!existing) {
      map.set(path, {
        path,
        content: fallbackComponent(path, projectName, symbol),
      });
      continue;
    }

    if (!existing.content || existing.content.trim().length < 20) {
      map.set(path, {
        path,
        content: fallbackComponent(path, projectName, symbol),
      });
    }
  }

  return Array.from(map.values());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const projectName = cleanText(body?.projectName);
    const symbol = cleanText(body?.symbol);
    const category = cleanText(body?.category, "Web3");
    const shortDescription = cleanText(body?.shortDescription);
    const targetAudience = cleanText(body?.targetAudience, "Web3 users");

    const websiteStyle = cleanText(body?.websiteStyle, "Premium Dark Web3");
    const primaryColor = cleanText(body?.primaryColor, "#0B5FFF");
    const secondaryColor = cleanText(body?.secondaryColor, "#7CFF6A");
    const backgroundStyle = cleanText(
      body?.backgroundStyle,
      "Dark blue-black futuristic gradient"
    );

    const network = cleanText(body?.network, "BNB Chain");

    const tokenAddress = cleanText(body?.tokenAddress);
    const stakingAddress = cleanText(body?.stakingAddress);
    const vaultAddress = cleanText(body?.vaultAddress);
    const launchpadAddress = cleanText(body?.launchpadAddress);

    const xLink = cleanText(body?.xLink);
    const telegramLink = cleanText(body?.telegramLink);
    const youtubeLink = cleanText(body?.youtubeLink);
    const tiktokLink = cleanText(body?.tiktokLink);
    const instagramLink = cleanText(body?.instagramLink);
    const facebookLink = cleanText(body?.facebookLink);
    const discordLink = cleanText(body?.discordLink);

    const websiteSections = cleanText(body?.websiteSections);
    const specialInstructions = cleanText(body?.specialInstructions);

    if (!projectName || !symbol || !shortDescription) {
      return NextResponse.json(
        { error: "Project name, symbol, and description are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing in env.local" },
        { status: 500 }
      );
    }

    const firstPass = await createJsonCompletion(
      apiKey,
      buildWebsiteSystemPrompt(),
      buildWebsiteUserPrompt({
        projectName,
        symbol,
        category,
        shortDescription,
        targetAudience,
        websiteStyle,
        primaryColor,
        secondaryColor,
        backgroundStyle,
        network,
        tokenAddress,
        stakingAddress,
        vaultAddress,
        launchpadAddress,
        xLink,
        telegramLink,
        youtubeLink,
        tiktokLink,
        instagramLink,
        facebookLink,
        discordLink,
        websiteSections,
        specialInstructions,
      })
    );

    const secondPass = await createJsonCompletion(
      apiKey,
      buildWebsiteReviewerSystemPrompt(),
      buildWebsiteReviewerUserPrompt(JSON.stringify(firstPass))
    );

    if (!Array.isArray(secondPass?.files)) {
      return NextResponse.json(
        { error: "AI response missing files array.", result: secondPass },
        { status: 500 }
      );
    }

    const requiredFiles = REQUIRED_WEBSITE_FILES;

    secondPass.files = normalizeFiles(secondPass.files);
    secondPass.files = addFallbackFiles(
      secondPass.files,
      requiredFiles,
      projectName,
      symbol
    );

    return NextResponse.json({
      result: secondPass,
      meta: {
        model: MODEL,
        passes: 2,
        requiredFiles,
        fallbackEnabled: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}