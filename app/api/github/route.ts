import { NextResponse } from "next/server";
import { portfolio } from "@/config/portfolio";

export const revalidate = 3600;
const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "mamun-reja-portfolio" };

export async function GET() {
  const base = "https://api.github.com";
  try {
    const [profileResponse, reposResponse, eventsResponse] = await Promise.all([
      fetch(`${base}/users/${portfolio.githubUsername}`, { headers, next: { revalidate: 3600 } }),
      fetch(`${base}/users/${portfolio.githubUsername}/repos?per_page=100&sort=updated`, { headers, next: { revalidate: 3600 } }),
      fetch(`${base}/users/${portfolio.githubUsername}/events/public?per_page=5`, { headers, next: { revalidate: 3600 } }),
    ]);
    if (!profileResponse.ok) return NextResponse.json({ error: profileResponse.status === 403 || profileResponse.status === 429 ? "rate-limited" : "unavailable" }, { status: 503, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
    const profile = await profileResponse.json() as { public_repos?: number; followers?: number; html_url?: string; avatar_url?: string };
    const repos = reposResponse.ok ? await reposResponse.json() as Array<{ name: string; description: string | null; html_url: string; stargazers_count: number; language: string | null; fork: boolean }> : [];
    const events = eventsResponse.ok ? await eventsResponse.json() as Array<{ type?: string; repo?: { name?: string }; created_at?: string }> : [];
    const body = {
      username: portfolio.githubUsername,
      profileUrl: profile.html_url || portfolio.github,
      avatarUrl: typeof profile.avatar_url === "string" ? profile.avatar_url : null,
      publicRepos: typeof profile.public_repos === "number" ? profile.public_repos : null,
      followers: typeof profile.followers === "number" ? profile.followers : null,
      repositories: repos.filter((repo) => !repo.fork).map((repo) => ({ name: repo.name, description: repo.description, url: repo.html_url, stars: repo.stargazers_count, language: repo.language })),
      events: events.filter((event) => event.repo?.name).map((event) => ({ type: event.type || "PublicEvent", repo: event.repo?.name || "", createdAt: event.created_at || "" })),
      partial: !reposResponse.ok || !eventsResponse.ok,
    };
    return NextResponse.json(body, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
  }
}
