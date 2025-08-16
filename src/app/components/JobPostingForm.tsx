"use client";

import { useState } from "react";

interface Props {
  onSubmit: (url: string) => Promise<void> | void;
  onExtract: (url: string) => Promise<void> | void;
  isAnalyzing: boolean;
  isExtracting: boolean;
}

export default function JobPostingForm({
  onSubmit,
  onExtract,
  isAnalyzing,
  isExtracting,
}: Props) {
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    const trimmedUrl = url.trim();
    if (trimmedUrl) {
      onSubmit(trimmedUrl);
    }
  };

  const handleExtractContent = async () => {
    const trimmedUrl = url.trim();
    if (trimmedUrl) {
      onExtract(trimmedUrl);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Job Posting Analysis
      </h2>

      <form action={handleSubmit} className="space-y-4 flex flex-col">
        <label>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            Job Posting URL
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://jobs.ashbyhq.com/cohere/..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleExtractContent}
            disabled={!url.trim()}
            className="flex-1 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isExtracting ? "Extracting..." : "Extract Content (slow)"}
          </button>

          <button
            type="submit"
            disabled={!url.trim() || isAnalyzing}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze & Predict Salary"}
          </button>
        </div>
      </form>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Paste a job posting URL (e.g., from Ashby, trakstar, etc.)</li>
          <li>
            2. Click &quot;Analyze &amp; Predict Salary&quot; to get AI-powered
            salary insights
          </li>
          <li>
            (optional) Click &quot;Extract Content&quot; to see a detailed human
            readable view of the posting
          </li>
        </ol>
      </div>
    </div>
  );
}
