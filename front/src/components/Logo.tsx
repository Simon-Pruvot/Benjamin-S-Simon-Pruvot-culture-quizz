import styles from './Logo.module.css'

type Props = {
  // Côté du carré, en pixels.
  taille?: number
}

export function Logo({ taille = 58 }: Props) {
  return (
    <img
      src="/logo.png"
      alt="Culture Quiz"
      width={taille}
      height={taille}
      className={styles.logo}
    />
  )
}
