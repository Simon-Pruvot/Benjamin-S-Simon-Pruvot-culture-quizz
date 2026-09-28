// L'API ne renvoie pas ces textes. Indexés sur le slug, pas sur l'id.
const ACCROCHES: Record<string, string> = {
  ui: 'Interfaces, couleur, typographie',
  ux: 'Recherche, parcours, utilisabilité',
  responsive: 'Grilles, points de rupture, mobile',
  react: 'Composants, hooks, état',
  typescript: 'Types, interfaces, génériques',
}

export function accrocheDe(slug: string): string | null {
  return ACCROCHES[slug] ?? null
}
