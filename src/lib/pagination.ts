export function totalPages(total: number, limit: number) {
  if (!limit || limit <= 0) return 1;
  return Math.max(1, Math.ceil(total / limit));
}
