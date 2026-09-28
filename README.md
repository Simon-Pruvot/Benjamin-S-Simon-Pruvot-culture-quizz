# Culture Quiz

Application de quiz mobile first : on choisit une catégorie, puis on répond à 10 questions
chronométrées (30 s chacune, 4 propositions). Le score s'affiche à la fin.

**Stack :** React + TypeScript (Vite) · API Laravel 8 · MySQL

## Prérequis

- [WampServer](https://www.wampserver.com/) avec **PHP 8.1** et MySQL
- [Composer](https://getcomposer.org/download/)
- [Node.js](https://nodejs.org/) 22.12+

> **Wamp n'ajoute pas `php` au PATH de Windows.** Les commandes ci-dessous (PowerShell)
> appellent donc PHP par son chemin complet. Adapter ce chemin à votre installation
> (dossier `wamp64\bin\php\`).

## Lancer le projet

Démarrer **Wamp** et attendre que l'icône soit verte, puis :

**Terminal 1 : l'API**

```powershell
cd back/back
& "C:\Users\<utilisateur>\wamp64\bin\php\php8.1.31\php.exe" artisan serve
```

Vérification : http://127.0.0.1:8000/api/categories doit renvoyer les 5 catégories.

**Terminal 2 : le front**

```powershell
cd front
npm run dev
```

Ouvrir **http://localhost:5173**.

## Première installation (une seule fois, après un clone)

**1. Créer la base de données**, au choix :

- **Import de l'export (le plus simple) :** dans phpMyAdmin (http://localhost/phpmyadmin,
  `root` sans mot de passe), onglet *Importer*, choisir `back/back/culturequizz.sql`.
  La base `culturequizz` est créée avec toutes les questions.
- **Avec Laravel :** créer une base vide `culturequizz` (`utf8mb4_unicode_ci`), puis lancer
  `artisan migrate --seed` après l'étape 2.

**2. Installer le back** (dans `back/back/`) :

```powershell
composer install
copy .env.example .env      # puis mettre DB_DATABASE=culturequizz dans .env
& "C:\Users\<utilisateur>\wamp64\bin\php\php8.1.31\php.exe" artisan key:generate
```

**3. Installer le front** (dans `front/`) :

```powershell
npm install
copy .env.example .env
```

## API

| Méthode | Endpoint | Renvoie |
|---|---|---|
| GET | `/api/categories` | La liste des catégories |
| GET | `/api/categories/{id}/questions` | 10 questions tirées au hasard, avec 4 propositions mélangées (dont la bonne) |

## Base de données

- `back/back/culturequizz.sql` : export complet de la base (structure et données).
- Les questions sont écrites dans `back/back/database/content/*.json` et chargées en base
  par le seeder (`artisan db:seed`). Pour modifier une question, on édite le JSON, on
  relance le seeder, puis on régénère l'export :
  `mysqldump -u root --databases culturequizz > culturequizz.sql`
  (`mysqldump.exe` se trouve dans `wamp64\bin\mysql\mysql<version>\bin\`, ou utiliser
  phpMyAdmin → *Exporter*).

## Équipe

| Membre | Rôle |
|---|---|
| Benjamin Serrure | Back : base MySQL, seeder, API Laravel, export de la base |
| Simon Pruvot | Front : charte graphique, pages et composants React, mobile first |
