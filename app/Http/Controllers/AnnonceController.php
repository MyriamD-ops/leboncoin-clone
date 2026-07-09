<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnnonceController extends Controller
{
    public function index()
    {
        $annonces = Annonce::where('statut', 'active')
            ->latest()
            ->paginate(12);

        return Inertia::render('Annonces/Index', [
            'annonces' => $annonces,
            'categories' => Category::all(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Annonce::class);

        return Inertia::render('Annonces/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Annonce::class);

        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);

        $annonce = $request->user()->annonces()->create($validated);

        return redirect()->route('annonces.show', $annonce)->with('success', 'Annonce créée avec succès');
    }

    public function show(Annonce $annonce)
    {
        return Inertia::render('Annonces/Show', [
            'annonce' => $annonce->load('user', 'category', 'images'),
        ]);
    }

    public function edit(Annonce $annonce)
    {
        $this->authorize('update', $annonce);

        return Inertia::render('Annonces/Edit', [
            'annonce' => $annonce,
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Annonce $annonce)
    {
        $this->authorize('update', $annonce);

        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'description' => 'required|string',
            'prix' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'statut' => 'nullable|in:active,vendue,archivee',
        ]);

        $annonce->update($validated);

        return redirect()->route('annonces.show', $annonce)->with('success', 'Annonce mise à jour avec succès');
    }

    public function destroy(Annonce $annonce)
    {
        $this->authorize('delete', $annonce);

        $annonce->delete();

        return redirect()->route('annonces.index')->with('success', 'Annonce supprimée avec succès');
    }
}
