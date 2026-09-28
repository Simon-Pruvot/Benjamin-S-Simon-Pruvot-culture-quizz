import { Link } from 'react-router-dom'
import { accrocheDe } from '../content/accroches'
import type { Categorie } from '../types/quiz'
import { IconeCategorie } from './IconeCategorie'
import styles from './CarteCategorie.module.css'

type Props = {
  categorie: Categorie
}

export function CarteCategorie({ categorie }: Props) {
  const accroche = accrocheDe(categorie.slug)

  return (
    // data-categorie décide des couleurs, cf. theme.css.
    <Link
      to={`/quiz/${categorie.id}`}
      className={styles.carte}
      data-categorie={categorie.slug}
    >
      <span className={styles.pastille}>
        <IconeCategorie nom={categorie.icone} size={15} strokeWidth={2.25} />
      </span>
      <span className={styles.nom}>{categorie.nom}</span>
      {accroche !== null && <span className={styles.accroche}>{accroche}</span>}
    </Link>
  )
}
