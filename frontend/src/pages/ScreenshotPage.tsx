import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import axios from "axios";
import { useEffect, useState } from "react";

type ScreenshotResponse = {
  status: string;
  message: string;
  jobId: string;
};

type ScreenshotStatusResponse = {
  status: string;
  jobId: string;
  fileName?: string;
  filePath?: string;
  imageUrl?: string;
  error?: string;
};

export default function ScreenshotPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScreenshotResponse | null>(null);
  const [jobStatus, setJobStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    setJobStatus("");
    setImageUrl("");

    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post("/screenshot", {
        url: url.trim(),
      });

      setResult(response.data);
      setJobStatus(response.data.status);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Fail to capture screenshot");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`Fail to capture`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!result?.jobId) return;

    const intervalId = setInterval(async () => {
      try {
        const response = await api.get<ScreenshotStatusResponse>(
          `/screenshot/${result.jobId}`,
        );

        const data = response.data;
        setJobStatus(data.status);

        if (data.status === "completed") {
          setImageUrl(`${baseUrl}${data.imageUrl}`);
          clearInterval(intervalId);
        }

        if (data.status === "failed") {
          setError(data.error || "Screenshot job failed");
          clearInterval(intervalId);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error || `Failed to fetch screenshot status`,
          );
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to fetch screenshot status");
        }

        clearInterval(intervalId);
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, [result?.jobId]);

  return (
    <div className="p-10">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="space-y-4 p-6">
          <div>
            <h1 className="text-2xl font-bold">Screenshot Capture</h1>
            <p className="text-sm text-muted-foreground">
              Enter a URL to queue a screenshot job.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Website URL</label>
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-md border px-3 py-2 mt-2 text-sm"
            />
          </div>

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Queuing..." : "Capture Screenshot"}
          </Button>

          {error && (
            <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {result && (
            <div className="rounded-md border bg-muted p-4 text-sm space-y-1">
              <p>
                <strong>Status:</strong> {result.status}
              </p>
              <p>
                <strong>Message:</strong> {result.message}
              </p>
              <p>
                <strong>Job ID:</strong> {result.jobId}
              </p>
              <p>
                <strong>Current Job Status:</strong> {jobStatus}
              </p>
            </div>
          )}

          {imageUrl && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Screenshot Result</h2>
              <img
                src={imageUrl}
                alt="Screenshot result"
                className="w-full rounded-lg border"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
