import CreateMonitorDialog from "@/components/monitors/CreateMonitorDialog";
import MonitorCard from "@/components/monitors/MonitorCard";
import { api } from "@/lib/api";
import type { Monitor } from "@/types/monitor";
import { useQuery } from "@tanstack/react-query";

export default function MonitorListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["monitors"],
    queryFn: async () => {
      const response = await api.get("/monitors");
      return response.data as Monitor[];
    },
  });

  if (isLoading) return <div className="p-10">Loading</div>;
  if (error) return <div className="p-10">Error loading monitors</div>;

  const monitors = data || [];

  return (
    <div className="p-10 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">API Monitors</h1>
        <CreateMonitorDialog />
      </div>

      {monitors.length === 0 ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          No monitors yet.
        </div>
      ) : (
        <div className="space-y-4">
          {monitors.map((m) => (
            <MonitorCard key={m.id} monitor={m} />
          ))}
        </div>
      )}
    </div>
  );
}
