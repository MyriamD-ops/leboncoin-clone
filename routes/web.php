<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AnnonceController;
use App\Http\Controllers\AdminDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AnnonceController::class, 'index'])->name('home');
Route::get('/annonces', [AnnonceController::class, 'index'])->name('annonces.index');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    Route::resource('categories', CategoryController::class);

    // Annonces routes - create/edit must come before the show route
    Route::get('/annonces/create', [AnnonceController::class, 'create'])->name('annonces.create');
    Route::post('/annonces', [AnnonceController::class, 'store'])->name('annonces.store');
    Route::get('/annonces/{annonce}/edit', [AnnonceController::class, 'edit'])->name('annonces.edit');
    Route::patch('/annonces/{annonce}', [AnnonceController::class, 'update'])->name('annonces.update');
    Route::delete('/annonces/{annonce}', [AnnonceController::class, 'destroy'])->name('annonces.destroy');
});

// Show annonce must come after the authenticated routes
Route::get('/annonces/{annonce}', [AnnonceController::class, 'show'])->name('annonces.show');

require __DIR__.'/auth.php';

// Test route
Route::get('/test', function () {
    return 'Server is working';
});

Route::get('/test-db', function () {
    try {
        $count = \App\Models\User::count();
        return "Database works - Users: {$count}";
    } catch (\Exception $e) {
        return "Database error: " . $e->getMessage();
    }
});

Route::get('/test-index', function () {
    try {
        $annonces = \App\Models\Annonce::where('statut', 'active')->latest()->paginate(12);
        $categories = \App\Models\Category::all();
        return [
            'annonces_count' => $annonces->total(),
            'categories_count' => $categories->count(),
        ];
    } catch (\Exception $e) {
        return [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ];
    }
});

Route::get('/test-inertia-simple', function () {
    try {
        return Inertia::render('Annonces/Index', [
            'annonces' => [],
            'categories' => [],
            'filters' => ['category_id' => null, 'search' => null],
        ]);
    } catch (\Exception $e) {
        return [
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ];
    }
});
