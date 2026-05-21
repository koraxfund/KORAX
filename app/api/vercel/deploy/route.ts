import { NextResponse } from "next/server";

function cleanProjectName(value: string) {
  return (
    value
      ?.toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "korax-generated-site"
  );
}

function getGithubRepoParts(repoUrl: string) {
  try {
    const url = new URL(repoUrl);

    if (!url.hostname.includes("github.com")) {
      throw new Error("Only GitHub repository URLs are supported.");
    }

    const parts = url.pathname
      .replace(/^\/+/, "")
      .replace(/\.git$/, "")
      .split("/")
      .filter(Boolean);

    if (parts.length < 2) {
      throw new Error("Invalid GitHub repository URL.");
    }

    return {
      owner: parts[0],
      repo: parts[1],
      fullName: `${parts[0]}/${parts[1]}`,
    };
  } catch {
    throw new Error("Invalid GitHub repository URL.");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const vercelToken =
      typeof body?.vercelToken === "string" ? body.vercelToken.trim() : "";

    const githubRepoUrl =
      typeof body?.githubRepoUrl === "string" ? body.githubRepoUrl.trim() : "";

    const projectName =
      typeof body?.projectName === "string" ? body.projectName.trim() : "";

    const branch =
      typeof body?.branch === "string" && body.branch.trim()
        ? body.branch.trim()
        : "main";

    if (!vercelToken) {
      return NextResponse.json(
        { error: "Vercel token is required." },
        { status: 400 }
      );
    }

    if (!githubRepoUrl) {
      return NextResponse.json(
        { error: "GitHub repository URL is required." },
        { status: 400 }
      );
    }

    const { owner, repo, fullName } = getGithubRepoParts(githubRepoUrl);
    const name = cleanProjectName(projectName || repo);

    /**
     * Create Vercel project connected to the user's GitHub repo.
     * The token must belong to the user's own Vercel account.
     */
    const createProjectResponse = await fetch(
      "https://api.vercel.com/v10/projects",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          framework: "nextjs",
          gitRepository: {
            type: "github",
            repo: fullName,
          },
        }),
      }
    );

    const createProjectData = await createProjectResponse.json();

    if (!createProjectResponse.ok) {
      return NextResponse.json(
        {
          error:
            createProjectData?.error?.message ||
            createProjectData?.message ||
            "Failed to create Vercel project.",
          details: createProjectData,
        },
        { status: createProjectResponse.status }
      );
    }

    /**
     * Start production deployment from GitHub source.
     * Vercel account must have access to the GitHub repository.
     */
    const deploymentResponse = await fetch(
      "https://api.vercel.com/v13/deployments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          target: "production",
          project: createProjectData.id,
          gitSource: {
            type: "github",
            repo,
            org: owner,
            ref: branch,
          },
        }),
      }
    );

    const deploymentData = await deploymentResponse.json();

    if (!deploymentResponse.ok) {
      return NextResponse.json(
        {
          error:
            deploymentData?.error?.message ||
            deploymentData?.message ||
            "Project created, but deployment failed.",
          project: createProjectData,
          details: deploymentData,
        },
        { status: deploymentResponse.status }
      );
    }

    const deploymentUrl = deploymentData?.url
      ? `https://${deploymentData.url}`
      : "";

    return NextResponse.json({
      success: true,
      projectId: createProjectData.id,
      projectName: createProjectData.name || name,
      deploymentId: deploymentData.id,
      deploymentUrl,
      project: createProjectData,
      deployment: deploymentData,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err?.message || "Unexpected Vercel deployment error.",
      },
      { status: 500 }
    );
  }
}