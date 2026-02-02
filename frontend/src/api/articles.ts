
import {API_BASE} from "shared/config/api";

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
  const res = await fetch(`${API_BASE}/api/articles`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to load articles (${res.status})`);
  }

  return res.json();
}
