<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'title' => 'First article',
                'content' => 'Demo content for the first article...'
            ],
            [
                'title' => 'Second article',
                'content' => 'Demo content for the second article...'
            ],
            [
                'title' => 'Third article',
                'content' => 'Demo content for the third article...'
            ],
        ];

        foreach ($items as $item) {
            Article::create($item);
        }
    }
}
