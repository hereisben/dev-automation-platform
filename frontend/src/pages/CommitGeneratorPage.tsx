import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import axios from "axios";
import { Copy, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CommitGeneratorPage() {
  const [diff, setDiff] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    const trimmedDiff = diff.trim();

    if (!trimmedDiff) {
      setError(`Please paste a git diff first.`);
      toast.error(`Please paste a git diff first.`);
      return;
    }

    setError("");
    setResult("");
    setIsLoading(true);

    try {
      const response = await api.post("/commit/generate", {
        diff: trimmedDiff,
      });

      const message = response.data.message || "";

      setResult(message);
      toast.success(`Commit message generated successfully.`);
    } catch (err: unknown) {
      let errorMessage = "Failed to generate commit message.";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.error || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      toast.success(`Copied to clipboard`);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AI Commit Generator</h1>
        <p className="text-sm text-muted-foreground">
          Paste your git diff and generate a clean commit message in seconds.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="git-diff" className="text-sm font-medium">
              Git Diff
            </label>
            <textarea
              id="git-diff"
              className="w-full mt-4 min-h-56 rounded-md border bg-background p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Paste your git diff here..."
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-end">
            <Button onClick={handleGenerate} disabled={isLoading}>
              <Sparkles className="mr-2 h-4 w-4" />
              {isLoading ? "Generating..." : "Generate Commit Message"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDiff("");
                setResult("");
                setError("");
              }}
              disabled={isLoading && !diff}
            >
              Clear
            </Button>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Generated Result</h2>
              <p className="text-sm text-muted-foreground">
                Review the output before using it in your commit.
              </p>
            </div>

            {result && (
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            )}
          </div>

          {result ? (
            <pre className="overflow-x-auto rounded-lg border bg-muted/40 p-4 text-sm whitespace-pre-wrap break-word">
              {result}
            </pre>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              No commit message yet. Paste a git diff above and click generate.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
