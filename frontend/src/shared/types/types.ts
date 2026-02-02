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

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}