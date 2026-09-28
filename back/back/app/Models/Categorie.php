<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categorie extends Model
{
    use HasFactory;

    protected $table = 'categories';

    protected $fillable = [
        'nom',
        'slug',
        'icone',   // nom d'icone Lucide, ex. "Compass"
        'couleur', // #RRGGBB
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class, 'category_id');
    }
}
