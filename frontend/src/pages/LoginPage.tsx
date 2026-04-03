import { useAuthContext } from "@/hooks/useAuthContext";
import { api } from "@/lib/api";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;

      await login(token);

      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    try {
      setGuestLoading(true);

      const response = await api.post("/auth/guest");
      const token = response.data.token;

      await login(token);

      toast.success(`Logged in as guest`);
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 rounded-xl border p-6 shadow-sm"
      >
        <h1 className="text-2xl font-bold">Login</h1>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-white 
             hover:bg-primary/90 
             transition-colors duration-200 
             disabled:opacity-50 disabled:cursor-not-allowed 
             cursor-pointer"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center text-sm text-gray-500">or</div>

          <button
            type="button"
            onClick={handleGuestLogin}
            disabled={guestLoading}
            className="w-full rounded-md border px-4 py-2 
             hover:bg-gray-100/10 
             transition-colors duration-200 
             disabled:opacity-50 disabled:cursor-not-allowed 
             cursor-pointer"
          >
            {guestLoading ? "Entering as guest..." : "Continue as Guest"}
          </button>
        </div>
      </form>
    </div>
  );
}
