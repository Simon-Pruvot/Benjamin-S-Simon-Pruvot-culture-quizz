import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { BandeauTemps } from '../components/BandeauTemps'
import { Bouton } from '../components/Bouton'
import { CarteQuestion } from '../components/CarteQuestion'
import { Chargement, Erreur } from '../components/EtatApi'
import { PastilleCategorie } from '../components/PastilleCategorie'
import { useCategories } from '../hooks/useCategories'
import { useQuestions } from '../hooks/useQuestions'
import { DUREE_QUESTION, useQuiz } from '../hooks/useQuiz'
import { useTimer } from '../hooks/useTimer'
import type { Categorie, Question } from '../types/quiz'
import styles from './Quiz.module.css'

// Trois composants successifs parce qu'un hook ne peut pas être appelé
// sous condition : chaque étage attend que le précédent soit résolu.
export function Quiz() {
  const { categorieId } = useParams()
  const id = Number(categorieId)

  if (!Number.isInteger(id) || id <= 0) {
    return <Navigate to="/categories" replace />
  }

  return <PreparationPartie categorieId={id} />
}

function PreparationPartie({ categorieId }: { categorieId: number }) {
  const categories = useCategories()
  const questions = useQuestions(categorieId)

  const chargement = categories.chargement || questions.chargement
  // Celle des questions d'abord : elle porte le 404 du back.
  const erreur = questions.erreur ?? categories.erreur

  const reessayer = () => {
    categories.reessayer()
    questions.reessayer()
  }

  const categorie =
    categories.donnees?.find((item) => item.id === categorieId) ?? null

  if (chargement) {
    return (
      <div className={styles.quiz}>
        <Chargement libelle="Préparation de la partie" />
      </div>
    )
  }

  if (erreur !== null) {
    return (
      <div className={styles.quiz}>
        <Erreur message={erreur} onReessayer={reessayer} />
      </div>
    )
  }

  if (categorie === null) {
    return (
      <div className={styles.quiz}>
        <Erreur
          message="Cette catégorie n'existe pas."
          onReessayer={reessayer}
        />
      </div>
    )
  }

  if (questions.donnees === null || questions.donnees.length === 0) {
    return (
      <div className={styles.quiz}>
        <Erreur
          message="Cette catégorie ne contient aucune question."
          onReessayer={reessayer}
        />
      </div>
    )
  }

  return <Partie categorie={categorie} questions={questions.donnees} />
}

type PartieProps = {
  categorie: Categorie
  questions: Question[]
}

function Partie({ categorie, questions }: PartieProps) {
  const navigate = useNavigate()
  const quiz = useQuiz(questions)

  // Le temps est gelé pendant la coloration de la réponse.
  const enPause = quiz.phase === 'revelation'
  const restant = useTimer(DUREE_QUESTION, quiz.index, enPause, quiz.expirer)

  useEffect(() => {
    if (!quiz.termine) return

    // replace : revenir en arrière ne rouvre pas une partie finie.
    navigate('/resultats', {
      replace: true,
      state: {
        score: quiz.score,
        total: quiz.total,
        categorieId: categorie.id,
        slug: categorie.slug,
      },
    })
  }, [
    quiz.termine,
    quiz.score,
    quiz.total,
    categorie.id,
    categorie.slug,
    navigate,
  ])

  return (
    <div className={styles.quiz} data-categorie={categorie.slug}>
      <div className={styles.barre}>
        <Bouton
          to="/categories"
          variante="discret"
          icone={<X size={15} aria-hidden />}
        >
          Quitter
        </Bouton>
        <PastilleCategorie categorie={categorie} />
      </div>

      <BandeauTemps
        restant={restant}
        duree={DUREE_QUESTION}
        index={quiz.index}
        total={quiz.total}
        score={quiz.score}
        enPause={enPause}
      />

      <CarteQuestion
        question={quiz.question}
        phase={quiz.phase}
        choix={quiz.choix}
        onRepondre={quiz.repondre}
      />
    </div>
  )
}
