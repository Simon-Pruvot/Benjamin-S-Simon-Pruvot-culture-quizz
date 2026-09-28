<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Culture Quiz n'a pas d'interface cote Laravel : l'affichage est entierement
| assure par le front React. Seule la page d'accueil est conservee, pour
| verifier d'un coup d'oeil que le serveur repond.
|
*/

Route::get('/', function () {
    return view('welcome');
})->name('home');
