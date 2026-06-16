import { NextResponse } from "next/server";
import {
  buildWebsiteBuilderInput,
  generatePremiumWeb3Website,
  getKoraxWalletConnectProjectId,
} from "@/lib/website-templates/premium-web3";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = buildWebsiteBuilderInput(body);

    if (!input.projectName || !input.symbol || !input.shortDescription) {
      return NextResponse.json(
        { error: "Project name, symbol, and description are required." },
        { status: 400 }
      );
    }

    const walletConnectProjectId = getKoraxWalletConnectProjectId();

    if (!walletConnectProjectId) {
      return NextResponse.json(
        {
          error:
            "NEXT_PUBLIC_KORAX_WALLETCONNECT_PROJECT_ID is missing. Add it first so generated websites have Connect Wallet ready.",
        },
        { status: 500 }
      );
    }

    const result = generatePremiumWeb3Website(input, walletConnectProjectId);

    return NextResponse.json({
      result,
      meta: {
        generationMode: "korax-beast-v4-10000-plus-lines",
        walletConnectReady: true,
        filesGenerated: result.files.length,
        generatedLines: result.meta.generatedLines,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}