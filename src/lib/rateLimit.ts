const requests = new Map<string, { count: number; last: number }>();

export default async function rateLimit(ip: string, limit = 10, windowMs = 60_000) {
  const now = Date.now();
  const record = requests.get(ip) || { count: 0, last: now };

  if (now - record.last > windowMs) {
    record.count = 1;
    record.last = now;
  } else {
    record.count++;
  }

  requests.set(ip, record);

  return {
    success: record.count <= limit,
    remaining: Math.max(0, limit - record.count),
  };
}
