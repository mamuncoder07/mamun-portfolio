import { NextResponse } from "next/server";
import { getLeetCodeProfile, LeetCodeProviderError } from "@/lib/leetcode";

export async function GET() {
  try {
    const profile = await getLeetCodeProfile();
    return NextResponse.json(profile, {
      headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" },
    });
  } catch (error) {
    if (!(error instanceof LeetCodeProviderError)) throw error;

    return NextResponse.json(
      { error: error.code, retryAfterSeconds: error.retryAfterSeconds ?? null },
      {
        status: error.status,
        headers: {
          "Cache-Control": "no-store",
          ...(error.code === "rate-limited" && error.retryAfterSeconds
            ? { "Retry-After": String(error.retryAfterSeconds) }
            : {}),
        },
      },
    );
  }
}
