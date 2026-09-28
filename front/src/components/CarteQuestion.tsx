import type { PhaseQuiz } from '../hooks/useQuiz'
import type { Proposition, Question } from '../types/quiz'
import { Banniere } from './Banniere'
import type { TonBanniere } from './Banniere'
import { BoutonReponse } from './BoutonReponse'
import type { EtatReponse } from './BoutonReponse'
import styles from './CarteQuestion.module.css'

const LETTRES = ['A', 'B', 'C', 'D']

type Props = {
  question: Question
  phase: PhaseQuiz
  choix: number | null
  onRepondre: (propositionId: number) => void
}

// En phase "reponse", `isCorrect` n'est pas lu : la bonne réponse n'est donc
// pas lisible dans l'inspecteur avant le clic.
function etatDe(
  proposition: Proposition,
  phase: PhaseQuiz,
  choix: number | null,
): EtatReponse {
  if (phase === 'reponse') return 'attente'
  if (proposition.isCorrect) return 'correcte'
  if (proposition.id === choix) return 'fausse'
  return 'effacee'
}

function verdict(
  question: Question,
  choix: number | null,
): { ton: TonBanniere; texte: string } {
  const bonne = question.propositions.find((p) => p.isCorrect)
  const libelleBonne = bonne?.libelle ?? ''

  if (choix === null) {
    return {
      ton: 'tempsEcoule',
      texte: `Temps écoulé. La bonne réponse était : ${libelleBonne}`,
    }
  }

  if (bonne !== undefined && bonne.id === choix) {
    return { ton: 'juste', texte: 'Bonne réponse.' }
  }

  return {
    ton: 'fausse',
    texte: `Mauvaise réponse. La bonne réponse était : ${libelleBonne}`,
  }
}

export function CarteQuestion({ question, phase, choix, onRepondre }: Props) {
  const revelation = phase === 'revelation'
  const message = revelation ? verdict(question, choix) : null

  return (
    <div className={styles.carte}>
      <h2 className={styles.intitule}>{question.intitule}</h2>

      <div className={styles.propositions}>
        {question.propositions.map((proposition, rang) => (
          <BoutonReponse
            key={proposition.id}
            libelle={proposition.libelle}
            lettre={LETTRES[rang] ?? '?'}
            etat={etatDe(proposition, phase, choix)}
            onClick={() => onRepondre(proposition.id)}
          />
        ))}
      </div>

      {message !== null && (
        <Banniere ton={message.ton}>{message.texte}</Banniere>
      )}
    </div>
  )
}
