

import { Avatar, Button, Divider, Empty, Spin, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";

import { FormTextArea } from "shared/components/Input";
import { formatCreatedAt, initials } from "shared/helpers/ui/text";
import type { ApiCommentDto } from "shared/types/types";

const { Title, Text } = Typography;

type Props = {
  comments: ApiCommentDto[];
  loading: boolean;
  sending: boolean;

  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

const CommentsSection: React.FC<Props> = ({
  comments,
  loading,
  sending,
  value,
  onChange,
  onSend,
}) => {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <Title level={4} style={{ margin: 0, fontSize: 20 }}>
        Comments
      </Title>

      {/* Add comment */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 14 }}>
        <div style={{ flex: 1 }}>
          <FormTextArea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Add a comment..."
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ borderRadius: 10 }}
          />

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={onSend}
              loading={sending}
              disabled={!value.trim()}
            >
              Comment
            </Button>
          </div>
        </div>
      </div>

      <Divider style={{ margin: "14px 0" }} />

      {/* Comments list */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "18px 0" }}>
          <Spin />
        </div>
      ) : comments.length === 0 ? (
        <Empty description="No comments yet" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {comments.map((c) => (
            <div key={String(c.id)} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
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
  );
};

export default CommentsSection;
