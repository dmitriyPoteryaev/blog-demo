import { Form, Button, Alert } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "api/auth";
import { FormInput, FormPassword } from "shared/components/Input";
import { getErrorMessage } from "api/errors";
import { confirmPasswordValidator } from "shared/validators/password";

type Mode = "signIn" | "signUp";

type Props = {
  mode: Mode;
};

type AuthValues = {
  email: string;
  password: string;
  confirmPassword?: string;
};

const AuthForm = ({ mode }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: AuthValues) => {
    setError(null);
    setLoading(true);

    try {
      if (mode === "signIn") {
        await signIn(values.email, values.password);
      } else {
        await signUp(values.email, values.password);
      }

      navigate("/blog", { replace: true });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form<AuthValues> layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Email обязателен" },
          { type: "email", message: "Некорректный email" },
        ]}
      >
        <FormInput placeholder="Email" autoComplete="email" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Пароль обязателен" }]}
      >
        <FormPassword
          placeholder="Password"
          autoComplete={mode === "signIn" ? "current-password" : "new-password"}
        />
      </Form.Item>

      {mode === "signUp" && (
          <Form.Item
            name="confirmPassword"
            label="Confirm password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Подтверди пароль" },
              confirmPasswordValidator("password"),
            ]}
          >
            <FormPassword
              placeholder="Confirm password"
              autoComplete="new-password"
            />
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

      <Button type="primary" htmlType="submit" block loading={loading}>
        {mode === "signIn" ? "Sign In" : "Sign Up"}
      </Button>
    </Form>
  );
};

export default AuthForm;
