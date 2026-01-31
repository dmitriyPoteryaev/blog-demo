import React, { useMemo, useState } from "react";
import { Layout, Card, Typography, Input, Button, Space, message } from "antd";
import { ArrowLeftOutlined, LogoutOutlined, SendOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

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

function getXsrfToken(): string {
  return getCookie("XSRF-TOKEN") ?? "";
}

const CreateArticle = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && content.trim().length > 0;
  }, [title, content]);

  const onBack = () => navigate("/blog");

  const onLogout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "X-XSRF-TOKEN": getXsrfToken() },
      });
    } catch {
      // ignore
    }
    navigate("/auth", { replace: true });
  };

  const onPublish = async () => {
    if (!canSubmit) return;

    setLoading(true);
    try {
      await fetch(`${API_BASE}/sanctum/csrf-cookie`, { credentials: "include" });

      const res = await fetch(`${API_BASE}/api/articles`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": getXsrfToken(),
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      const data: any = await res.json().catch(() => null);

      if (!res.ok) {
        const errorMessage =
          data?.message ||
          (data?.errors && typeof data.errors === "object"
            ? Object.values(data.errors).flat().join(", ")
            : "Ошибка публикации");
        throw new Error(errorMessage);
      }

      message.success("Статья опубликована");

      const articleId = data?.id ?? data?.article?.id;
      if (articleId) navigate(`/article/${articleId}`);
      else navigate("/blog");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка публикации";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Header
        style={{
          background: "#000",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={onBack} style={{ color: "#fff" }}>
          Back
        </Button>

        <Space>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={onPublish}
            loading={loading}
            disabled={!canSubmit}
          >
            Опубликовать
          </Button>

          <Button type="text" icon={<LogoutOutlined />} onClick={onLogout} style={{ color: "#fff" }}>
            Logout
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: "32px 16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Card style={{ borderRadius: 12, boxShadow: "0 6px 20px rgba(0,0,0,0.06)" }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
              Создать статью
            </Title>

            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <Text strong>Заголовок</Text>
                <Input
                  size="large"
                  placeholder="Очень длинный заголовок статьи..."
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Text strong>Текст статьи</Text>
                <Input.TextArea
                  placeholder="Пиши здесь текст статьи…"
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                  autoSize={{ minRows: 14, maxRows: 26 }}
                  style={{ fontSize: 16, lineHeight: 1.6 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button onClick={onBack}>Отмена</Button>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={onPublish}
                  loading={loading}
                  disabled={!canSubmit}
                >
                  Опубликовать
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}

export default CreateArticle;