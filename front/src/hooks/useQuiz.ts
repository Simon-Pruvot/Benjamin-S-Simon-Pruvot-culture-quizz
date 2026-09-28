import { useEffect, useState } from 'react'
import type { Question } from '../types/quiz'

export const DELAI_REVELATION = 1500
export const DUREE_QUESTION = 30

// reponse : on peut cliquer, le timer tourne.
// revelation : boutons figés, timer en pause, bonne réponse colorée.
export type PhaseQuiz = 'reponse' | 'revelation'

export type Quiz = {
  question: Question
  index: number
  total: number
  score: number
  phase: PhaseQuiz
  // null si le temps s'est écoulé sans réponse.
  choix: number | null
  termine: boolean
  repondre: (propositionId: number) => void
  expirer: () => void
}

export function useQuiz(questions: Question[]): Quiz {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [choix, setChoix] = useState<number | null>(null)
  const [phase, setPhase] = useState<PhaseQuiz>('reponse')
  const [termine, setTermine] = useState(false)

  // Nouveau jeu de questions : on repart de zéro dès le rendu.
  const [source, setSource] = useState(questions)
  if (questions !== source) {
    setSource(questions)
    setIndex(0)
    setScore(0)
    setChoix(null)
    setPhase('reponse')
    setTermine(false)
  }

  const question = questions[index]

  useEffect(() => {
    if (phase !== 'revelation') return

    const dernier = index >= questions.length - 1
    const attente = setTimeout(() => {
      if (dernier) {
        setTermine(true)
        return
      }
      setIndex(index + 1)
      setChoix(null)
      setPhase('reponse')
    }, DELAI_REVELATION)

    return () => clearTimeout(attente)
  }, [phase, index, questions.length])

  const repondre = (propositionId: number) => {
    // Un double événement ne doit pas compter deux points.
    if (phase !== 'reponse') return

    const bonne = question.propositions.find((proposition) => proposition.isCorrect)
    if (bonne !== undefined && bonne.id === propositionId) {
      setScore((precedent) => precedent + 1)
    }

    setChoix(propositionId)
    setPhase('revelation')
  }

  const expirer = () => {
    if (phase !== 'reponse') return
    setChoix(null)
    setPhase('revelation')
  }

  return {
    question,
    index,
    total: questions.length,
    score,
    phase,
    choix,
    termine,
    repondre,
    expirer,
  }
}
