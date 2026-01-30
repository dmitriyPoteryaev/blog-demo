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
        return Article::query()
            ->orderByDesc('created_at')
            ->get(['id', 'title', 'content', 'created_at']);
    }

    // GET /api/articles/{id}
    public function show($id)
    {
        $article = Article::with(['comments' => function ($q) {
            $q->orderBy('created_at', 'asc');
        }])->findOrFail($id);

        return response()->json($article);
    }

    // POST /api/articles
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
        ]);

        $article = Article::create($data);

        return response()->json($article, 201);
    }

    // POST /api/articles/{id}/comments
    public function storeComment(Request $request, $id)
    {
        $article = Article::findOrFail($id);

        $data = $request->validate([
            'author_name' => ['required', 'string', 'max:100'],
            'content' => ['required', 'string', 'max:2000'],
        ]);

        $comment = $article->comments()->create($data);

        return response()->json($comment, 201);
    }
}
