import { NextResponse } from "next/server";
import {
  buildWebsiteEditorSystemPrompt,
  buildWebsiteEditorUserPrompt,
} from "@/lib/ai/website-editor-prompts";

const MODEL = "gpt-4.1";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const currentWebsite = body?.currentWebsite;
    const editInstruction =
      typeof body?.editInstruction === "string"
        ? body.editInstruction.trim()
        : "";
    const targetFile =
      typeof body?.targetFile === "string" ? body.targetFile.trim() : "";

    if (!currentWebsite) {
      return NextResponse.json(
        { error: "Missing current website package." },
        { status: 400 }
      );
    }

    if (!editInstruction) {
      return NextResponse.json(
        { error: "Edit instruction is required." },
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

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.65,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: buildWebsiteEditorSystemPrompt(),
          },
          {
            role: "user",
            content: buildWebsiteEditorUserPrompt({
              currentWebsiteJson: JSON.stringify(currentWebsite),
              editInstruction,
              targetFile,
            }),
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "OpenAI request failed.", raw: data },
        { status: 500 }
      );
    }

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content returned from OpenAI." },
        { status: 500 }
      );
    }

    const updatedWebsite = safeJsonParse(content);

    if (!Array.isArray(updatedWebsite?.files)) {
      return NextResponse.json(
        { error: "Updated website package is missing files array." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: updatedWebsite,
      meta: {
        model: MODEL,
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