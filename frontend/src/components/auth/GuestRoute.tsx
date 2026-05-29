import type React from "react"
import { useAuthStore } from "../../stores/authStore";
import { Navigate } from "react-router-dom";

type GuestRouteProps = {
  children: React.ReactNode;
}

export default function GuestRoute({ children }: GuestRouteProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/admin/write" replace />;
  }

  return <>{children}</>;
}