import { Card, Typography, Tag } from "antd";
import type { ArticleDto } from "shared/types/types";

const { Paragraph, Text } = Typography;

type Props = {
  article: ArticleDto;
  onOpen: (id: string) => void;
};

function formatCreatedAt(createdAt?: string | null) {
  if (!createdAt) return "—";
  const d = new Date(createdAt);
  return Number.isNaN(d.getTime()) ? createdAt : d.toLocaleString();
}

const ArticleCard = ({ article, onOpen }: Props) => {
  const authorName =
    article.author?.name?.trim() ||
    (article.user_id != null ? `User ${article.user_id}` : "Unknown");

  return (
    <Card
      hoverable
      onClick={() => onOpen(String(article.id))}
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
      <Paragraph
        style={{ margin: 0, whiteSpace: "pre-wrap" }}
        ellipsis={{ rows: 3, expandable: false }}
      >
        {article.content ?? ""}
      </Paragraph>

      <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatCreatedAt(article.created_at)}
        </Text>
      </div>
    </Card>
  );
};

export default ArticleCard;
