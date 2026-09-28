# Culture Quiz — API

API REST du projet **Culture Quiz**. Elle fournit au front React les catégories,
les questions et les propositions de réponses.

> Pour l'installation pas à pas depuis une machine neuve, voir
> [`../../explication.md`](../../explication.md). Ce README est la **référence de l'API**.

---

## Stack

| | |
|---|---|
| Framework | Laravel 8.83 |
| PHP | 8.1 (⚠️ pas 8.3+, Laravel 8 déprécie) |
| Base de données | MySQL, moteur **InnoDB** |
| Serveur local | WampServer 3.3.7 |

---

## Démarrer

```bash
php artisan migrate      # crée les 3 tables
php artisan db:seed      # charge les 75 questions depuis database/content/*.json
php artisan serve        # API sur http://127.0.0.1:8000
```

Pour repartir d'une base propre : `php artisan migrate:fresh --seed`.

Configuration dans `.env` — base `culturequizz`, utilisateur `root`, **mot de passe vide**
(compte root par défaut de Wamp).

---

## Endpoints

L'API est en **lecture seule**. Aucune route d'écriture n'est exposée : le contenu se
modifie via les fichiers JSON et le seeder.

### `GET /api/categories`

Les 5 catégories du quiz.

```json
[
  { "id": 1, "nom": "React",      "slug": "react",      "icone": "Atom",       "couleur": "#61DAFB" },
  { "id": 2, "nom": "Responsive", "slug": "responsive", "icone": "Smartphone", "couleur": "#8B5CF6" },
  { "id": 3, "nom": "TypeScript", "slug": "typescript", "icone": "Braces",     "couleur": "#3178C6" },
  { "id": 4, "nom": "UI",         "slug": "ui",         "icone": "Palette",    "couleur": "#EC4899" },
  { "id": 5, "nom": "UX",         "slug": "ux",         "icone": "Compass",    "couleur": "#F59E0B" }
]
```

⚠️ Les `id` sont attribués au remplissage de la base, dans l'ordre alphabétique des
fichiers de `database/content/`. Ils **changent après un `migrate:fresh`**. Le front ne
doit jamais en écrire un en dur : il lit cet endpoint et utilise les `id` renvoyés.
Pour un identifiant stable, utiliser `slug`.

- `icone` est un **nom de composant `lucide-react`**, jamais un emoji. Le front le mappe
  vers le composant correspondant.
- `couleur` alimente la charte graphique. Le vert et le rouge sont volontairement exclus :
  le sujet les réserve à la coloration bonne / mauvaise réponse.

### `GET /api/categories/{id}/questions?limit=10`

Questions tirées au hasard dans une catégorie, avec **4 propositions mélangées dont la bonne**.

| Paramètre | Défaut | Notes |
|---|---|---|
| `limit` | `10` | Borné entre 1 et 50 |

```json
[
  {
    "id": 2,
    "intitule": "Quel hook permet d'exécuter un effet de bord après le rendu d'un composant ?",
    "propositions": [
      { "id": 11, "libelle": "useEffect",  "isCorrect": true  },
      { "id": 12, "libelle": "useState",   "isCorrect": false },
      { "id": 17, "libelle": "useReducer", "isCorrect": false },
      { "id": 18, "libelle": "useId",      "isCorrect": false }
    ]
  }
]
```

**Catégorie inexistante** → `404` :

```json
{ "message": "Categorie 999 introuvable." }
```

---

## Deux choix de conception

### Le tirage se fait côté serveur

L'API sélectionne 10 questions au hasard puis, pour chacune, garde la bonne réponse et
tire 3 mauvaises parmi les 9 avant de mélanger les 4. Le front n'a aucune logique de
sélection à implémenter, et la règle métier vit côté serveur.

La position de la bonne réponse a été mesurée sur 180 tirages : 22,8 % / 25 % / 26,1 % /
26,1 %. La distribution est uniforme — un joueur ne peut pas deviner en cliquant toujours
au même endroit.

### `isCorrect` est envoyé au front

La coloration vert/rouge doit être **instantanée**. Un aller-retour réseau au milieu d'un
timer de 30 secondes serait un risque inutile.

**Contrepartie assumée** : la bonne réponse est visible dans l'onglet Réseau du navigateur.
L'évolution possible serait un `POST /api/answers/check` validé côté serveur, au prix de
la latence.

---

## Schéma de base

```
categories   id · nom · slug · icone · couleur · timestamps
questions    id · category_id ──> categories.id · intitule · timestamps
answers      id · question_id ──> questions.id · libelle · is_correct · timestamps
```

Contenu : **5 catégories · 75 questions · 750 réponses** (15 questions par catégorie,
10 réponses par question dont exactement 1 correcte).

### Le moteur InnoDB est imposé explicitement

`config/database.php` force `'engine' => 'InnoDB'`.

C'est indispensable : WampServer configure MySQL avec `default_storage_engine=MyISAM`, et
**MyISAM accepte la syntaxe des clés étrangères mais les ignore en silence**. Sans ce
réglage, les tables se créeraient sans erreur et sans aucune relation réelle — les
suppressions en cascade et l'intégrité référentielle ne fonctionneraient pas.

Le réglage est côté projet plutôt que dans le `my.ini` de Wamp : il part dans Git, toute
l'équipe en hérite, et les autres bases locales ne sont pas affectées.

---

## Ajouter ou modifier des questions

Le contenu vit dans `database/content/`, un fichier JSON par catégorie :

```json
{
  "categorie": { "nom": "React", "slug": "react", "icone": "Atom", "couleur": "#61DAFB" },
  "questions": [
    {
      "intitule": "Quel hook permet de déclarer une variable d'état local ?",
      "bonne": "useState",
      "mauvaises": ["useEffect", "useContext", "useReducer", "useRef", "useMemo",
                    "useCallback", "useLayoutEffect", "useImperativeHandle", "useDeferredValue"]
    }
  ]
}
```

Puis `php artisan db:seed`.

Le format `bonne` + 9 `mauvaises` rend la règle « exactement 1 bonne réponse sur 10 »
structurellement impossible à violer.

**Ne jamais saisir directement dans phpMyAdmin** : le travail ne partirait pas dans Git et
serait perdu au prochain `migrate:fresh`.

**Règle de rédaction** : les 9 mauvaises réponses doivent être *plausibles et homogènes*.
Comme l'API n'en tire que 3 au hasard, une seule mauvaise réponse absurde suffit à rendre
certains tirages triviaux.

### Le seeder valide avant d'écrire

`QuizzSeeder` refuse tout fichier qui casserait le calcul du score, avec un message précis :

```
react.json, question #3 : 3 mauvaises reponses au lieu de 9.
```

Il détecte : JSON invalide, catégorie incomplète, intitulé vide, bonne réponse absente,
nombre de mauvaises réponses incorrect, deux réponses identiques dans une même question,
intitulé dupliqué.

La validation tourne **avant** toute écriture, donc un fichier cassé ne laisse rien
d'incohérent en base. Le seeder est aussi **rejouable** : il vide la catégorie avant de la
recharger, donc aucun doublon même après dix exécutions.

---

## Structure

```
app/
├── Http/Controllers/QuizzApiController.php   les 2 endpoints
└── Models/
    ├── Categorie.php                         hasMany questions
    ├── Question.php                          belongsTo categorie, hasMany answers
    └── Answer.php                            belongsTo question, cast is_correct en booléen
database/
├── content/*.json                            les 75 questions (source de vérité)
├── migrations/                               le schéma des 3 tables
└── seeders/QuizzSeeder.php                   chargement + validation
routes/api.php                                les 2 routes
config/database.php                           'engine' => 'InnoDB'
```

> `Answer` caste `is_correct` en booléen. Sans ce cast, l'API renverrait `"isCorrect": 1`
> au lieu de `true`, et le typage TypeScript côté front serait faux.

---

## CORS

Configuré dans `config/cors.php` : `'paths' => ['api/*']`, `'allowed_origins' => ['*']`.
Le middleware `HandleCors` est actif. Le front Vite (`http://localhost:5173`) peut appeler
l'API sans configuration supplémentaire.

---

## Export de la base pour le rendu

```bash
mysqldump -u root culturequizz > ../../database/culturequizz.sql
```

⚠️ **Avec les données**, pas seulement la structure — le dump d'origine
(`culturequizz.sql`) ne contenait aucune ligne.

---

## Commandes utiles

```bash
php artisan migrate:fresh --seed   # table rase + rechargement complet
php artisan route:list             # liste les routes déclarées
php artisan config:clear           # après toute modification de config/ ou .env
```
