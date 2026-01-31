import { Form, Input, Button, Alert } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "api/auth";

type Mode = "signIn" | "signUp";

type Props = {
  mode: Mode;
};

const AuthForm = ({ mode }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setError(null);
    setLoading(true);

    try {
      if (mode === "signIn") {
        await signIn(values.email, values.password);
      } else {
        await signUp(values.email, values.password);
      }

      // ✅ успешная авторизация / регистрация
      navigate("/blog", { replace: true });
    } catch (e: any) {
      setError(
        e?.response?.data?.message || "Ошибка авторизации"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Email обязателен" },
          { type: "email", message: "Некорректный email" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Пароль обязателен" }]}
      >
        <Input.Password />
      </Form.Item>

      {mode === "signUp" && (
        <Form.Item
          name="confirmPassword"
          label="Confirm password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Подтверди пароль" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || value === getFieldValue("password")) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Пароли не совпадают")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      )}

      {error && (
        <Alert
          style={{ marginBottom: 16 }}
          message={error}
          type="error"
          showIcon
        />
      )}

      <Button
        type="primary"
        htmlType="submit"
        block
        loading={loading}
      >
        {mode === "signIn" ? "Sign In" : "Sign Up"}
      </Button>
    </Form>
  );
};

export default AuthForm;
