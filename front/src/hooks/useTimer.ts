import { useEffect, useRef, useState } from 'react'

// `cle` change à chaque question, `enPause` gèle le décompte.
export function useTimer(
  duree: number,
  cle: number,
  enPause: boolean,
  onExpiration: () => void,
): number {
  const [restant, setRestant] = useState(duree)
  const [cleCourante, setCleCourante] = useState(cle)

  // Remise à zéro pendant le rendu : l'effet ne voit jamais le reliquat
  // de la question précédente.
  if (cle !== cleCourante) {
    setCleCourante(cle)
    setRestant(duree)
  }

  // Garde le callback à jour sans relancer l'intervalle à chaque rendu.
  const expiration = useRef(onExpiration)
  useEffect(() => {
    expiration.current = onExpiration
  })

  useEffect(() => {
    if (enPause) return

    const intervalle = setInterval(() => {
      setRestant((precedent) => (precedent > 0 ? precedent - 1 : 0))
    }, 1000)

    // Sans ce nettoyage, des timers fantômes font sauter des questions.
    return () => clearInterval(intervalle)
  }, [enPause, cleCourante])

  useEffect(() => {
    if (restant === 0 && !enPause) expiration.current()
  }, [restant, enPause])

  return restant
}
