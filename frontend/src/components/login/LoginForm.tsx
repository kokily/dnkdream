import type { SyntheticEvent } from "react";
import { Button, Container, ErrorText, Form, Input, Title } from "./LoginForm.styles";

interface LoginFormProps {
  password: string;
  onPasswordChange: (value: string) => void;
  error: string;
  loading: boolean;
  onSubmit: (e: SyntheticEvent) => void;
}

function LoginForm({
  password,
  onPasswordChange,
  error,
  loading,
  onSubmit
}: LoginFormProps) {
  return (
    <Container>
      <Title>관리자 로그인</Title>
      <Form onSubmit={onSubmit}>
        <Input type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <ErrorText>{error}</ErrorText>}
        <Button type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </Button>
      </Form>
    </Container>
  )
}

export default LoginForm;