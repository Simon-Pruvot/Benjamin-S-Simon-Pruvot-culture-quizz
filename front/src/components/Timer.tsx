import styles from './Timer.module.css'

const RAYON = 26
const EPAISSEUR = 6
const COTE = 62
const CIRCONFERENCE = 2 * Math.PI * RAYON

// En dessous, l'anneau se met à battre.
const SEUIL_URGENCE = 6

type Props = {
  restant: number
  duree: number
  // Change à chaque question : remonte l'anneau sans animation retour.
  cle: number
  enPause: boolean
}

export function Timer({ restant, duree, cle, enPause }: Props) {
  const fraction = Math.max(0, Math.min(1, restant / duree))
  const urgence = restant <= SEUIL_URGENCE && !enPause

  return (
    <div
      className={`${styles.timer} ${urgence ? styles.urgence : ''}`}
      role="timer"
      aria-label={`${restant} secondes restantes`}
    >
      <svg className={styles.anneau} viewBox={`0 0 ${COTE} ${COTE}`} aria-hidden>
        <circle
          className={styles.piste}
          cx={COTE / 2}
          cy={COTE / 2}
          r={RAYON}
          fill="none"
          strokeWidth={EPAISSEUR}
        />
        <circle
          key={cle}
          className={styles.progression}
          cx={COTE / 2}
          cy={COTE / 2}
          r={RAYON}
          fill="none"
          strokeWidth={EPAISSEUR}
          strokeLinecap="round"
          strokeDasharray={CIRCONFERENCE}
          strokeDashoffset={CIRCONFERENCE * (1 - fraction)}
        />
      </svg>
      <span className={styles.secondes}>
        {String(restant).padStart(2, '0')}
      </span>
    </div>
  )
}
