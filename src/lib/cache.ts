import kv from '@vercel/kv'

export async function withCache<T>(
  fn: () => Promise<T>,
  key: string,
): Promise<T> {
  const cached = await kv.get<T>(key)
  if (cached) return cached
  const result = await fn()
  kv.set(key, result)
  return result
}

export async function invalidateCache(key: string): Promise<void> {
  await kv.del(key)
}
