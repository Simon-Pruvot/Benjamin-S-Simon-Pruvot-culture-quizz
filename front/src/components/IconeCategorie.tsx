import { Atom, Braces, Compass, HelpCircle, Palette, Smartphone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// Table explicite : un `import * as icons` embarquerait toute la
// bibliothèque dans le bundle et ne serait pas typé.
const ICONES: Record<string, LucideIcon> = {
  Atom,
  Braces,
  Compass,
  Palette,
  Smartphone,
}

const PAR_DEFAUT: LucideIcon = HelpCircle

type Props = {
  nom: string
  size?: number
  strokeWidth?: number
  className?: string
}

export function IconeCategorie({ nom, size = 24, strokeWidth = 2, className }: Props) {
  const Icone = ICONES[nom] ?? PAR_DEFAUT
  return (
    <Icone size={size} strokeWidth={strokeWidth} className={className} aria-hidden />
  )
}
