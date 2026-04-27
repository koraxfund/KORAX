import { NextResponse } from "next/server";

const IMAGE_MODEL = process.env.OPENAI_IMAGE_MODEL || "gpt-image-1";

function cleanText(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim();
}

function buildVisualPrompt(input: {
  projectName: string;
  symbol: string;
  category: string;
  shortDescription: string;
  imageType: string;
  visualStyle: string;
  colors: string;
  mood: string;
}) {
  const {
    projectName,
    symbol,
    category,
    shortDescription,
    imageType,
    visualStyle,
    colors,
    mood,
  } = input;

  return `
Create a professional Web3 project visual for a crypto/blockchain project.

Project name: ${projectName}
Token symbol: ${symbol}
Category: ${category}
Project description: ${shortDescription}

Image type: ${imageType}
Visual style: ${visualStyle}
Preferred colors: ${colors}
Mood: ${mood}

Requirements:
- High-quality crypto/Web3 visual.
- Premium, modern, trustworthy, and suitable for a serious blockchain project.
- Strong composition for marketing use.
- No fake exchange logos.
- No copyrighted brand logos.
- No real person or celebrity.
- No investment promises.
- No misleading financial claims.
- Avoid tiny unreadable text.
- If text is included, keep it minimal and use only the project name "${projectName}" and symbol "${symbol}".
- The image should feel suitable for a KORAX ecosystem project.
`.trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const projectName = cleanText(body?.projectName);
    const symbol = cleanText(body?.symbol);
    const category = cleanText(body?.category, "Web3");
    const shortDescription = cleanText(body?.shortDescription);
    const imageType = cleanText(body?.imageType, "Project Poster");
    const visualStyle = cleanText(body?.visualStyle, "Futuristic Web3");
    const colors = cleanText(body?.colors, "black, neon green, silver");
    const mood = cleanText(body?.mood, "premium, futuristic, serious");

    if (!projectName || !symbol || !shortDescription) {
      return NextResponse.json(
        { error: "Missing project name, symbol, or description." },
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

    const prompt = buildVisualPrompt({
      projectName,
      symbol,
      category,
      shortDescription,
      imageType,
      visualStyle,
      colors,
      mood,
    });

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: IMAGE_MODEL,
        prompt,
        size: "1024x1024",
        quality: "medium",
        n: 1,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data?.error?.message || "Image generation failed.",
        },
        { status: response.status }
      );
    }

    const imageBase64 = data?.data?.[0]?.b64_json;
    const imageUrl = data?.data?.[0]?.url;

    if (!imageBase64 && !imageUrl) {
      return NextResponse.json(
        { error: "No image returned from OpenAI." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageBase64,
      imageUrl,
      prompt,
      model: IMAGE_MODEL,
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