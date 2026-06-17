import { NextResponse } from "next/server";
import { ethers } from "ethers";
import {
  PROJECT_REGISTRY_ADDRESS,
  RPC_URL,
  projectRegistryAbi,
} from "@/lib/korax/contracts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type PublicProject = {
  id: string;
  owner: string;
  name: string;
  symbol: string;
  token: string;
  presale: string;
  staking: string;
  vault: string;
  metadataURI: string;
  createdAt: string;
  createdAtUnix: string;
  active: boolean;
  slug: string;
  launchUrl: string;
};

function slugify(value: string) {
  return (
    value
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "korax-project"
  );
}

function safeString(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function normalizeAddress(value: unknown) {
  try {
    const text = safeString(value);
    if (!ethers.isAddress(text)) return "";
    return ethers.getAddress(text);
  } catch {
    return "";
  }
}

function parseProject(raw: any): PublicProject {
  const id = safeString(raw.id ?? raw[0]);
  const owner = normalizeAddress(raw.owner ?? raw[1]);
  const name = safeString(raw.name ?? raw[2]) || "KORAX Project";
  const symbol = safeString(raw.symbol ?? raw[3]) || "KRX";
  const token = normalizeAddress(raw.token ?? raw[4]);
  const presale = normalizeAddress(raw.presale ?? raw[5]);
  const staking = normalizeAddress(raw.staking ?? raw[6]);
  const vault = normalizeAddress(raw.vault ?? raw[7]);
  const metadataURI = safeString(raw.metadataURI ?? raw[8]);
  const createdAtUnix = safeString(raw.createdAt ?? raw[9] ?? "0");
  const active = Boolean(raw.active ?? raw[10]);

  const slug = slugify(`${name}-${symbol}-${id}`);

  let createdAt = "";

  try {
    const unix = Number(createdAtUnix);
    createdAt = unix > 0 ? new Date(unix * 1000).toISOString() : "";
  } catch {
    createdAt = "";
  }

  return {
    id,
    owner,
    name,
    symbol,
    token,
    presale,
    staking,
    vault,
    metadataURI,
    createdAt,
    createdAtUnix,
    active,
    slug,
    launchUrl: `/launch?project=${slug}`,
  };
}

export async function GET(request: Request) {
  try {
    if (!RPC_URL) {
      return NextResponse.json(
        { ok: false, error: "RPC_URL is missing." },
        { status: 500 }
      );
    }

    if (!PROJECT_REGISTRY_ADDRESS) {
      return NextResponse.json(
        { ok: false, error: "PROJECT_REGISTRY_ADDRESS is missing." },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const limitParam = Number(url.searchParams.get("limit") || "50");
    const includeInactive = url.searchParams.get("includeInactive") === "true";

    const limit = Math.min(Math.max(limitParam || 50, 1), 100);

    const provider = new ethers.JsonRpcProvider(RPC_URL);

    const registry = new ethers.Contract(
      PROJECT_REGISTRY_ADDRESS,
      projectRegistryAbi,
      provider
    );

    const nextProjectIdRaw = await registry.nextProjectId();
    const nextProjectId = Number(nextProjectIdRaw);

    const projects: PublicProject[] = [];

    for (let id = Math.max(0, nextProjectId - 1); id >= 0; id--) {
      try {
        const rawProject = await registry.getProject(id);
        const project = parseProject(rawProject);

        if (!project.token) continue;
        if (!includeInactive && !project.active) continue;

        projects.push(project);

        if (projects.length >= limit) break;
      } catch {
        // ignore empty/broken project ids
      }
    }

    return NextResponse.json({
      ok: true,
      source: "project-registry",
      registry: PROJECT_REGISTRY_ADDRESS,
      nextProjectId,
      count: projects.length,
      projects,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        ok: false,
        error:
          err?.shortMessage ||
          err?.reason ||
          err?.message ||
          "Failed to load public projects.",
      },
      { status: 500 }
    );
  }
}