import { NavLink, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";
import CommitGeneratorPage from "./pages/CommitGeneratorPage";
import LoginPage from "./pages/LoginPage";
import MonitorListPage from "./pages/MonitorListPage";
import ScreenshotPage from "./pages/ScreenshotPage";

function App() {
  return (
    <div>
      {/* NAVBAR */}
      <div className="border-b bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="text-lg font-bold">Dev Automation</div>
          <div className="flex gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Monitors
            </NavLink>
            <NavLink
              to="/commit"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Commit
            </NavLink>

            <NavLink
              to="/screenshot"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Screenshot
            </NavLink>
          </div>
        </div>
      </div>
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
        <Route
          path="/commit"
          element={
            <ProtectedRoute>
              <CommitGeneratorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/screenshot"
          element={
            <ProtectedRoute>
              <ScreenshotPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
