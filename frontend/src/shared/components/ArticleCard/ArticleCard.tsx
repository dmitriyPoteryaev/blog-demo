import React, { useMemo } from "react";
import { Card, Typography, Tag } from "antd";

const { Paragraph, Text } = Typography;

export type Article = {
  id: number | string;
  title: string;
  content?: string | null;
  author?: { id?: number | string; name?: string | null } | null;
  user_id?: number | string;
  created_at?: string | null;
};

type Props = {
  article: Article;
  onOpen: (id: Article["id"]) => void;
};

function formatCreatedAt(createdAt?: string | null) {
  if (!createdAt) return "—";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return createdAt;
  return d.toLocaleString();
}

function getAuthorLabel(a: Article) {
  const name = a.author?.name?.trim();
  if (name) return name;
  if (a.user_id != null) return `User ${a.user_id}`;
  return "Unknown";
}

const ArticleCard: React.FC<Props> = ({ article, onOpen }) => {
  const authorLabel = useMemo(() => getAuthorLabel(article), [article]);

  return (
    <Card
      hoverable
      onClick={() => onOpen(article.id)}
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
            title={article.title}
          >
            {article.title}
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
            title={authorLabel}
          >
            {authorLabel}
          </Tag>
        </div>
      }
    >
      <div style={{ height: 170, display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Paragraph style={{ marginBottom: 0 }} ellipsis={{ rows: 6 }}>
            <Text>{article.content ?? ""}</Text>
          </Paragraph>
        </div>

        {/* footer */}
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
            Created: {formatCreatedAt(article.created_at)}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default ArticleCard;
