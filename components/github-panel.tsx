"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowUpRight, GitFork, Star } from "lucide-react";
import { portfolio } from "@/config/portfolio";
import { BrandLogo } from "@/components/brand-logo";

type GitHubData = {
  username: string;
  profileUrl: string;
  avatarUrl: string | null;
  publicRepos: number | null;
  followers: number | null;
  repositories: Array<{ name: string; description: string | null; url: string; stars: number; language: string | null }>;
  events: Array<{ type: string; repo: string; createdAt: string }>;
  error?: string;
};

function eventLabel(type: string) {
  return type.replace(/Event$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function GithubPanel() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [failed, setFailed] = useState(false);
  const [chartFailed, setChartFailed] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/github", { headers: { Accept: "application/json" } })
      .then(async (response) => { if (!response.ok) throw new Error("GitHub data is temporarily unavailable"); return response.json() as Promise<GitHubData>; })
      .then((result) => { if (active) setData(result); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, []);
  const profile = data?.profileUrl || portfolio.github;
  const avatarUrl = data?.avatarUrl && !avatarFailed ? data.avatarUrl : null;
  return (
    <div className="github-dashboard">
      <div className="github-topline"><div className="github-profile-id"><span className="github-avatar">{avatarUrl ? <img className="github-avatar-image" src={avatarUrl} alt={`${portfolio.name}'s GitHub profile avatar`} width={48} height={48} loading="lazy" decoding="async" onError={() => setAvatarFailed(true)} /> : <BrandLogo name="GitHub" className="brand-mark github-octocat-mark" />}</span><div><strong>@{portfolio.githubUsername}</strong><span>Public GitHub profile</span></div></div><a href={profile} target="_blank" rel="noreferrer" className="github-open"><BrandLogo name="GitHub" className="brand-mark github-link-brand" />Open GitHub <ArrowUpRight size={15} /></a></div>
      <div className="github-metrics">
        <div className="metric-cell"><span>Public repositories</span><strong>{data?.publicRepos ?? "—"}</strong><small>{failed ? "Live data unavailable" : data ? "From public profile" : "Loading profile…"}</small></div>
        <div className="metric-cell"><span>Followers</span><strong>{data?.followers ?? "—"}</strong><small>{failed ? "See GitHub profile" : data ? "Public profile count" : "Awaiting response"}</small></div>
        <div className="metric-cell"><span>Recent public activity</span><strong>{data?.events.length ?? "—"}</strong><small>Public events returned</small></div>
      </div>
      <div className="github-lower">
        <div className="contribution-card"><div className="contribution-head"><span><Activity size={15} /> Contributions</span><span>Public graph</span></div>{chartFailed ? <div className="chart-fallback"><p>The contribution chart is unavailable right now.</p><a href={portfolio.github} target="_blank" rel="noreferrer">View activity on GitHub <ArrowUpRight size={14} /></a></div> : <img className="contribution-graph" src={`https://ghchart.rshah.org/7656e6/${portfolio.githubUsername}`} alt={`GitHub contribution graph for ${portfolio.githubUsername}`} loading="lazy" onError={() => setChartFailed(true)} />}<p className="chart-disclaimer">Chart loaded from a public contribution-graph service; it is not an official GitHub API field.</p></div>
        <div className="recent-card"><div className="contribution-head"><span><GitFork size={15} /> Recent repositories</span><span>Live</span></div>{failed ? <p className="api-fallback">GitHub data could not be loaded. The profile link remains available.</p> : !data ? <p className="api-fallback">Connecting to the public GitHub API…</p> : data.repositories.length === 0 ? <p className="api-fallback">No public repositories were returned.</p> : <ul className="repo-list">{data.repositories.slice(0, 4).map((repo) => <li key={repo.name}><a href={repo.url} target="_blank" rel="noreferrer"><span className="repo-name">{repo.name}</span><span className="repo-description">{repo.description || "Public repository"}</span></a><span className="repo-stars"><Star size={12} />{repo.stars}</span></li>)}</ul>}
          <div className="event-feed"><div className="event-feed-title">Recent public events</div>{failed ? <p className="api-fallback">Live event feed unavailable.</p> : !data ? <p className="api-fallback">Waiting for public events…</p> : data.events.length === 0 ? <p className="api-fallback">No recent public events were returned by GitHub.</p> : data.events.slice(0, 3).map((event, index) => <div className="event-row" key={`${event.type}-${event.repo}-${event.createdAt}-${index}`}><i /><span>{eventLabel(event.type)}</span><a href={`https://github.com/${event.repo.split("/").map(encodeURIComponent).join("/")}`} target="_blank" rel="noreferrer">{event.repo}</a><time dateTime={event.createdAt}>{event.createdAt.slice(0, 10)}</time></div>)}</div>
        </div>
      </div>
      <div className="github-foot"><span><i /> {failed ? "Live connection unavailable" : data ? "Public data source connected" : "Fetching public data"}</span><span>Data via GitHub public API {data?.error ? `· ${data.error}` : ""}</span></div>
    </div>
  );
}
