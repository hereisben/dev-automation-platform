import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Timer } from "lucide-react";
import { toast } from "sonner";
import type { Monitor } from "../../types/monitor";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import MonitorLogsDialog from "./MonitorLogsDialog";

type MonitorCardProps = {
  monitor: Monitor;
};

export default function MonitorCard({ monitor }: MonitorCardProps) {
  const queryClient = useQueryClient();

  let hostname = monitor.url;
  try {
    hostname = new URL(monitor.url).hostname;
  } catch {
    console.error(`Failed to extract hostname`);
  }

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
      toast.success(`Monitor deleted`);
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
    onError: () => {
      toast.error(`Failed to delete monitor`);
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm(`Delete monitor for ${monitor.url}`);

    if (!confirmed) return;

    deleteMonitorMutation.mutate();
  };

  return (
    <Card className="transition hover:shadow-md hover:border-muted-foreground/30">
      <CardContent className="p-5 space-y-4">
        {/* Top section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium truncate">{hostname}</p>

            <a
              href={monitor.url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          <p className="text-xs text-muted-foreground truncate">
            {monitor.url}
          </p>
        </div>

        {/* Interval */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Timer className="h-4 w-4" />
          <span>{monitor.interval_seconds}s interval</span>
        </div>

        {/* Error */}
        {deleteMonitorMutation.isError && (
          <p className="text-sm text-red-500">Failed to delete monitor.</p>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
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
