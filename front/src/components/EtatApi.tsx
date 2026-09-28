import { LoaderCircle, Unplug } from 'lucide-react'
import { Bouton } from './Bouton'
import styles from './EtatApi.module.css'

// En gris et non en rouge : le rouge ne dit qu'une chose ici,
// "mauvaise réponse".

export function Chargement({ libelle }: { libelle: string }) {
  return (
    <div className={styles.bloc} role="status" aria-live="polite">
      <LoaderCircle
        size={22}
        className={`${styles.icone} ${styles.rotation}`}
        aria-hidden
      />
      <span className={styles.etiquette}>{libelle}</span>
    </div>
  )
}

type ErreurProps = {
  message: string
  onReessayer: () => void
}

export function Erreur({ message, onReessayer }: ErreurProps) {
  return (
    <div className={styles.bloc} role="alert">
      <Unplug size={22} className={styles.icone} aria-hidden />
      <p className={styles.message}>{message}</p>
      <Bouton variante="secondaire" onClick={onReessayer}>
        Réessayer
      </Bouton>
    </div>
  )
}
