import type { Categorie } from '../types/quiz'
import styles from './PastilleCategorie.module.css'

type Props = {
  categorie: Categorie
}

export function PastilleCategorie({ categorie }: Props) {
  return (
    <span className={styles.pastille} data-categorie={categorie.slug}>
      <span className={styles.carre} aria-hidden />
      <span className={styles.nom}>{categorie.nom}</span>
    </span>
  )
}
