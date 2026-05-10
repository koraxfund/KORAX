import { NextResponse } from "next/server";
import JSZip from "jszip";

function cleanZipFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "generated-website";
}

function isSafePath(path: string) {
  if (!path || typeof path !== "string") return false;

  const normalized = path.replace(/\\/g, "/").trim();

  if (normalized.startsWith("/")) return false;
  if (normalized.includes("../")) return false;
  if (normalized.includes("..\\")) return false;
  if (normalized.includes("\0")) return false;

  return true;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const projectName =
      typeof body?.projectName === "string" ? body.projectName : "generated-website";

    const files = Array.isArray(body?.files) ? body.files : [];

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided for ZIP generation." },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    for (const file of files) {
      if (!file || typeof file.path !== "string") continue;

      const filePath = file.path.replace(/\\/g, "/").trim();

      if (!isSafePath(filePath)) {
        return NextResponse.json(
          { error: `Unsafe file path detected: ${file.path}` },
          { status: 400 }
        );
      }

      const content =
        typeof file.content === "string" ? file.content : "";

      zip.file(filePath, content);
    }

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    });

    const fileName = `${cleanZipFileName(projectName)}-website.zip`;

    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Unexpected ZIP generation error.",
      },
      { status: 500 }
    );
  }
}