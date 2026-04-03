import CreateMonitorDialog from "@/components/monitors/CreateMonitorDialog";
import MonitorCard from "@/components/monitors/MonitorCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthContext } from "@/hooks/useAuthContext";
import { api } from "@/lib/api";
import type { Monitor } from "@/types/monitor";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Server } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function MonitorListPage() {
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["monitors"],
    queryFn: async () => {
      const response = await api.get("/monitors");
      return response.data as Monitor[];
    },
  });

  const monitors = data || [];

  const total = monitors.length;

  const avgInterval =
    total > 0
      ? Math.round(
          monitors.reduce((acc, m) => acc + m.interval_seconds, 0) / total,
        )
      : 0;

  const fastest =
    total > 0 ? Math.min(...monitors.map((m) => m.interval_seconds)) : 0;

  const slowest =
    total > 0 ? Math.max(...monitors.map((m) => m.interval_seconds)) : 0;

  const handleLogout = () => {
    logout();
    toast.success(`Logged out successfully.`);
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">API Monitors</h1>
          <p className="text-sm text-muted-foreground">
            Track endpoint health, response time, and incidents.
          </p>
        </div>

        <div className="grid gap-4">
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Loading monitors...
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              Preparing dashboard...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">API Monitors</h1>
          <p className="text-sm text-muted-foreground">
            Track endpoint health, response time, and incidents.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-3">
            <p className="text-sm text-red-500">Failed to load monitors.</p>
            <p className="text-sm text-muted-foreground">
              Please refresh the page or try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">API Monitors</h1>
          <p className="text-sm text-muted-foreground">
            Track endpoint health, uptime signals, and incident history in one
            place.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CreateMonitorDialog />
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <Card>
          <CardContent className="p-5 space-y-1">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{total}</p>
          </CardContent>
        </Card>

        {/* Avg */}
        <Card>
          <CardContent className="p-5 space-y-1">
            <p className="text-sm text-muted-foreground">Avg Interval</p>
            <p className="text-2xl font-bold">
              {avgInterval > 0 ? `${avgInterval}s` : "--"}
            </p>
          </CardContent>
        </Card>

        {/* Fastest */}
        <Card>
          <CardContent className="p-5 space-y-1">
            <p className="text-sm text-muted-foreground">Fastest</p>
            <p className="text-2xl font-bold text-green-600">
              {fastest > 0 ? `${fastest}s` : "--"}
            </p>
          </CardContent>
        </Card>

        {/* Slowest */}
        <Card>
          <CardContent className="p-5 space-y-1">
            <p className="text-sm text-muted-foreground">Slowest</p>
            <p className="text-2xl font-bold text-orange-500">
              {slowest > 0 ? `${slowest}s` : "--"}
            </p>
          </CardContent>
        </Card>
      </div>

      {monitors.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border">
              <Server className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">No monitors yet</h2>
            <p className="text-sm text-muted-foreground">
              Create your first API monitor to start tracking status codes,
              response times, and incidents.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {monitors.map((monitor) => (
            <MonitorCard key={monitor.id} monitor={monitor} />
          ))}
        </div>
      )}
    </div>
  );
}
