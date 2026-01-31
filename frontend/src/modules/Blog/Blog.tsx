import React, { useEffect, useState } from "react";
import { Layout, Card, Typography, Space, Button, message, Spin, Empty, Tag } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Paragraph, Text } = Typography;

type Article = {
  id: number | string;
  title: string;
  content?: string | null;
  author?: { id?: number | string; name?: string | null } | null;
  user_id?: number | string;
  created_at?: string | null;
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

export const Blog: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/api/articles?t=${Date.now()}`, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!res.ok) throw new Error(`GET /api/articles failed: ${res.status}`);

        const data = await res.json();

        const list: Article[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.articles)
          ? data.articles
          : [];

        setArticles(list);
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        message.error(e?.message ?? "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

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
      navigate("/login");
    } catch (e: any) {
      message.error(e?.message ?? "Logout failed");
    }
  };

  const openArticle = (id: Article["id"]) => {
    navigate(`/article/${id}`);
  };

  const getAuthorLabel = (a: Article) => {
    const name = a.author?.name?.trim();
    if (name) return name;
    if (a.user_id != null) return `User ${a.user_id}`;
    return "Unknown";
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Header
        style={{
          background: "#000",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <Button type="text" icon={<LogoutOutlined />} onClick={onLogout} style={{ color: "#fff" }}>
          Logout
        </Button>
      </Header>

      <Content style={{ padding: "28px 16px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 760 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
              <Spin />
            </div>
          ) : articles.length === 0 ? (
            <Empty description="No articles" />
          ) : (
            <Space direction="vertical" size={22} style={{ width: "100%" }}>
              {articles.map((a) => (
                <Card
                  key={a.id}
                  hoverable
                  onClick={() => openArticle(a.id)}
                  style={{
                    width: "100%",
                    borderRadius: 16,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                  }}
                  styles={{
                    header: { padding: "14px 18px" },
                    body: { padding: "18px" },
                  }}
                  title={
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <Text
                        strong
                        style={{
                          fontSize: 14,
                          flex: 1,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={a.title}
                      >
                        {a.title}
                      </Text>

                      <Tag
                        color="blue"
                        style={{
                          margin: 0,
                          borderRadius: 6,
                          padding: "2px 10px",
                          maxWidth: 220,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={getAuthorLabel(a)}
                      >
                        {getAuthorLabel(a)}
                      </Tag>
                    </div>
                  }
                >
                  {/* контент + footer внизу, общая высота фикс */}
                  <div
                    style={{
                      height: 170, // фикс высота карточки внутри (контент + footer)
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ flex: 1, overflow: "hidden" }}>
                      <Paragraph style={{ marginBottom: 0 }} ellipsis={{ rows: 6 }}>
                        <Text>{a.content ?? ""}</Text>
                      </Paragraph>
                    </div>

                    {/* ✅ footer */}
                    <div
                      style={{
                        marginTop: 12,
                        paddingTop: 10,
                        borderTop: "1px solid rgba(0,0,0,0.08)",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Created: {formatCreatedAt(a.created_at)}
                      </Text>
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Blog;
