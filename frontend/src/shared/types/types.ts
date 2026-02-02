

export type ID = number | string;

export interface AuthorDto {
  id?: ID;
  name?: string | null;
}

export interface ArticleDto {
  id: ID;
  title: string;
  content?: string | null;

  author?: AuthorDto | null;
  user_id?: ID | null;

  created_at?: string | null;
}

export interface ApiCommentDto {
  id: ID;
  article_id: ID;
  author_name: string;
  content: string;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CommentsResponseDto {
  success: boolean;
  comments: ApiCommentDto[];
}

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export type AuthValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export type Mode = "signIn" | "signUp";
