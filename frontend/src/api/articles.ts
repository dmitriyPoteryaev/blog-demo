
import { http } from "api/http";

export interface Author {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  author: Author;
  created_at: string;
}

export async function fetchArticles(): Promise<Article[]> {
  const res = await http.get<Article[]>("/api/articles");
  return res.data;
}
