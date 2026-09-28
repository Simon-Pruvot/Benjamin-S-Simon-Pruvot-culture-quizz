import { useCallback } from 'react'
import { getCategories } from '../services/api'
import type { Categorie } from '../types/quiz'
import { useRessource } from './useRessource'
import type { Ressource } from './useRessource'

export function useCategories(): Ressource<Categorie[]> {
  const charger = useCallback((signal: AbortSignal) => getCategories(signal), [])
  return useRessource(charger)
}
