import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import MonitorListPage from "./pages/MonitorListPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
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
