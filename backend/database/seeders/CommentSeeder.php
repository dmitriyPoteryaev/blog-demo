<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comment;
use App\Models\Article;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $articles = Article::all();

        if ($articles->isEmpty()) {
            throw new \RuntimeException('No articles found. Run ArticleSeeder first.');
        }

        $authorNames = ['Dmitry', 'Alice', 'Bob', 'Anonymous'];

        foreach ($articles as $article) {
            Comment::create([
                'article_id' => $article->id,
                'author_name' => $authorNames[array_rand($authorNames)],
                'content' => "Nice post about: {$article->title}",
            ]);

            Comment::create([
                'article_id' => $article->id,
                'author_name' => $authorNames[array_rand($authorNames)],
                'content' => "I have a question regarding this article.",
            ]);
        }
    }
}
