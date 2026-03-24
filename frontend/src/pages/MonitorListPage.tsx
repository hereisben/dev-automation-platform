import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function MonitorListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["monitors"],
    queryFn: () => api.get("/monitors"),
  });

  if (isLoading) return <div className="p-10">Loading</div>;
  if (error) return <div className="p-10">Error loading monitors</div>;

  const monitors = data?.data || [];

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">API Monitors</h1>

      {monitors.map((m: any) => (
        <Card key={m.id}>
          <CardContent className="p-4 space-y-2">
            <p className="font-medium">{m.url}</p>
            <p className="text-sm text-muted-foreground">
              Interval: {m.interval_seconds}s
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
