import { ArrowLeft } from 'lucide-react'
import { Bouton } from '../components/Bouton'
import { CarteCategorie } from '../components/CarteCategorie'
import { Chargement, Erreur } from '../components/EtatApi'
import { useCategories } from '../hooks/useCategories'
import styles from './Categories.module.css'

export function Categories() {
  const { donnees: categories, chargement, erreur, reessayer } = useCategories()

  return (
    <div className={styles.categories}>
      <div className={styles.barre}>
        <Bouton
          to="/"
          variante="discret"
          icone={<ArrowLeft size={15} aria-hidden />}
        >
          Retour
        </Bouton>
      </div>

      <header className={styles.entete}>
        <h1 className={styles.titre}>Choisissez une catégorie</h1>
        <p className={styles.sousTitre}>
          Cinq thèmes, dix questions tirées au hasard à chaque partie.
        </p>
      </header>

      {chargement && <Chargement libelle="Chargement des catégories" />}

      {erreur !== null && <Erreur message={erreur} onReessayer={reessayer} />}

      {categories !== null && (
        <div className={styles.grille}>
          {categories.map((categorie) => (
            <CarteCategorie key={categorie.id} categorie={categorie} />
          ))}
        </div>
      )}
    </div>
  )
}
