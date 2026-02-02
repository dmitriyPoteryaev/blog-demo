import { http } from "api/http";
import { ensureCsrfCookie } from "shared/helpers/auth/sanctum";
import type { ArticleDto } from "shared/types/types";

export async function fetchArticles(): Promise<ArticleDto[]> {
  const res = await http.get<ArticleDto[]>("/api/articles");
  return res.data;
}

export async function createArticle(data: {
  title: string;
  content: string;
}): Promise<ArticleDto> {
  await ensureCsrfCookie();
  const res = await http.post<ArticleDto>("/api/articles", data);
  return res.data;
}


export async function fetchArticle(articleId: string): Promise<ArticleDto> {
  const res = await http.get<ArticleDto>(`/api/articles/${articleId}`);
  return res.data;
}