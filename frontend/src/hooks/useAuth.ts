import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const token = localStorage.getItem("token");

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
