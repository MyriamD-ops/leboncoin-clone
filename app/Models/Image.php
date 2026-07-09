<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['url', 'ordre_affichage', 'annonce_id'])]
class Image extends Model
{
    public function annonce(): BelongsTo
    {
        return $this->belongsTo(Annonce::class);
    }
}
