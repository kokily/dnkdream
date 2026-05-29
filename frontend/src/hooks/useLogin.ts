import { useState, type SyntheticEvent } from "react";
import { useAuthStore } from "../stores/authStore";
import { useAuthActions } from "./useAuthActions";

export function useLogin() {
  const [password, setPassword] = useState('');
  const error = useAuthStore((s) => s.error);
  const loading = useAuthStore((s) => s.loading);
  const clearError = useAuthStore((s) => s.clearError);
  const { loginAndGoWrite } = useAuthActions();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    clearError();

    try {
      await loginAndGoWrite(password);
    } catch {
      
    }
  };

  return {
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
  };
}