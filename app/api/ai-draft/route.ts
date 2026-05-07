import { NextResponse } from "next/server";
import {
  buildWebsiteSystemPrompt as buildGeneratorSystemPrompt,
  buildWebsiteUserPrompt as buildGeneratorUserPrompt,
  buildWebsiteReviewerSystemPrompt as buildReviewerSystemPrompt,
  buildWebsiteReviewerUserPrompt as buildReviewerUserPrompt,
} from "@/lib/ai/website-prompts";
import { normalizeDraftResult } from "@/lib/ai/normalize";

const MODEL = "gpt-4.1";

async function createJsonCompletion(apiKey: string, system: string, user: string) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI request failed");
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content returned from OpenAI.");
  }

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("OpenAI returned invalid JSON.");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      projectName,
      symbol,
      category,
      shortDescription,
      targetAudience,
      network,
      presale,
      staking,
      vesting,
      style,
      goal,
      problemSolved,
      userCareReason,
      competitiveEdge,
      tokenUtilityReason,
      holdReason,
      growthLogic,
      revenueLogic,
      failureRisk,
    } = body || {};

    if (!projectName || !symbol || !category || !shortDescription || !network) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing in environment variables." },
        { status: 500 }
      );
    }

    const projectFeatures = [
      presale ? "Presale enabled" : "No presale",
      staking ? "Staking enabled" : "No staking",
      vesting ? "Vesting enabled" : "No vesting",
    ].join(", ");

    const firstPass = await createJsonCompletion(
      apiKey,
      buildGeneratorSystemPrompt(),
      buildGeneratorUserPrompt({
        projectName,
        symbol,
        category,
        shortDescription: `${shortDescription}\n\nProject features: ${projectFeatures}`,
        targetAudience: targetAudience || "General crypto users",
        network,
        style: style || "Professional",
        goal: goal || "Build a strong project concept",
        problemSolved: problemSolved || "",
        userCareReason: userCareReason || "",
        competitiveEdge: competitiveEdge || "",
        tokenUtilityReason: tokenUtilityReason || "",
        holdReason: holdReason || "",
        growthLogic: growthLogic || "",
        revenueLogic: revenueLogic || "",
        failureRisk: failureRisk || "",
      } as any)
    );

    const secondPass = await createJsonCompletion(
      apiKey,
      buildReviewerSystemPrompt(),
      buildReviewerUserPrompt(JSON.stringify(firstPass))
    );

    const normalized = normalizeDraftResult(secondPass);

    return NextResponse.json({
      result: normalized,
      meta: {
        model: MODEL,
        passes: 2,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected server error",
      },
      { status: 500 }
    );
  }
}