import LoginForm from "../components/login/LoginForm";
import { useLogin } from "../hooks/useLogin";

function LoginPage() {
  const { password, setPassword, error, loading, handleSubmit } = useLogin();

  return (
    <LoginForm
      password={password}
      onPasswordChange={setPassword}
      error={error}
      loading={loading}
      onSubmit={handleSubmit}
    />
  );
}

export default LoginPage;