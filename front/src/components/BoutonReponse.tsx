import styles from './BoutonReponse.module.css'

// attente : avant le clic, les quatre boutons sont indiscernables.
// effacee : ni la bonne ni celle qui a été cliquée.
export type EtatReponse = 'attente' | 'correcte' | 'fausse' | 'effacee'

type Props = {
  libelle: string
  lettre: string
  etat: EtatReponse
  onClick: () => void
}

export function BoutonReponse({ libelle, lettre, etat, onClick }: Props) {
  const repondu = etat !== 'attente'

  return (
    <button
      type="button"
      className={`${styles.reponse} ${repondu ? styles[etat] : ''}`}
      onClick={onClick}
      disabled={repondu}
    >
      <span className={styles.badge}>{lettre}</span>
      <span className={styles.libelle}>{libelle}</span>
    </button>
  )
}
