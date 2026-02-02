
import React, { useEffect, useState } from "react";
import { Layout, Card, Typography, Space, Tag, Divider, Spin, Empty, message } from "antd";
import { useParams } from "react-router-dom";

import AppHeader from "shared/components/AppHeader/AppHeader";
import { formatCreatedAt } from "shared/helpers/ui/text";
import { getErrorMessage } from "api/errors";

import type { ArticleDto, ApiCommentDto } from "shared/types/types";
import { fetchArticle } from "api/articles";
import { fetchComments, createComment } from "api/comments";

import CommentsSection from "shared/components/CommentsSection";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const articleId = id ?? "";

  const [article, setArticle] = useState<ArticleDto | null>(null);
  const [comments, setComments] = useState<ApiCommentDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);

  const authorLabel =
    article?.author?.name?.trim() ||
    (article?.user_id != null ? `User ${article.user_id}` : article ? "Unknown" : "");

  const reloadAll = async () => {
    if (!articleId) return;

    setLoading(true);
    try {
      const [a, list] = await Promise.all([fetchArticle(articleId), fetchComments(articleId)]);
      setArticle(a);
      setComments(list);
    } catch (e: unknown) {
      message.error(getErrorMessage(e));
      setArticle(null);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reloadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const reloadCommentsOnly = async () => {
    if (!articleId) return;
    try {
      const list = await fetchComments(articleId);
      setComments(list);
    } catch (e: unknown) {
      message.error(getErrorMessage(e));
      setComments([]);
    }
  };

  const onSendComment = async () => {
    const content = commentText.trim();
    if (!content) return;

    setSending(true);
    try {
      await createComment(articleId, content);
      message.success("Comment added");
      setCommentText("");
      await reloadCommentsOnly();
    } catch (e: unknown) {
      message.error(getErrorMessage(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <AppHeader showBack />

      <Content style={{ padding: "28px 16px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 860 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
              <Spin />
            </div>
          ) : !article ? (
            <Empty description="Article not found" />
          ) : (
            <Card
              bordered={false}
              style={{
                width: "100%",
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              }}
              styles={{ body: { padding: "18px" } }}
            >
              {/* Article header */}
              <div
                style={{
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  paddingBottom: 14,
                  marginBottom: 18,
                }}
              >
                <div style={{ maxWidth: 760, margin: "0 auto" }}>
                  <Title
                    level={2}
                    style={{
                      textAlign: "center",
                      margin: 0,
                      fontSize: 34,
                      lineHeight: 1.25,
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                  >
                    {article.title}
                  </Title>
                </div>

                <div style={{ marginTop: 10, display: "flex", justifyContent: "center" }}>
                  <Space size={10} wrap>
                    <Tag color="blue" style={{ margin: 0, borderRadius: 6, padding: "2px 10px" }}>
                      {authorLabel}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Created: {formatCreatedAt(article.created_at)}
                    </Text>
                  </Space>
                </div>
              </div>

              {/* Article content */}
              <div style={{ maxWidth: 760, margin: "0 auto" }}>
                {(article.content ?? "")
                  .split("\n\n")
                  .filter(Boolean)
                  .map((block, idx) => (
                    <Paragraph key={idx} style={{ fontSize: 16, lineHeight: 1.9, marginBottom: 14 }}>
                      {block}
                    </Paragraph>
                  ))}
              </div>

              <Divider style={{ margin: "18px 0" }} />

              <CommentsSection
                comments={comments}
                loading={loading} 
                sending={sending}
                value={commentText}
                onChange={setCommentText}
                onSend={onSendComment}
              />
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Article;
