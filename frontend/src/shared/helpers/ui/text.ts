
export function formatCreatedAt(createdAt?: string | null) {
  if (!createdAt) return "—";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return createdAt;
  return d.toLocaleString();
}

export function initials(name: string) {
  const t = (name || "Anonymous").trim();
  if (!t) return "A";
  return t[0].toUpperCase();
}
