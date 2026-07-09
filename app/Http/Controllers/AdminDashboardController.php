<?php

namespace App\Http\Controllers;

use App\Models\Annonce;
use App\Models\User;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('admin');
    }

    public function index()
    {
        $stats = [
            [
                'key' => 'pending',
                'value' => Annonce::where('statut', 'active')->count(),
                'trend' => '+12%',
            ],
            [
                'key' => 'online',
                'value' => Annonce::where('statut', 'active')->count(),
                'trend' => null,
            ],
            [
                'key' => 'users',
                'value' => User::count(),
                'trend' => '+5%',
            ],
            [
                'key' => 'reports',
                'value' => 0,
                'trend' => null,
            ],
        ];

        $recentAnnonces = Annonce::with('category')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($annonce) {
                return [
                    'id' => $annonce->id,
                    'title' => $annonce->titre,
                    'category' => $annonce->category->slug ?? 'default',
                    'status' => $annonce->statut === 'active' ? 'en attente' : 'validée',
                ];
            })
            ->toArray();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentAnnonces' => $recentAnnonces,
        ]);
    }
}
