import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import LoginPage from "./pages/LoginPage";
import MonitorListPage from "./pages/MonitorListPage";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MonitorListPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
