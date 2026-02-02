
import { http } from "api/http";
import { ensureCsrfCookie } from "shared/helpers/auth/sanctum";
import type { ApiCommentDto, CommentsResponseDto } from "shared/types/types";

export async function fetchComments(articleId: string): Promise<ApiCommentDto[]> {
  const res = await http.get<CommentsResponseDto>(`/api/articles/${articleId}/comments`);
  return Array.isArray(res.data?.comments) ? res.data.comments : [];
}

export async function createComment(articleId: string, content: string): Promise<void> {
  await ensureCsrfCookie();
  await http.post(`/api/articles/${articleId}/comments`, { content });
}
