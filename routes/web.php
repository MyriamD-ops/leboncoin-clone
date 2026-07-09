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

// Temporary debug routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/debug-user', function () {
        $user = auth()->user();
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_admin' => $user->role === 'admin',
        ];
    });

    Route::get('/test-inertia', function () {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                ['key' => 'test', 'value' => 123, 'trend' => null],
            ],
            'recentAnnonces' => [],
        ]);
    });

    Route::get('/test-create', function () {
        $categories = \App\Models\Category::all();
        return Inertia::render('Annonces/Create', [
            'categories' => $categories,
        ]);
    });

    Route::post('/test-store', function (\Illuminate\Http\Request $request) {
        try {
            $validated = $request->validate([
                'titre' => 'required|string|max:255',
                'description' => 'required|string',
                'prix' => 'required|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
            ]);

            $annonce = $request->user()->annonces()->create($validated);

            return redirect()->route('annonces.show', $annonce);
        } catch (\Exception $e) {
            return [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ];
        }
    });

    Route::get('/debug-admin', function () {
        try {
            $stats = [
                [
                    'key' => 'pending',
                    'value' => \App\Models\Annonce::where('statut', 'active')->count(),
                    'trend' => '+12%',
                ],
                [
                    'key' => 'online',
                    'value' => \App\Models\Annonce::where('statut', 'active')->count(),
                    'trend' => null,
                ],
                [
                    'key' => 'users',
                    'value' => \App\Models\User::count(),
                    'trend' => '+5%',
                ],
                [
                    'key' => 'reports',
                    'value' => 0,
                    'trend' => null,
                ],
            ];

            $recentAnnonces = \App\Models\Annonce::with('category')
                ->latest()
                ->limit(10)
                ->get()
                ->map(function ($annonce) {
                    $categorySlug = 'default';
                    if ($annonce->category && $annonce->category->slug) {
                        $categorySlug = $annonce->category->slug;
                    }

                    return [
                        'id' => $annonce->id,
                        'title' => $annonce->titre,
                        'category' => $categorySlug,
                        'status' => $annonce->statut === 'active' ? 'en attente' : 'validée',
                    ];
                })
                ->toArray();

            return [
                'success' => true,
                'stats' => $stats,
                'recentAnnonces' => $recentAnnonces,
            ];
        } catch (\Exception $e) {
            return [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ];
        }
    });
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
