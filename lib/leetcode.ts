import "server-only";
import { portfolio } from "@/config/portfolio";
import type { LeetCodeDataErrorCode, LeetCodeProfileData } from "@/lib/leetcode-types";

const providerBase = "https://alfa-leetcode-api.onrender.com";
const cacheSeconds = 900;
const requestTimeoutMs = 8000;

export class LeetCodeProviderError extends Error {
  constructor(
    readonly code: LeetCodeDataErrorCode,
    readonly status: number,
    readonly retryAfterSeconds?: number,
  ) {
    super(code);
    this.name = "LeetCodeProviderError";
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function count(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 ? value : null;
}

function decimal(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : null;
}

function countFrom(record: Record<string, unknown> | null, key: string): number | null {
  return record ? count(record[key]) : null;
}

function decimalFrom(record: Record<string, unknown> | null, key: string): number | null {
  return record ? decimal(record[key]) : null;
}

function attemptsForAll(value: unknown): number | null {
  if (!Array.isArray(value)) return null;
  const all = value.map(asRecord).find((item) => item?.difficulty === "All");
  return countFrom(all ?? null, "submissions");
}

function acceptanceRate(stats: Record<string, unknown> | null): number | null {
  if (!stats) return null;
  const accepted = attemptsForAll(stats.acSubmissionNum);
  const attempted = attemptsForAll(stats.totalSubmissionNum);
  if (accepted === null || attempted === null || attempted === 0 || accepted > attempted) return null;
  return (accepted / attempted) * 100;
}

function submissionCalendar(value: unknown): Record<string, number> | null {
  let parsed = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed) as unknown;
    } catch {
      return null;
    }
  }

  const calendar = asRecord(parsed);
  if (!calendar) return null;

  const entries = Object.entries(calendar).filter(
    ([timestamp, submissions]) =>
      /^\d+$/.test(timestamp) && count(submissions) !== null,
  );
  return Object.fromEntries(entries) as Record<string, number>;
}

async function fetchProviderJson(path: string, signal: AbortSignal): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`${providerBase}${path}`, {
      headers: { Accept: "application/json" },
      signal,
      next: { revalidate: cacheSeconds },
    });
  } catch {
    throw new LeetCodeProviderError("unavailable", 503);
  }

  if (response.status === 404) throw new LeetCodeProviderError("not-found", 404);
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("Retry-After"));
    throw new LeetCodeProviderError(
      "rate-limited",
      429,
      Number.isInteger(retryAfter) && retryAfter > 0 ? retryAfter : 60,
    );
  }
  if (!response.ok) throw new LeetCodeProviderError("unavailable", 503);

  try {
    return await response.json() as unknown;
  } catch {
    throw new LeetCodeProviderError("unavailable", 503);
  }
}

export async function getLeetCodeProfile(): Promise<LeetCodeProfileData> {
  const username = portfolio.leetcode;
  const encodedUsername = encodeURIComponent(username);
  const signal = AbortSignal.timeout(requestTimeoutMs);
  const [statsValue, identityValue, contestValue] = await Promise.all([
    fetchProviderJson(`/${encodedUsername}/profile`, signal),
    fetchProviderJson(`/${encodedUsername}`, signal),
    fetchProviderJson(`/${encodedUsername}/contest`, signal).catch((error: unknown) => {
      if (error instanceof LeetCodeProviderError && error.code !== "rate-limited") return null;
      throw error;
    }),
  ]);

  const stats = asRecord(statsValue);
  const identity = asRecord(identityValue);
  if (!stats || !identity || typeof identity.username !== "string") {
    throw new LeetCodeProviderError("unavailable", 503);
  }
  if (identity.username.toLowerCase() !== username.toLowerCase()) {
    throw new LeetCodeProviderError("not-found", 404);
  }

  const userStats = asRecord(stats.matchedUserStats);
  const contest = asRecord(contestValue);
  const profile = asRecord(identity.profile);
  const profileName =
    typeof identity.name === "string" && identity.name.trim()
      ? identity.name.trim()
      : typeof profile?.realName === "string" && profile.realName.trim()
        ? profile.realName.trim()
        : null;

  return {
    username,
    profileName,
    totalSolved: countFrom(stats, "totalSolved"),
    easySolved: countFrom(stats, "easySolved"),
    mediumSolved: countFrom(stats, "mediumSolved"),
    hardSolved: countFrom(stats, "hardSolved"),
    totalQuestions: countFrom(stats, "totalQuestions"),
    totalEasy: countFrom(stats, "totalEasy"),
    totalMedium: countFrom(stats, "totalMedium"),
    totalHard: countFrom(stats, "totalHard"),
    globalRanking: countFrom(stats, "ranking") ?? countFrom(identity, "ranking"),
    acceptanceRate: acceptanceRate(userStats),
    contestRating: decimalFrom(contest, "contestRating"),
    contestGlobalRanking: countFrom(contest, "contestGlobalRanking"),
    contestTopPercentage: decimalFrom(contest, "contestTopPercentage"),
    contestAttend: countFrom(contest, "contestAttend"),
    submissionCalendar: submissionCalendar(stats.submissionCalendar),
    lastUpdated: new Date().toISOString(),
  };
}
