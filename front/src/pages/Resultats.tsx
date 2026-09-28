import { Navigate, useLocation } from 'react-router-dom'
import { Bouton } from '../components/Bouton'
import { TableauScore } from '../components/TableauScore'
import { lireEtatResultats } from '../types/navigation'
import styles from './Resultats.module.css'

function commentaire(score: number, total: number): string {
  const pourcentage = total > 0 ? (score / total) * 100 : 0

  if (pourcentage >= 80) return 'Excellent résultat, le sujet est maîtrisé.'
  if (pourcentage >= 50) return 'Bon score. Quelques notions restent à revoir.'
  return 'Le sujet mérite une révision. Une nouvelle partie tire dix autres questions.'
}

export function Resultats() {
  const { state } = useLocation()
  const resultat = lireEtatResultats(state)

  // Arrivée directe sur /resultats : il n'y a pas de score à montrer.
  if (resultat === null) {
    return <Navigate to="/categories" replace />
  }

  return (
    <div className={styles.resultats} data-categorie={resultat.slug}>
      <h1 className={styles.titre}>Quiz terminé</h1>

      <TableauScore score={resultat.score} total={resultat.total} />

      <p className={styles.commentaire}>
        {commentaire(resultat.score, resultat.total)}
      </p>

      <div className={styles.actions}>
        <Bouton to={`/quiz/${resultat.categorieId}`}>Rejouer</Bouton>
        <Bouton to="/categories" variante="secondaire">
          Changer de catégorie
        </Bouton>
      </div>
    </div>
  )
}
