import { NextResponse } from "next/server";
import rateLimit from "@/lib/rateLimit";
import { getFromCache, setToCache } from "@/lib/cache";

export async function GET(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";

  // Rate limiting
  const limit = await rateLimit(ip);
  if (!limit.success) {
    return NextResponse.json(
      { success: false, message: "Too many requests, try again later." },
      { status: 429 }
    );
  }

  // Caching
  const cacheKey = "categories";
  const cached = await getFromCache(cacheKey);
  if (cached) return NextResponse.json(cached);

  // Mock data (replace with DB/API call)
  const categories = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Finance" }
  ];

  await setToCache(cacheKey, categories, 300);

  return NextResponse.json(categories);
}
