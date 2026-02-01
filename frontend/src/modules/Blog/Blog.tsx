import React, { useEffect, useState } from "react";
import { Layout, Space, message, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import AppHeader from "shared/components/AppHeader/AppHeader";
import ArticleCard, { Article } from "shared/components/ArticleCard/ArticleCard";

const { Content } = Layout;

const API_BASE = "http://localhost:8090";

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

  const openArticle = (id: Article["id"]) => {
    navigate(`/article/${id}`);
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <AppHeader />
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
                <ArticleCard key={a.id} article={a} onOpen={openArticle} />
              ))}
            </Space>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default Blog;
