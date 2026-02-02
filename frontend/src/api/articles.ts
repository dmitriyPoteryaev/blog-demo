
import { http } from "api/http";
import { ensureCsrfCookie } from "shared/helpers/auth/sanctum";
import type  {Article}  from "shared/types/types";


export async function fetchArticles(): Promise<Article[]> {
  const res = await http.get<Article[]>("/api/articles");
  return res.data;
}


export async function createArticle(data: {
  title: string;
  content: string;
}): Promise<Article> {
  await ensureCsrfCookie();
  const res = await http.post<Article>("/api/articles", data);
  return res.data;
}