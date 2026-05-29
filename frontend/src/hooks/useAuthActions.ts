import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

export function useAuthActions() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);

  const loginAndGoWrite = async (password: string) => {
    await login(password);
    navigate("/admin/write", {
      replace: true,
    });
  };

  const logoutAndGoLogin = () => {
    logout();
    navigate("/login", {
      replace: true,
    });
  }

  return {
    loginAndGoWrite,
    logoutAndGoLogin,
  };
}