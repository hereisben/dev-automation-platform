import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Monitor } from "../../types/monitor";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import MonitorLogsDialog from "./MonitorLogsDialog";

type MonitorCardProps = {
  monitor: Monitor;
};

export default function MonitorCard({ monitor }: MonitorCardProps) {
  const queryClient = useQueryClient();

  const deleteMonitorMutation = useMutation({
    mutationFn: async () => {
      const response = await api.delete("/monitors", {
        data: {
          url: monitor.url,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm(`Delete monitor for ${monitor.url}`);

    if (!confirmed) return;

    deleteMonitorMutation.mutate();
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="space-y-1">
          <p className="font-medium">{monitor.url}</p>
          <p className="text-sm text-muted-foreground">
            Interval: {monitor.interval_seconds}s
          </p>
        </div>

        {deleteMonitorMutation.isError ? (
          <p className="text-sm text-red-500">Failed to delete monitor.</p>
        ) : null}

        <div className="flex justify-end gap-2">
          <MonitorLogsDialog monitor={monitor} />

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteMonitorMutation.isPending}
          >
            {deleteMonitorMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
