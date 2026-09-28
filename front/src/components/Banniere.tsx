import styles from './Banniere.module.css'

export type TonBanniere = 'juste' | 'fausse' | 'tempsEcoule'

type Props = {
  ton: TonBanniere
  children: string
}

export function Banniere({ ton, children }: Props) {
  return (
    <p className={`${styles.banniere} ${styles[ton]}`} role="status">
      {children}
    </p>
  )
}
