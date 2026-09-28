// Passé par l'état de navigation plutôt que par l'URL : un score n'a pas
// à être modifiable dans la barre d'adresse.
export type EtatResultats = {
  score: number
  total: number
  categorieId: number
  slug: string
}

// L'état vient de l'historique du navigateur : on le valide avant usage.
export function lireEtatResultats(state: unknown): EtatResultats | null {
  if (typeof state !== 'object' || state === null) return null

  const brut = state as Partial<Record<keyof EtatResultats, unknown>>

  if (
    typeof brut.score !== 'number' ||
    typeof brut.total !== 'number' ||
    typeof brut.categorieId !== 'number' ||
    typeof brut.slug !== 'string'
  ) {
    return null
  }

  return {
    score: brut.score,
    total: brut.total,
    categorieId: brut.categorieId,
    slug: brut.slug,
  }
}
