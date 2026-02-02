import React, { useState } from "react";
import { Layout, Card, Typography, Input, Button, message } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AppHeader from "shared/components/AppHeader/AppHeader";
import { createArticle } from "api/articles";
import { getErrorMessage } from "api/errors";

const { Content } = Layout;
const { Title, Text } = Typography;

const CreateArticle = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

const canSubmit = title.trim().length > 0 && content.trim().length > 0;

  const onPublish = async () => {
    if (!canSubmit) return;

    setLoading(true);
    try {
      const article = await createArticle({
        title: title.trim(),
        content: content.trim(),
      });

      message.success("Статья опубликована");
      navigate(`/article/${article.id}`);
    } catch (err: unknown) {
      message.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <AppHeader showBack />

      <Content style={{ padding: "32px 16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Card style={{ borderRadius: 12 }}>
            <Title level={2} style={{ textAlign: "center", marginBottom: 24 }}>
              Создать статью
            </Title>

            <div style={{ display: "grid", gap: 16 }}>
              <div>
                <Text strong>Заголовок</Text>
                <Input
                  size="large"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <Text strong>Текст статьи</Text>
                <Input.TextArea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  autoSize={{ minRows: 14 }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <Button onClick={() => navigate("/blog")}>Отмена</Button>
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
};

export default CreateArticle;
