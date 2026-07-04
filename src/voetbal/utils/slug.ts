/** Zet een winnaarsnaam om naar een URL-veilige slug en terug. */
export function entityToSlug(name: string): string {
  return encodeURIComponent(name);
}

export function slugToEntity(slug: string): string {
  return decodeURIComponent(slug);
}
