import { Form, Input, Button } from "antd";

type Mode = "signIn" | "signUp";

type Props = {
  mode: Mode;
};

const AuthForm = ({ mode }: Props) => {
  return (
    <Form layout="vertical">
      {/* Email — always */}
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Email is required" },
          { type: "email", message: "Enter a valid email" },
        ]}
      >
        <Input />
      </Form.Item>

      {/* Password — always */}
      <Form.Item
        name="password"
        label="Password"
        rules={[{ required: true, message: "Password is required" }]}
      >
        <Input.Password />
      </Form.Item>

      {/* Only for Sign Up */}
      {mode === "signUp" && (
        <Form.Item
          name="confirmPassword"
          label="Confirm password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const pass = getFieldValue("password");
                if (!value || value === pass) return Promise.resolve();
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      )}

      <Button type="primary" htmlType="submit" block>
        {mode === "signIn" ? "Sign In" : "Sign Up"}
      </Button>
    </Form>
  );
}

export default AuthForm;