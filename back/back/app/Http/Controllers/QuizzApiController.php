<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Categorie;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * Les deux seuls endpoints dont le front a besoin.
 * L'application ne fait que lire : aucune route d'ecriture n'est exposee.
 */
class QuizzApiController extends Controller
{
    /** Propositions affichees au joueur, tirees parmi les 10 stockees en base. */
    private const PROPOSITIONS_AFFICHEES = 4;

    /** Nombre de questions d'une partie, si le front ne precise rien. */
    private const QUESTIONS_PAR_PARTIE = 10;

    /** Garde-fou pour empecher un ?limit=100000 de faire tomber l'API. */
    private const LIMITE_MAX = 50;

    /**
     * GET /api/categories
     *
     * On selectionne les colonnes explicitement : created_at et updated_at
     * n'interessent pas le front et alourdiraient la reponse pour rien.
     */
    public function categories(): JsonResponse
    {
        return response()->json(
            Categorie::orderBy('id')->get(['id', 'nom', 'slug', 'icone', 'couleur'])
        );
    }

    /**
     * GET /api/categories/{id}/questions?limit=10
     *
     * Renvoie des questions tirees au hasard, chacune avec 4 propositions
     * melangees dont la bonne.
     */
    public function questions(Request $request, int $id): JsonResponse
    {
        $categorie = Categorie::find($id);

        if ($categorie === null) {
            return response()->json(
                ['message' => "Categorie {$id} introuvable."],
                404
            );
        }

        $limit = (int) $request->query('limit', self::QUESTIONS_PAR_PARTIE);
        $limit = max(1, min($limit, self::LIMITE_MAX));

        // with('answers') charge les reponses de toutes les questions en UNE requete.
        // Sans lui, Laravel en ferait une par question : c'est le probleme dit "N+1".
        $questions = $categorie->questions()
            ->with('answers')
            ->inRandomOrder()
            ->limit($limit)
            ->get();

        $payload = $questions->map(fn (Question $question) => [
            'id'           => $question->id,
            'intitule'     => $question->intitule,
            'propositions' => $this->tirerPropositions($question),
        ]);

        return response()->json($payload);
    }

    /**
     * Garde la bonne reponse, tire 3 mauvaises au hasard parmi les 9,
     * puis melange les 4 pour que la bonne ne tombe jamais a la meme place.
     */
    private function tirerPropositions(Question $question): array
    {
        $bonne = $question->answers->firstWhere('is_correct', true);

        $propositions = $question->answers
            ->where('is_correct', false)
            ->shuffle()
            ->take(self::PROPOSITIONS_AFFICHEES - 1)
            ->push($bonne)
            ->shuffle();

        return $this->formater($propositions);
    }

    /**
     * isCorrect en camelCase : c'est la convention cote JavaScript,
     * et c'est ce que le contrat d'API annonce au front.
     */
    private function formater(Collection $propositions): array
    {
        return $propositions
            ->map(fn (Answer $answer) => [
                'id'        => $answer->id,
                'libelle'   => $answer->libelle,
                'isCorrect' => $answer->is_correct,
            ])
            ->values()
            ->all();
    }
}
