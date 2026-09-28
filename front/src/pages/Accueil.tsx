import { Bouton } from '../components/Bouton'
import { Logo } from '../components/Logo'
import styles from './Accueil.module.css'

export function Accueil() {
  return (
    <div className={styles.accueil}>
      <header className={styles.entete}>
        <Logo />
        <h1 className={styles.titre}>Culture Quiz</h1>
        <p className={styles.sousTitre}>
          Dix questions, trente secondes chacune, sur la culture du
          développement web.
        </p>
      </header>

      <div className={styles.action}>
        <Bouton to="/categories">Commencer</Bouton>
      </div>
    </div>
  )
}
