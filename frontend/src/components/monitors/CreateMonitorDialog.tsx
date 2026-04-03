import { api } from "@/lib/api";
import type { CreateMonitorPayload } from "@/types/monitor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type ApiError = {
  error?: string;
};

export default function CreateMonitorDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [intervalSeconds, setIntervalSeconds] = useState("60");
  const [formError, setFormError] = useState("");

  const createMonitorMutation = useMutation({
    mutationFn: async () => {
      setFormError("");

      const interval = Number(intervalSeconds);

      if (!url.trim()) {
        throw new Error(`URL is required`);
      }

      if (!interval || interval <= 0) {
        throw new Error(`Interval must be greater than 0`);
      }

      const payload: CreateMonitorPayload = {
        url: url.trim(),
        intervalSeconds: interval,
      };

      const response = await api.post("/monitors", payload);

      return response.data;
    },
    onSuccess: () => {
      setOpen(false);
      setUrl("");
      setIntervalSeconds("60");
      setFormError("");
      queryClient.invalidateQueries({ queryKey: ["monitors"] });
    },
    onError: (error: AxiosError<ApiError>) => {
      const message =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create monitor";

      setFormError(message);
    },
  });

  const handleSubmit = () => {
    createMonitorMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="
    transition-all duration-200
    hover:shadow-md
    hover:-translate-y-0.5"
        >
          Add Monitor
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create API Monitor</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">API URL</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm mt-2"
              type="text"
              placeholder="https://api.example.com/health"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Interval (seconds)</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm mt-2"
              type="number"
              min={10}
              value={intervalSeconds}
              onChange={(e) => setIntervalSeconds(e.target.value)}
            />
          </div>

          {formError ? (
            <p className="text-sm text-red-500">{formError}</p>
          ) : null}

          <Button
            onClick={handleSubmit}
            disabled={createMonitorMutation.isPending}
            className="w-full"
          >
            {createMonitorMutation.isPending ? "Creating..." : "Create Monitor"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
