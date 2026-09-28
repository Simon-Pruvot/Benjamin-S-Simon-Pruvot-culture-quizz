// Types calqués sur le contrat de l'API (back/back/routes/api.php).

export type Categorie = {
  id: number
  nom: string
  // Stable, contrairement à l'id qui change si la base est reconstruite.
  slug: string
  // Nom d'une icône Lucide, ex. "Compass".
  icone: string
  couleur: string
}

export type Proposition = {
  id: number
  libelle: string
  // camelCase côté API.
  isCorrect: boolean
}

export type Question = {
  id: number
  intitule: string
  // Déjà mélangées par le serveur.
  propositions: Proposition[]
}
