import { useCallback, useEffect, useState } from 'react'
import { messageErreur } from '../services/api'

type Etat<T> = {
  donnees: T | null
  chargement: boolean
  erreur: string | null
}

export type Ressource<T> = Etat<T> & { reessayer: () => void }

// `charger` doit être stable : c'est lui qui déclenche le rechargement.
export function useRessource<T>(
  charger: (signal: AbortSignal) => Promise<T>,
): Ressource<T> {
  const [etat, setEtat] = useState<Etat<T>>({
    donnees: null,
    chargement: true,
    erreur: null,
  })
  const [tentative, setTentative] = useState(0)

  // Retour en chargement pendant le rendu : l'écran n'affiche jamais les
  // données de la requête précédente.
  const [source, setSource] = useState({ charger, tentative })
  if (source.charger !== charger || source.tentative !== tentative) {
    setSource({ charger, tentative })
    setEtat({ donnees: null, chargement: true, erreur: null })
  }

  useEffect(() => {
    const controleur = new AbortController()

    charger(controleur.signal)
      .then((donnees) => {
        if (controleur.signal.aborted) return
        setEtat({ donnees, chargement: false, erreur: null })
      })
      .catch((cause: unknown) => {
        if (controleur.signal.aborted) return
        setEtat({ donnees: null, chargement: false, erreur: messageErreur(cause) })
      })

    return () => controleur.abort()
  }, [charger, tentative])

  const reessayer = useCallback(() => setTentative((n) => n + 1), [])

  return { ...etat, reessayer }
}
