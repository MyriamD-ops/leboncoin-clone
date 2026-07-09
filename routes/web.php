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
Route::get('/annonces/{annonce}', [AnnonceController::class, 'show'])->name('annonces.show');

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
    Route::get('/annonces/create', [AnnonceController::class, 'create'])->name('annonces.create');
    Route::post('/annonces', [AnnonceController::class, 'store'])->name('annonces.store');
    Route::get('/annonces/{annonce}/edit', [AnnonceController::class, 'edit'])->name('annonces.edit');
    Route::patch('/annonces/{annonce}', [AnnonceController::class, 'update'])->name('annonces.update');
    Route::delete('/annonces/{annonce}', [AnnonceController::class, 'destroy'])->name('annonces.destroy');
});

require __DIR__.'/auth.php';

// Temporary debug routes
Route::get('/debug-user', function () {
    $user = auth()->user();
    if (!$user) {
        return ['error' => 'Not authenticated'];
    }
    return [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role,
        'is_admin' => $user->role === 'admin',
    ];
});

Route::get('/debug-dashboard', function () {
    $stats = [
        ['key' => 'pending', 'value' => \App\Models\Annonce::where('statut', 'active')->count(), 'trend' => '+12%'],
        ['key' => 'online', 'value' => \App\Models\Annonce::where('statut', 'active')->count(), 'trend' => null],
        ['key' => 'users', 'value' => \App\Models\User::count(), 'trend' => '+5%'],
        ['key' => 'reports', 'value' => 0, 'trend' => null],
    ];

    $recentAnnonces = \App\Models\Annonce::with('category')
        ->latest()
        ->limit(10)
        ->get();

    return [
        'stats' => $stats,
        'annonces_count' => $recentAnnonces->count(),
        'annonces' => $recentAnnonces->toArray(),
    ];
});

Route::get('/setup-admin', function () {
    $user = \App\Models\User::firstOrCreate(
        ['email' => 'admin@example.com'],
        [
            'name' => 'Admin User',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'admin',
        ]
    );

    // Create categories if they don't exist
    $categories = [
        ['nom' => 'Électronique', 'slug' => 'electronique'],
        ['nom' => 'Vêtements', 'slug' => 'vetements'],
        ['nom' => 'Meubles', 'slug' => 'meubles'],
        ['nom' => 'Livres', 'slug' => 'livres'],
        ['nom' => 'Sport', 'slug' => 'sport'],
    ];

    foreach ($categories as $cat) {
        \App\Models\Category::firstOrCreate(['slug' => $cat['slug']], $cat);
    }

    return 'Admin user created: admin@example.com / password';
});
