import { NextRequest, NextResponse } from "next/server";
import {
  fetchUser,
  fetchRepos,
  fetchEvents,
  computeLanguageStats,
  fetchContributions,
} from "@/lib/github";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const [user, repos, events, contributions] = await Promise.all([
      fetchUser(username),
      fetchRepos(username),
      fetchEvents(username),
      fetchContributions(username),
    ]);

    const languages = computeLanguageStats(repos);
    const totalStars = repos.reduce(
      (sum: number, r: { stargazers_count: number }) =>
        sum + r.stargazers_count,
      0
    );
    const totalForks = repos.reduce(
      (sum: number, r: { forks_count: number }) => sum + r.forks_count,
      0
    );

    return NextResponse.json({
      user,
      repos: repos.slice(0, 12),
      languages,
      totalStars,
      totalForks,
      events: events.slice(0, 10),
      contributions,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch profile";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
