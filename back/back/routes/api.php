<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\QuizzApiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Culture Quiz expose deux endpoints en lecture seule.
| Le front React ne fait que consulter : creer ou modifier une question
| passe par les fichiers database/content/*.json et le seeder.
|
*/

// Les 5 categories du quiz, avec leur icone Lucide et leur couleur.
Route::get('/categories', [QuizzApiController::class, 'categories']);

// 10 questions au hasard dans une categorie, 4 propositions melangees chacune.
Route::get('/categories/{id}/questions', [QuizzApiController::class, 'questions']);
