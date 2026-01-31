import { useState } from "react";
import { Typography } from "antd";
import AuthForm from "../AuthForm";

const { Link, Title } = Typography;

const Auth = () => {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

  return (
    <div style={{ maxWidth: 420, margin: "80px auto" }}>
      <Title level={3} style={{ textAlign: "center" }}>
        {mode === "signIn" ? "Вход" : "Регистрация"}
      </Title>

      <AuthForm mode={mode} />

      <div style={{ marginTop: 16, textAlign: "center" }}>
        {mode === "signIn" ? (
          <>
            Нет аккаунта?{" "}
            <Link onClick={() => setMode("signUp")}>
              Зарегистрироваться
            </Link>
          </>
        ) : (
          <>
            Уже есть аккаунт?{" "}
            <Link onClick={() => setMode("signIn")}>
              Войти
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
