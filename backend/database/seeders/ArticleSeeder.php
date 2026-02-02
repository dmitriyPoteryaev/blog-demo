<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\User;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'dmitry@test.com')->first()
            ?? User::first();

        if (!$user) {
            throw new \RuntimeException('No users found. Run UserSeeder first.');
        }

        $items = [
            [
                'title' => 'First article',
                'content' => 'Demo content for the first article...',
                'user_id' => $user->id,
            ],
            [
                'title' => 'Second article',
                'content' => 'Demo content for the second article...',
                'user_id' => $user->id,
            ],
            [
                'title' => 'Third article',
                'content' => 'Demo content for the third article...',
                'user_id' => $user->id,
            ],
        ];

        foreach ($items as $item) {
            Article::create($item);
        }
    }
}
