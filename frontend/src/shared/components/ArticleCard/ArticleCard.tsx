import { Card, Typography, Tag } from "antd";

const { Paragraph, Text } = Typography;

export interface Author {
  id: number;
  name: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  author: Author | null;
  created_at: string;
}

type Props = {
  article: Article;
  onOpen: (id: number) => void;
};

function formatCreatedAt(createdAt: string) {
  const d = new Date(createdAt);
  return Number.isNaN(d.getTime()) ? createdAt : d.toLocaleString();
}

const ArticleCard = ({ article, onOpen }: Props) => {
  const authorName = article.author?.name ?? "Unknown";

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
          <Text strong ellipsis title={article.title} style={{ flex: 1, minWidth: 0 }}>
            {article.title}
          </Text>

          <Tag color="blue" style={{ margin: 0 }}>
            {authorName}
          </Tag>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Paragraph style={{ margin: 0 }} ellipsis={{ rows: 3 }}>
          {article.content}
        </Paragraph>

        <div
          style={{
            marginTop: "auto",
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
