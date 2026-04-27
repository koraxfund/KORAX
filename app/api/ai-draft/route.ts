import { NextResponse } from "next/server";
import {
  buildGeneratorSystemPrompt,
  buildGeneratorUserPrompt,
  buildReviewerSystemPrompt,
  buildReviewerUserPrompt,
} from "@/lib/ai/prompts";
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

  return JSON.parse(content);
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
        { error: "OPENAI_API_KEY is missing in env.local" },
        { status: 500 }
      );
    }

    const firstPass = await createJsonCompletion(
      apiKey,
      buildGeneratorSystemPrompt(),
      buildGeneratorUserPrompt({
        projectName,
        symbol,
        category,
        shortDescription,
        targetAudience: targetAudience || "General crypto users",
        network,
        presale: Boolean(presale),
        staking: Boolean(staking),
        vesting: Boolean(vesting),
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
      })
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