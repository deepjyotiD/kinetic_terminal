import { NextRequest, NextResponse } from "next/server";
import {
  fetchRepoDetails,
  fetchRepoLanguages,
  fetchRepoEvents,
  fetchRepoContributors,
  computeRepoLanguages,
} from "@/lib/github";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ owner: string; repo: string }> }
) {
  try {
    const { owner, repo: repoName } = await params;
    const [repo, langBytes, events, contributors] = await Promise.all([
      fetchRepoDetails(owner, repoName),
      fetchRepoLanguages(owner, repoName),
      fetchRepoEvents(owner, repoName),
      fetchRepoContributors(owner, repoName),
    ]);

    const languages = computeRepoLanguages(langBytes);

    return NextResponse.json({
      repo,
      languages,
      commits: events.slice(0, 10),
      contributors: contributors.slice(0, 15),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch repo";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
