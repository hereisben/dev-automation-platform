import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/lib/api";
import axios from "axios";
import { useState } from "react";

export default function CommitGeneratorPage() {
  const [diff, setDiff] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setError("");
    setResult("");
    setIsLoading(true);

    try {
      const response = await api.post("/commit/generate", {
        diff,
      });

      setResult(response.data.message);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to generate");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to generate");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">AI Commit Generator</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <textarea
            className="w-full h-40 border rounded p-2 text-sm"
            placeholder="Paste your git diff here..."
            value={diff}
            onChange={(e) => setDiff(e.target.value)}
          />

          <Button onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate Commit Message"}
          </Button>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardContent className="p-4">
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
