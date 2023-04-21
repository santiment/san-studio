export function normalizeIds<T>(ids: (null | undefined | T)[]) {
  return ids.filter((id) => id !== null && id !== undefined) as T[]
}
