<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');
    }

    public function index()
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => Category::all(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:categories',
        ]);

        $slug = \Illuminate\Support\Str::slug($validated['nom']);
        Category::create([
            'nom' => $validated['nom'],
            'slug' => $slug,
        ]);

        return redirect()->route('categories.index')->with('success', 'Catégorie créée avec succès');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255|unique:categories,nom,' . $category->id,
        ]);

        $slug = \Illuminate\Support\Str::slug($validated['nom']);
        $category->update([
            'nom' => $validated['nom'],
            'slug' => $slug,
        ]);

        return redirect()->route('categories.index')->with('success', 'Catégorie mise à jour avec succès');
    }

    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('categories.index')->with('success', 'Catégorie supprimée avec succès');
    }
}
