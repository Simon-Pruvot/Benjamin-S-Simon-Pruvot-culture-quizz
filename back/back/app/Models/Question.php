<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'intitule',
    ];

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class, 'category_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

    /** La bonne reponse parmi les 10. */
    public function bonneReponse(): HasMany
    {
        return $this->answers()->where('is_correct', true);
    }
}
