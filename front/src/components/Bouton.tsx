import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styles from './Bouton.module.css'

export type VarianteBouton = 'principal' | 'secondaire' | 'discret'

type Props = {
  children: ReactNode
  variante?: VarianteBouton
  // Renseigné : le bouton devient un lien.
  to?: string
  onClick?: () => void
  icone?: ReactNode
}

export function Bouton({
  children,
  variante = 'principal',
  to,
  onClick,
  icone,
}: Props) {
  const classe = `${styles.bouton} ${styles[variante]}`
  const contenu = (
    <>
      {icone}
      <span>{children}</span>
    </>
  )

  // Naviguer est un lien, agir est un bouton.
  if (to !== undefined) {
    return (
      <Link to={to} className={classe} onClick={onClick}>
        {contenu}
      </Link>
    )
  }

  return (
    <button type="button" className={classe} onClick={onClick}>
      {contenu}
    </button>
  )
}
