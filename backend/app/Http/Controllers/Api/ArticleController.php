<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    // GET /api/articles
        public function index()
        {
            $articles = \App\Models\Article::query()
                ->with('author:id,name')
                ->orderByDesc('id')
                ->get();

            return response()->json($articles);
        }

    // GET /api/articles/{id}
        public function show($id)
        {
            $article = \App\Models\Article::query()
                ->with('author:id,name')
                ->findOrFail($id);

            return response()->json($article);
        }

    // POST /api/articles
        public function store(Request $request)
        {
            $data = $request->validate([
                'title' => ['required', 'string', 'max:255'],
                'content' => ['required', 'string'],
            ]);

            $article = \App\Models\Article::create([
                'title' => $data['title'],
                'content' => $data['content'],
                'user_id' => $request->user()->id, // важно
            ]);

            // опционально: вернуть сразу с author
            $article->load('author:id,name');

            return response()->json($article, 201);
        }


        // POST /api/articles/{id}/comments
        public function storeComment(Request $request, $id)
        {
            $article = \App\Models\Article::findOrFail($id);

            $data = $request->validate([
                'author_name' => ['nullable', 'string', 'max:100'],
                'content' => ['required', 'string', 'max:2000'],
            ]);

            $authorName = $request->user()
                ? $request->user()->name
                : ($data['author_name'] ?? 'Anonymous');

            $comment = $article->comments()->create([
                'author_name' => $authorName,
                'content' => $data['content'],
            ]);

            return response()->json($comment, 201);
        }
}
