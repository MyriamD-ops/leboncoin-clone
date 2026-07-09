<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'user',
        ]);

        $categories = [
            ['nom' => 'Électronique', 'slug' => 'electronique'],
            ['nom' => 'Vêtements', 'slug' => 'vetements'],
            ['nom' => 'Meubles', 'slug' => 'meubles'],
            ['nom' => 'Livres', 'slug' => 'livres'],
            ['nom' => 'Sport', 'slug' => 'sport'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
