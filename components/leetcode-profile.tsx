"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import type { LeetCodeDataErrorCode, LeetCodeProfileData } from "@/lib/leetcode-types";
import { BrandLogo } from "@/components/brand-logo";

type LeetCodeProfileProps = {
  username: string;
  profileName: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNullableCount(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isInteger(value) && value >= 0);
}

function isNullableDecimal(value: unknown): value is number | null {
  return value === null || (typeof value === "number" && Number.isFinite(value) && value >= 0);
}

function isValidProfile(value: unknown, username: string): value is LeetCodeProfileData {
  if (!isRecord(value) || value.username !== username) return false;
  if (value.profileName !== null && typeof value.profileName !== "string") return false;
  if (typeof value.lastUpdated !== "string" || Number.isNaN(Date.parse(value.lastUpdated))) return false;

  const counts = [
    "totalSolved",
    "easySolved",
    "mediumSolved",
    "hardSolved",
    "totalQuestions",
    "totalEasy",
    "totalMedium",
    "totalHard",
    "globalRanking",
    "contestGlobalRanking",
    "contestAttend",
  ];
  if (!counts.every((key) => isNullableCount(value[key]))) return false;
  if (
    !isNullableDecimal(value.acceptanceRate) ||
    (value.acceptanceRate !== null && value.acceptanceRate > 100) ||
    !isNullableDecimal(value.contestRating) ||
    !isNullableDecimal(value.contestTopPercentage)
  ) {
    return false;
  }

  if (value.submissionCalendar === null) return true;
  if (!isRecord(value.submissionCalendar)) return false;
  return Object.entries(value.submissionCalendar).every(
    ([timestamp, submissions]) =>
      /^\d+$/.test(timestamp) &&
      typeof submissions === "number" &&
      Number.isInteger(submissions) &&
      submissions >= 0,
  );
}

function errorCode(value: unknown, status: number): LeetCodeDataErrorCode {
  if (isRecord(value)) {
    if (value.error === "not-found" || value.error === "rate-limited" || value.error === "unavailable") {
      return value.error;
    }
  }
  return status === 429 ? "rate-limited" : "unavailable";
}

function numberLabel(value: number | null | undefined): string {
  return value === null || value === undefined ? "—" : new Intl.NumberFormat("en-US").format(value);
}

function createHeatmapDays(calendar: Record<string, number>) {
  const dayMs = 24 * 60 * 60 * 1000;
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const earliest = today - 364 * dayMs;
  const firstDay = earliest - new Date(earliest).getUTCDay() * dayMs;
  const totalDays = Math.floor((today - firstDay) / dayMs) + 1;

  return Array.from({ length: totalDays }, (_, index) => {
    const timestamp = firstDay + index * dayMs;
    const date = new Date(timestamp);
    const day = date.toISOString().slice(0, 10);
    const submissions = calendar[String(Math.floor(timestamp / 1000))] ?? 0;
    const level =
      submissions === 0 ? 0 : submissions <= 2 ? 1 : submissions <= 5 ? 2 : submissions <= 10 ? 3 : 4;
    return { day, timestamp, submissions, level };
  });
}

function SubmissionHeatmap({ calendar }: { calendar: Record<string, number> }) {
  const days = createHeatmapDays(calendar);
  const weeks = Math.ceil(days.length / 7);
  const dateFormatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="leetcode-heatmap-scroll" role="region" aria-label="Submission activity over the last year" tabIndex={0}>
      <div className="leetcode-heatmap" style={{ gridTemplateColumns: `repeat(${weeks}, 10px)` }}>
        {days.map((day) => (
          <span
            key={day.day}
            className={`leetcode-heatmap-day level-${day.level}`}
            title={`${dateFormatter.format(new Date(day.timestamp))}: ${day.submissions} submissions`}
            aria-label={`${dateFormatter.format(new Date(day.timestamp))}: ${day.submissions} submissions`}
          />
        ))}
      </div>
    </div>
  );
}

const errorMessages: Record<LeetCodeDataErrorCode, string> = {
  "not-found": "The public LeetCode profile could not be found.",
  "rate-limited": "The public stats service is rate-limiting requests. Please retry when the countdown ends.",
  unavailable: "LeetCode statistics are temporarily unavailable. Your profile link is still available.",
};

export function LeetCodeProfile({ username, profileName }: LeetCodeProfileProps) {
  const [data, setData] = useState<LeetCodeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<LeetCodeDataErrorCode | null>(null);
  const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);
  const profileUrl = `https://leetcode.com/u/${encodeURIComponent(username)}/`;

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/leetcode", { cache: "no-store" });
      const payload: unknown = await response.json();
      if (!response.ok) {
        const code = errorCode(payload, response.status);
        setError(code);
        const retryAfter = Number(response.headers.get("Retry-After"));
        setRetryAfterSeconds(
          code === "rate-limited"
            ? Number.isInteger(retryAfter) && retryAfter > 0
              ? retryAfter
              : 60
            : 0,
        );
        return;
      }
      if (!isValidProfile(payload, username)) {
        setError("unavailable");
        return;
      }
      setData(payload);
      setRetryAfterSeconds(0);
    } catch {
      setError("unavailable");
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (retryAfterSeconds <= 0) return;
    const timer = window.setTimeout(
      () => setRetryAfterSeconds((remaining) => Math.max(0, remaining - 1)),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [retryAfterSeconds]);

  const stats = [
    { label: "Total solved", value: numberLabel(data?.totalSolved), accent: "mint" },
    { label: "Total problems", value: numberLabel(data?.totalQuestions), accent: "lavender" },
    { label: "Easy", value: numberLabel(data?.easySolved), accent: "mint" },
    { label: "Medium", value: numberLabel(data?.mediumSolved), accent: "lavender" },
    { label: "Hard", value: numberLabel(data?.hardSolved), accent: "mint" },
    { label: "Global ranking", value: numberLabel(data?.globalRanking), accent: "lavender" },
    {
      label: "Acceptance rate",
      value: data?.acceptanceRate == null ? "—" : `${data.acceptanceRate.toFixed(2)}%`,
      accent: "mint",
    },
    {
      label: "Contest rating",
      value: data?.contestRating == null ? (data ? "Not rated" : "—") : numberLabel(data.contestRating),
      accent: "lavender",
    },
  ];

  return (
    <div className="leetcode-card">
      <div className="leetcode-profile-header">
        <div className="leetcode-visual" aria-hidden="true">
          <BrandLogo name="LeetCode" className="brand-mark leetcode-brand-mark" />
        </div>
        <div className="leetcode-profile-identity">
          <span className="micro-label">LeetCode profile</span>
          <h3>{data?.profileName || profileName}</h3>
          <p>@{username}</p>
        </div>
        <a className="leetcode-profile-link" href={profileUrl} target="_blank" rel="noreferrer">
          View LeetCode Profile <ArrowUpRight size={16} />
        </a>
      </div>

      {error ? (
        <div className="leetcode-error" role="alert">
          <p>{errorMessages[error]}</p>
          <button
            type="button"
            className="leetcode-retry"
            onClick={() => void loadProfile()}
            disabled={loading || retryAfterSeconds > 0}
          >
            <RefreshCw size={15} />
            {loading ? "Refreshing…" : retryAfterSeconds > 0 ? `Retry in ${retryAfterSeconds}s` : "Retry"}
          </button>
        </div>
      ) : null}
      {loading && !data ? <p className="leetcode-loading" role="status">Loading public LeetCode statistics…</p> : null}

      <div className="leetcode-stats-grid" aria-label="LeetCode statistics">
        {stats.map((stat) => (
          <article className={`leetcode-stat-card stat-${stat.accent}`} key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
            {stat.label === "Contest rating" && data?.contestAttend != null ? (
              <small>{numberLabel(data.contestAttend)} contests attended</small>
            ) : null}
          </article>
        ))}
      </div>

      <div className="leetcode-activity">
        <div className="leetcode-activity-heading">
          <div>
            <h4>Submission activity</h4>
            <p>Daily submissions over the last year</p>
          </div>
          <span className="leetcode-heatmap-legend" aria-hidden="true">
            Less <i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /> More
          </span>
        </div>
        {data?.submissionCalendar ? (
          <SubmissionHeatmap calendar={data.submissionCalendar} />
        ) : (
          <p className="leetcode-calendar-unavailable">
            {loading ? "Loading submission calendar…" : "Submission calendar unavailable."}
          </p>
        )}
      </div>

      <div className="leetcode-profile-footer">
        <span className="leetcode-updated" aria-live="polite">
          {data
            ? `Last updated ${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(data.lastUpdated))}`
            : loading
              ? "Fetching profile data"
              : "Last updated: not yet available"}
          {loading && data ? " · Refreshing…" : ""}
        </span>
        <a href="https://github.com/alfaarghya/alfa-leetcode-api" target="_blank" rel="noreferrer">
          Public stats provider
        </a>
      </div>
    </div>
  );
}
