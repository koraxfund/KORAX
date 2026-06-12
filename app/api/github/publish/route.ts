import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type WebsiteFile = {
  path: string;
  content: string;
};

type GitHubUser = {
  login: string;
  html_url?: string;
};

type GitHubRepo = {
  name: string;
  html_url?: string;
  default_branch?: string;
};

type GitHubFileResponse = {
  sha?: string;
  type?: string;
};

type GitHubErrorResponse = {
  message?: string;
};

type GitHubContentPayload = {
  message: string;
  content: string;
  branch: string;
  sha?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(value: unknown, fallback: string) {
  if (isRecord(value) && typeof value.message === "string") {
    return value.message;
  }

  return fallback;
}

function cleanRepoName(value: unknown) {
  if (typeof value !== "string") return "korax-generated-site";

  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "korax-generated-site"
  );
}

function normalizeFilePath(path: string) {
  return path.trim().replace(/^\/+/, "");
}

function toBase64(content: string) {
  return Buffer.from(content, "utf8").toString("base64");
}

function encodeGitHubPath(path: string) {
  return encodeURIComponent(path).replace(/%2F/g, "/");
}

function isWebsiteFile(value: unknown): value is WebsiteFile {
  return (
    isRecord(value) &&
    typeof value.path === "string" &&
    typeof value.content === "string"
  );
}

async function githubFetch(
  url: string,
  token: string,
  options: RequestInit = {}
) {
  return fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "KORAX-Website-Builder",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });
}

async function getGithubUser(token: string): Promise<GitHubUser> {
  const response = await githubFetch("https://api.github.com/user", token);
  const data: unknown = await response.json().catch(() => null);

  if (!response.ok || !isRecord(data) || typeof data.login !== "string") {
    throw new Error(getErrorMessage(data, "Could not load GitHub user."));
  }

  return {
    login: data.login,
    html_url: typeof data.html_url === "string" ? data.html_url : undefined,
  };
}

async function getRepo(
  token: string,
  owner: string,
  repo: string
): Promise<GitHubRepo | null> {
  const response = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}`,
    token
  );

  if (response.status === 404) return null;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok || !isRecord(data) || typeof data.name !== "string") {
    throw new Error(
      getErrorMessage(data, "Could not check GitHub repository.")
    );
  }

  return {
    name: data.name,
    html_url: typeof data.html_url === "string" ? data.html_url : undefined,
    default_branch:
      typeof data.default_branch === "string" ? data.default_branch : "main",
  };
}

async function createRepo({
  token,
  repoName,
  privateRepo,
  description,
}: {
  token: string;
  repoName: string;
  privateRepo: boolean;
  description: string;
}) {
  const response = await githubFetch("https://api.github.com/user/repos", token, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: repoName,
      private: privateRepo,
      description,
      auto_init: true,
    }),
  });

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    if (
      response.status === 422 &&
      getErrorMessage(data, "").toLowerCase().includes("already exists")
    ) {
      return;
    }

    throw new Error(
      getErrorMessage(data, "Could not create GitHub repository.")
    );
  }
}

async function getExistingFileSha({
  token,
  owner,
  repo,
  filePath,
  branch,
}: {
  token: string;
  owner: string;
  repo: string;
  filePath: string;
  branch: string;
}) {
  const response = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeGitHubPath(
      filePath
    )}?ref=${encodeURIComponent(branch)}`,
    token
  );

  if (response.status === 404) return null;

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `Could not check file: ${filePath}`));
  }

  if (Array.isArray(data)) return null;

  if (!isRecord(data)) return null;

  const fileResponse = data as GitHubFileResponse;

  return typeof fileResponse.sha === "string" ? fileResponse.sha : null;
}

async function uploadOrUpdateFile({
  token,
  owner,
  repo,
  branch,
  file,
}: {
  token: string;
  owner: string;
  repo: string;
  branch: string;
  file: WebsiteFile;
}) {
  const filePath = normalizeFilePath(file.path);

  if (!filePath) return;

  const existingSha = await getExistingFileSha({
    token,
    owner,
    repo,
    filePath,
    branch,
  });

  const payload: GitHubContentPayload = {
    message: existingSha
      ? `Update ${filePath} from KORAX Website Builder AI`
      : `Add ${filePath} from KORAX Website Builder AI`,
    content: toBase64(file.content || ""),
    branch,
  };

  if (existingSha) {
    payload.sha = existingSha;
  }

  const response = await githubFetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeGitHubPath(
      filePath
    )}`,
    token,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      getErrorMessage(data, `Could not upload file to GitHub: ${filePath}`)
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("github_access_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: "GitHub is not connected. Connect GitHub first.",
        },
        { status: 401 }
      );
    }

    const body: unknown = await req.json();

    if (!isRecord(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const repoName = cleanRepoName(body.repoName);
    const privateRepo = Boolean(body.privateRepo);
    const description =
      typeof body.description === "string"
        ? body.description
        : "Generated by KORAX Website Builder AI";

    const filesInput = Array.isArray(body.files) ? body.files : [];

    if (!filesInput.length) {
      return NextResponse.json(
        { error: "No generated website files were supplied." },
        { status: 400 }
      );
    }

    const normalizedFiles: WebsiteFile[] = filesInput
      .filter(isWebsiteFile)
      .map((item: WebsiteFile) => ({
        path: normalizeFilePath(item.path),
        content: item.content,
      }))
      .filter((item: WebsiteFile) => item.path.length > 0);

    if (!normalizedFiles.length) {
      return NextResponse.json(
        { error: "No valid files were supplied." },
        { status: 400 }
      );
    }

    const user = await getGithubUser(token);
    const owner = user.login;

    let repo = await getRepo(token, owner, repoName);

    if (!repo) {
      await createRepo({
        token,
        repoName,
        privateRepo,
        description,
      });

      repo = await getRepo(token, owner, repoName);
    }

    if (!repo) {
      throw new Error("Repository could not be created or loaded.");
    }

    const branch = repo.default_branch || "main";

    for (const websiteFile of normalizedFiles) {
      await uploadOrUpdateFile({
        token,
        owner,
        repo: repoName,
        branch,
        file: websiteFile,
      });
    }

    const repoUrl = repo.html_url || `https://github.com/${owner}/${repoName}`;

    return NextResponse.json({
      ok: true,
      owner,
      repoName,
      repoUrl,
      branch,
      filesUploaded: normalizedFiles.length,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "GitHub publish failed.";

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}