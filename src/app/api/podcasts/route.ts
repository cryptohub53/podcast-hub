import { NextResponse } from "next/server";
import rateLimit from "@/lib/rateLimit";
import { getFromCache, setToCache } from "@/lib/cache";

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // Rate limit check
  const limit = await rateLimit(ip);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, message: "Too many requests, try again later." },
      { status: 429 }
    );
  }

  // Check cache
  const cacheKey = "podcasts";
  const cached = await getFromCache(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  // Fake DB fetch
  const podcasts = [
    { id: 1, title: "Tech Talks" },
    { id: 2, title: "Crypto News" }
  ];

  // Save to cache for 5 mins
  await setToCache(cacheKey, podcasts, 300);

  return NextResponse.json(podcasts);
}
