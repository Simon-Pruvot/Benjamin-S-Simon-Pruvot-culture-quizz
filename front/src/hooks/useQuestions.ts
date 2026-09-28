import { useCallback } from 'react'
import { getQuestions } from '../services/api'
import type { Question } from '../types/quiz'
import { useRessource } from './useRessource'
import type { Ressource } from './useRessource'

// `reessayer` retire un nouveau jeu de questions : c'est ce qui fait "Rejouer".
export function useQuestions(categorieId: number): Ressource<Question[]> {
  const charger = useCallback(
    (signal: AbortSignal) => getQuestions(categorieId, signal),
    [categorieId],
  )
  return useRessource(charger)
}
