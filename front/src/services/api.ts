import type { Categorie, Question } from '../types/quiz'

// Seul endroit du projet qui appelle fetch.

const BASE_URL: string = import.meta.env.VITE_API_URL ?? ''

export const QUESTIONS_PAR_PARTIE = 10

export class ApiError extends Error {
  status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function messageErreur(cause: unknown): string {
  if (cause instanceof ApiError) return cause.message
  return "Une erreur inattendue s'est produite."
}

// Le back renvoie { "message": "..." } sur ses erreurs.
async function messageDuServeur(reponse: Response): Promise<string> {
  try {
    const corps: unknown = await reponse.json()
    if (typeof corps === 'object' && corps !== null && 'message' in corps) {
      const message = (corps as { message: unknown }).message
      if (typeof message === 'string' && message !== '') return message
    }
  } catch {
    // Corps vide ou non-JSON.
  }
  return `L'API a répondu ${reponse.status}.`
}

async function requete<T>(chemin: string, signal?: AbortSignal): Promise<T> {
  let reponse: Response

  try {
    reponse = await fetch(`${BASE_URL}${chemin}`, {
      signal,
      headers: { Accept: 'application/json' },
    })
  } catch (cause) {
    // Une annulation n'est pas une panne.
    if (signal?.aborted) throw cause
    throw new ApiError(
      "Impossible de joindre l'API. Vérifie que le serveur Laravel est démarré.",
    )
  }

  if (!reponse.ok) {
    throw new ApiError(await messageDuServeur(reponse), reponse.status)
  }

  return (await reponse.json()) as T
}

export function getCategories(signal?: AbortSignal): Promise<Categorie[]> {
  return requete<Categorie[]>('/categories', signal)
}

export function getQuestions(
  categorieId: number,
  signal?: AbortSignal,
): Promise<Question[]> {
  return requete<Question[]>(
    `/categories/${categorieId}/questions?limit=${QUESTIONS_PAR_PARTIE}`,
    signal,
  )
}
