<?php

namespace App\Policies;

use App\Models\Annonce;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AnnoncePolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Annonce $annonce): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Annonce $annonce): bool
    {
        return $user->id === $annonce->user_id || $user->role === 'admin';
    }

    public function delete(User $user, Annonce $annonce): bool
    {
        return $user->id === $annonce->user_id || $user->role === 'admin';
    }

    public function restore(User $user, Annonce $annonce): bool
    {
        return $user->id === $annonce->user_id || $user->role === 'admin';
    }

    public function forceDelete(User $user, Annonce $annonce): bool
    {
        return $user->id === $annonce->user_id || $user->role === 'admin';
    }
}
