import type { Monitor } from "../../types/monitor";
import { Card, CardContent } from "../ui/card";

type MonitorCardProps = {
  monitor: Monitor;
};

export default function MonitorCard({ monitor }: MonitorCardProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <p className="font-medium">{monitor.url}</p>
        <p className="text-sm text-muted-foreground">
          Interval: {monitor.interval_seconds}s
        </p>
      </CardContent>
    </Card>
  );
}
