import { Route, Routes } from "react-router-dom";
import GlobalStyle from "./styles/GlobalStyle";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import WritePage from "./pages/admin/WritePage";
import GuestRoute from "./components/auth/GuestRoute";
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";

function App() {
  useEffect(function SyncStore() {
    useAuthStore.getState().syncFromStorage();
  }, []);

  return (
    <>
      <GlobalStyle />

      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route 
          path="/admin/write"
          element={            
            <ProtectedRoute>
              <WritePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
