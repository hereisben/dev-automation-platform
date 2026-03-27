import { api } from "@/lib/api";
import type { Monitor, MonitorLog } from "@/types/monitor";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

type MonitorLogsDialogProps = {
  monitor: Monitor;
};

export default function MonitorLogsDialog({ monitor }: MonitorLogsDialogProps) {
  const [open, setOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["monitor-logs", monitor.id],
    queryFn: async () => {
      const response = await api.get(`/monitors/${monitor.id}/logs`);
      return response.data as MonitorLog[];
    },
    enabled: open,
  });

  const logs = data || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Logs</Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Monitor Logs</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm font-medium break-all">{monitor.url}</p>
          <p className="text-sm font-medium text-muted-foreground">
            Interval: {monitor.interval_seconds}s
          </p>
        </div>

        {isLoading ? (
          <div className="py-6 text-sm">Loading logs...</div>
        ) : isError ? (
          <div className="py-6 text-sm text-red-500">Failed to load logs.</div>
        ) : logs.length === 0 ? (
          <div className="py-6 text-sm text-muted-foreground">
            No logs yet for this monitor.
          </div>
        ) : (
          <div className="max-h-[420px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Check At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Success</TableHead>
                  <TableHead>Incident</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="whitespace-nowrap">
                      {new Date(log.checked_at).toLocaleString()}
                    </TableCell>

                    <TableCell>{log.status_code ?? "N/A"}</TableCell>

                    <TableCell>
                      {log.response_time != null
                        ? `${log.response_time} ms`
                        : "N/A"}
                    </TableCell>

                    <TableCell>{log.success ? "Yes" : "No"}</TableCell>

                    <TableCell className="max-w-[300px]">
                      {log.incident_summary ||
                        log.incident_message ||
                        "No incident"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
