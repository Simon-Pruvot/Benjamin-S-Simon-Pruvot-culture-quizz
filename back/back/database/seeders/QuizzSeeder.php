<?php

namespace Database\Seeders;

use App\Models\Answer;
use App\Models\Categorie;
use App\Models\Question;
use Illuminate\Database\Seeder;
use RuntimeException;

/**
 * Charge les categories, questions et reponses depuis database/content/*.json.
 *
 * Chaque fichier JSON porte sa categorie ET ses questions : une seule source
 * de verite, relisible a plusieurs, versionnee dans Git.
 *
 * Le seeder est rejouable : il remplace le contenu d'une categorie au lieu
 * d'empiler des doublons.
 */
class QuizzSeeder extends Seeder
{
    /** Nombre de mauvaises reponses attendu par question (10 reponses - 1 bonne). */
    private const MAUVAISES_ATTENDUES = 9;

    public function run()
    {
        $fichiers = glob(database_path('content/*.json'));

        if ($fichiers === false || $fichiers === []) {
            throw new RuntimeException('Aucun fichier de contenu trouve dans database/content/.');
        }

        foreach ($fichiers as $fichier) {
            $this->chargerFichier($fichier);
        }
    }

    private function chargerFichier(string $fichier): void
    {
        $nomCourt = basename($fichier);
        $data = json_decode((string) file_get_contents($fichier), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException("{$nomCourt} : JSON invalide (" . json_last_error_msg() . ').');
        }

        $this->validerFichier($data, $nomCourt);

        $categorie = Categorie::updateOrCreate(
            ['slug' => $data['categorie']['slug']],
            $data['categorie']
        );

        // Rejouable : on repart d'une categorie vide.
        // La cascade en base supprime au passage les reponses des questions effacees.
        $categorie->questions()->delete();

        foreach ($data['questions'] as $q) {
            $question = $categorie->questions()->create(['intitule' => $q['intitule']]);

            $maintenant = now();
            $lignes = [[
                'question_id' => $question->id,
                'libelle'     => $q['bonne'],
                'is_correct'  => true,
                'created_at'  => $maintenant,
                'updated_at'  => $maintenant,
            ]];

            foreach ($q['mauvaises'] as $mauvaise) {
                $lignes[] = [
                    'question_id' => $question->id,
                    'libelle'     => $mauvaise,
                    'is_correct'  => false,
                    'created_at'  => $maintenant,
                    'updated_at'  => $maintenant,
                ];
            }

            // Un seul INSERT pour les 10 reponses plutot que 10 requetes.
            Answer::insert($lignes);
        }

        $total = count($data['questions']);
        $this->command->info("  {$nomCourt} : {$categorie->nom} -> {$total} questions, " . ($total * 10) . ' reponses');
    }

    /**
     * Refuse tout fichier qui casserait le calcul du score.
     */
    private function validerFichier(?array $data, string $nomCourt): void
    {
        foreach (['nom', 'slug'] as $champ) {
            if (empty($data['categorie'][$champ] ?? null)) {
                throw new RuntimeException("{$nomCourt} : categorie.{$champ} manquant.");
            }
        }

        if (! isset($data['questions']) || ! is_array($data['questions'])) {
            throw new RuntimeException("{$nomCourt} : la cle 'questions' doit etre un tableau.");
        }

        $intitulesVus = [];

        foreach ($data['questions'] as $i => $q) {
            $ref = "{$nomCourt}, question #" . ($i + 1);

            if (empty($q['intitule'])) {
                throw new RuntimeException("{$ref} : intitule vide.");
            }

            if (empty($q['bonne'])) {
                throw new RuntimeException("{$ref} : aucune bonne reponse.");
            }

            $mauvaises = $q['mauvaises'] ?? [];
            if (count($mauvaises) !== self::MAUVAISES_ATTENDUES) {
                throw new RuntimeException(
                    "{$ref} : " . count($mauvaises) . ' mauvaises reponses au lieu de ' . self::MAUVAISES_ATTENDUES . '.'
                );
            }

            // Une mauvaise reponse identique a la bonne rendrait la question insoluble.
            $toutes = array_merge([$q['bonne']], $mauvaises);
            if (count(array_unique($toutes)) !== count($toutes)) {
                throw new RuntimeException("{$ref} : deux reponses identiques.");
            }

            if (isset($intitulesVus[$q['intitule']])) {
                throw new RuntimeException("{$ref} : cet intitule est deja utilise dans le fichier.");
            }
            $intitulesVus[$q['intitule']] = true;
        }
    }
}
