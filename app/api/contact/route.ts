import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(3).max(140),
  message: z.string().trim().min(10).max(4000),
  website: z.string().max(0).optional(),
});
const attempts = new Map<string, { count: number; expires: number }>();
function limited(request: NextRequest) {
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires < now) attempts.delete(key);
  const address = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() || "unknown";
  const key = createHash("sha256").update(address).digest("hex");
  const entry = attempts.get(key);
  if (entry && entry.expires > now && entry.count >= 5) return true;
  attempts.set(key, entry && entry.expires > now ? { ...entry, count: entry.count + 1 } : { count: 1, expires: now + 10 * 60 * 1000 });
  return false;
}

export async function POST(request: NextRequest) {
  if (limited(request)) return NextResponse.json({ message: "Too many messages were submitted. Please wait a while before trying again." }, { status: 429 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ message: "Please submit a valid message." }, { status: 400 }); }
  const parsed = schema.safeParse(input);
  if (!parsed.success) return NextResponse.json({ message: "Please check each field and try again." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ message: "Please submit a valid message." }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !recipient || !sender) {
    return NextResponse.json({ message: "Message delivery is not configured yet. Please use the GitHub profile link or try again later." }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: parsed.data.email,
        subject: `Portfolio contact: ${parsed.data.subject}`,
        text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nSubject: ${parsed.data.subject}\n\n${parsed.data.message}`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return NextResponse.json({ message: "The delivery service could not accept the message. Please try again later." }, { status: 502 });
    return NextResponse.json({ message: "Your message was sent successfully. Thank you for reaching out." });
  } catch {
    return NextResponse.json({ message: "The delivery service is temporarily unavailable. Please try again later." }, { status: 502 });
  }
}
