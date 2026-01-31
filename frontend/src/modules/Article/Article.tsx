import React, { useEffect, useMemo, useState } from "react";
import {
  Layout,
  Card,
  Typography,
  Space,
  Tag,
  Divider,
  Spin,
  Empty,
  Avatar,
  Button,
  Input,
  message,
} from "antd";
import { ArrowLeftOutlined, SendOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

type Article = {
  id: number | string;
  title: string;
  content?: string | null;
  author?: { id?: number | string; name?: string | null } | null;
  user_id?: number | string;
  created_at?: string | null;
};

type ApiComment = {
  id: number | string;
  article_id: number | string;
  author_name: string;
  content: string;
  created_at?: string | null;
  updated_at?: string | null;
};

type CommentsResponse = {
  success: boolean;
  comments: ApiComment[];
};

const API_BASE = "http://localhost:8090";

/* =======================
   CSRF helpers (Sanctum)
   ======================= */
function getCookie(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

async function ensureCsrfCookie() {
  await fetch(`${API_BASE}/sanctum/csrf-cookie?t=${Date.now()}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
}

function formatCreatedAt(createdAt?: string | null) {
  if (!createdAt) return "—";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return createdAt;
  return d.toLocaleString();
}

function initials(name: string) {
  const t = (name || "Anonymous").trim();
  if (!t) return "A";
  return t[0].toUpperCase();
}

const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const articleId = id ?? "";
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<ApiComment[]>([]);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  const [commentText, setCommentText] = useState("");
  const [sending, setSending] = useState(false);

  const authorLabel = useMemo(() => {
    if (!article) return "";
    const name = article.author?.name?.trim();
    if (name) return name;
    if (article.user_id != null) return `User ${article.user_id}`;
    return "Unknown";
  }, [article]);

  const loadArticle = async (signal?: AbortSignal) => {
    const res = await fetch(`${API_BASE}/api/articles/${articleId}?t=${Date.now()}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal,
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (!res.ok) throw new Error(`GET /api/articles/${articleId} failed: ${res.status}`);

    const data = await res.json();
    const a: Article = data?.data ?? data?.article ?? data;
    setArticle(a);
  };

  const loadComments = async (signal?: AbortSignal) => {
    const res = await fetch(`${API_BASE}/api/articles/${articleId}/comments?t=${Date.now()}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal,
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    if (!res.ok) throw new Error(`GET /api/articles/${articleId}/comments failed: ${res.status}`);

    const data: CommentsResponse = await res.json();
    setComments(Array.isArray(data?.comments) ? data.comments : []);
  };

  useEffect(() => {
    if (!articleId) return;

    const controller = new AbortController();

    (async () => {
      try {
        setLoadingArticle(true);
        await loadArticle(controller.signal);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          message.error(e?.message ?? "Failed to load article");
          setArticle(null);
        }
      } finally {
        setLoadingArticle(false);
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  useEffect(() => {
    if (!articleId) return;

    const controller = new AbortController();

    (async () => {
      try {
        setLoadingComments(true);
        await loadComments(controller.signal);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          message.error(e?.message ?? "Failed to load comments");
          setComments([]);
        }
      } finally {
        setLoadingComments(false);
      }
    })();

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const sendComment = async () => {
    const content = commentText.trim();
    if (!content) return;

    try {
      setSending(true);

      await ensureCsrfCookie();

      const xsrfToken = getCookie("XSRF-TOKEN");
      if (!xsrfToken) throw new Error("XSRF-TOKEN cookie not found");

      const res = await fetch(`${API_BASE}/api/articles/${articleId}/comments?t=${Date.now()}`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        let txt = "";
        try {
          txt = await res.text();
        } catch {}
        throw new Error(
          `POST /api/articles/${articleId}/comments failed: ${res.status}${txt ? ` — ${txt}` : ""}`
        );
      }

      message.success("Comment added");
      setCommentText("");

      setLoadingComments(true);
      await loadComments();
    } catch (e: any) {
      message.error(e?.message ?? "Failed to add comment");
    } finally {
      setSending(false);
      setLoadingComments(false);
    }
  };

  const onLogout = async () => {
    try {
      await ensureCsrfCookie();

      const xsrfToken = getCookie("XSRF-TOKEN");
      if (!xsrfToken) throw new Error("XSRF-TOKEN cookie not found");

      const res = await fetch(`${API_BASE}/api/auth/logout?t=${Date.now()}`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": xsrfToken,
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (!res.ok) throw new Error(`POST /api/auth/logout failed: ${res.status}`);

      message.success("Logged out");
      navigate("/auth");
    } catch (e: any) {
      message.error(e?.message ?? "Logout failed");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Header
        style={{
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/blog")}
          style={{ color: "#fff" }}
        >
          Back
        </Button>

        <Button type="text" icon={<LogoutOutlined />} onClick={onLogout} style={{ color: "#fff" }}>
          Logout
        </Button>
      </Header>

      <Content style={{ padding: "28px 16px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 860 }}>
          {loadingArticle ? (
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
              styles={{
                body: { padding: "18px" },
              }}
            >
              {/* ===== Article header inside body (NOT Card title) ===== */}
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

              {/* ===== Article content ===== */}
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

              {/* ===== Comments ===== */}
              <div style={{ maxWidth: 760, margin: "0 auto" }}>
                <Title level={4} style={{ margin: 0, fontSize: 20 }}>
                  Comments
                </Title>

                {/* Add comment */}
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 14 }}>

                  <div style={{ flex: 1 }}>
                    <Input.TextArea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      autoSize={{ minRows: 2, maxRows: 6 }}
                      style={{ borderRadius: 10 }}
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={sendComment}
                        loading={sending}
                        disabled={!commentText.trim()}
                      >
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>

                <Divider style={{ margin: "14px 0" }} />

                {/* Comments list */}
                {loadingComments ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: "18px 0" }}>
                    <Spin />
                  </div>
                ) : comments.length === 0 ? (
                  <Empty description="No comments yet" />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {comments.map((c) => (
                      <div key={c.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                        <Avatar size={40} style={{ background: "#1677ff" }}>
                          {initials(c.author_name)}
                        </Avatar>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 4 }}>
                            <Text strong style={{ fontSize: 14 }}>
                              {c.author_name || "Anonymous"}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {formatCreatedAt(c.created_at)}
                            </Text>
                          </div>

                          <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                            {c.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Article;
