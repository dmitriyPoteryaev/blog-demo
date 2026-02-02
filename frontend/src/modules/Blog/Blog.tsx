import { useEffect, useState } from "react";
import { Layout, Space, message, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import AppHeader from "shared/components/AppHeader/AppHeader";
import ArticleCard from "shared/components/ArticleCard/ArticleCard";
import { fetchArticles } from "api/articles";
import type  {Article}  from "shared/types/types";

const { Content } = Layout;

const Blog = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchArticles();
        setArticles(data);
      } catch {
        message.error("Не удалось загрузить статьи");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const openArticle = (id: Article["id"]) => {
    navigate(`/article/${id}`);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <AppHeader />

      <Content
        style={{
          padding: "28px 16px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 760 }}>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: 40,
              }}
            >
              <Spin />
            </div>
          ) : articles.length === 0 ? (
            <Empty description="No articles" />
          ) : (
            <Space direction="vertical" size={22} style={{ width: "100%" }}>
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onOpen={openArticle}
                />
              ))}
            </Space>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Blog;
