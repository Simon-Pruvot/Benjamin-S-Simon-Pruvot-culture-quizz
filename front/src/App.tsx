import { Navigate, Route, Routes } from 'react-router-dom'
import { Accueil } from './pages/Accueil'
import { Categories } from './pages/Categories'
import { Quiz } from './pages/Quiz'
import { Resultats } from './pages/Resultats'
import styles from './App.module.css'

export default function App() {
  return (
    <div className={styles.page}>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/quiz/:categorieId" element={<Quiz />} />
        <Route path="/resultats" element={<Resultats />} />
        {/* URL inconnue : retour à l'accueil. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
