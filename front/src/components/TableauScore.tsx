import styles from './TableauScore.module.css'

type Props = {
  score: number
  total: number
}

export function TableauScore({ score, total }: Props) {
  const pourcentage = total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className={styles.tableau}>
      <span className={styles.score}>
        {score}/{total}
      </span>
      <span className={styles.pourcentage}>
        {pourcentage} % de bonnes réponses
      </span>
    </div>
  )
}
