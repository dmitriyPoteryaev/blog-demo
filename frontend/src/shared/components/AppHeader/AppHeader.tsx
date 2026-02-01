import { Layout, Button, message } from "antd";
import {
  PlusOutlined,
  LogoutOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { logout } from "shared/helpers/auth/logout";

const { Header } = Layout;

type AppHeaderProps = {
  showBack?: boolean;
};

 const AppHeader = ({ showBack = false }: AppHeaderProps) => {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await logout();
      message.success("Logged out");
      navigate("/login", { replace: true });
    } catch (e: any) {
      message.error(e.message ?? "Logout failed");
    }
  };

  return (
    <Header
      style={{
        background: "#000",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
      }}
    >

      <div style={{ flex: 1 }}>
        {showBack && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ color: "#fff" }}
          >
            Back
          </Button>
        )}
      </div>


      <div style={{ display: "flex", gap: 8 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/article/new")}
        >
          Опубликовать статью
        </Button>

        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={onLogout}
          style={{ color: "#fff" }}
        >
          Logout
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader;