const cache = new Map<string, { value: any; expires: number }>();

export async function getFromCache(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

export async function setToCache(key: string, value: any, ttl: number) {
  cache.set(key, { value, expires: Date.now() + ttl * 1000 });
}
