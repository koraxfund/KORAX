import { NextResponse } from "next/server";
import {
  buildWebsiteSystemPrompt,
  buildWebsiteUserPrompt,
  buildWebsiteReviewerSystemPrompt,
  buildWebsiteReviewerUserPrompt,
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
  let cleaned = path.trim().replace(/^\/+/, "");

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

    "components/faqs.tsx": "components/FAQ.tsx",
    "components/faq.tsx": "components/FAQ.tsx",

    "components/footer section.tsx": "components/Footer.tsx",
    "components/footer.tsx": "components/Footer.tsx",

    "lib/sitedata.ts": "lib/site-data.ts",
    "lib/siteData.ts": "lib/site-data.ts",
    "lib/site-data.ts": "lib/site-data.ts",

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

    secondPass.files = normalizeFiles(secondPass.files);

    const requiredFiles = [
      "package.json",
      "app/layout.tsx",
      "app/providers.tsx",
      "app/page.tsx",
      "app/globals.css",
      "components/Navbar.tsx",
      "components/Hero.tsx",
      "components/Stats.tsx",
      "components/About.tsx",
      "components/Tokenomics.tsx",
      "components/Staking.tsx",
      "components/LaunchSection.tsx",
      "components/Roadmap.tsx",
      "components/Contracts.tsx",
      "components/FAQ.tsx",
      "components/Footer.tsx",
      "lib/site-data.ts",
      "public/logo.svg",
      "public/hero-bg.svg",
      "README.md",
      ".env.example",
      "vercel.json",
    ];

    const existingPaths = secondPass.files.map((file: any) => file.path);

    const missing = requiredFiles.filter(
      (path) => !existingPaths.includes(path)
    );

    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: `AI response missing required files: ${missing.join(", ")}`,
          result: secondPass,
        },
        { status: 500 }
      );
    }

    const emptyFiles = secondPass.files
      .filter((file: any) => requiredFiles.includes(file.path))
      .filter((file: any) => !file.content || file.content.trim().length < 20)
      .map((file: any) => file.path);

    if (emptyFiles.length > 0) {
      return NextResponse.json(
        {
          error: `AI response returned empty or too-small files: ${emptyFiles.join(
            ", "
          )}`,
          result: secondPass,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: secondPass,
      meta: {
        model: MODEL,
        passes: 2,
        requiredFiles,
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