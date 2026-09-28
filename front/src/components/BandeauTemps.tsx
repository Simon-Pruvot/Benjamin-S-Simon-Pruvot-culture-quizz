import { Timer } from './Timer'
import styles from './BandeauTemps.module.css'

type Props = {
  restant: number
  duree: number
  index: number
  total: number
  score: number
  enPause: boolean
}

// "03 / 10" reste aligné avec "10 / 10".
function pad(valeur: number): string {
  return String(valeur).padStart(2, '0')
}

export function BandeauTemps({
  restant,
  duree,
  index,
  total,
  score,
  enPause,
}: Props) {
  return (
    <div className={styles.bandeau}>
      <Timer restant={restant} duree={duree} cle={index} enPause={enPause} />
      <div className={styles.libelles}>
        <span className={styles.avancement}>
          Question {pad(index + 1)} / {pad(total)}
        </span>
        <span className={styles.score}>Score : {score}</span>
      </div>
    </div>
  )
}
