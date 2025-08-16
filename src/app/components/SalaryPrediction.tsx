"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SalaryPredictionProps {
  prediction: string;
  isAnalyzing: boolean;
}

export default function SalaryPrediction({
  prediction,
  isAnalyzing,
}: SalaryPredictionProps) {
  if (!prediction && !isAnalyzing) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          💰 Salary Prediction
        </h2>

        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-gray-600 text-lg">
            Enter a job posting URL and click &quot;Analyze &amp; Predict
            Salary&quot; to get started
          </p>
        </div>
      </div>
    );
  }

  const data = prediction.split("###### RESULT")[1];
  const lowerBound = data?.split("lower bound: ")[1]?.split(" ")[0];
  const upperBound = data?.split("upper bound: ")[1]?.split(" ")[0];
  const confidence = data?.split("confidence: ")[1]?.split(" ")[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        💰 Salary Prediction
      </h2>

      {isAnalyzing && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">
              AI is analyzing the job posting...
            </span>
          </div>
        </div>
      )}

      {!isAnalyzing &&
        lowerBound != null &&
        upperBound != null &&
        confidence != null && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-blue-800 font-bold">
                {Number.parseFloat(lowerBound).toLocaleString(undefined, {
                  currency: "USD",
                  style: "currency",
                  notation: "compact",
                })}{" "}
                -{" "}
                {Number.parseFloat(upperBound).toLocaleString(undefined, {
                  currency: "USD",
                  style: "currency",
                  notation: "compact",
                })}{" "}
                <span className="font-medium">({confidence} confidence)</span>
              </span>
            </div>
          </div>
        )}

      {prediction && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
            <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-li:text-gray-800">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {prediction.split("###### RESULT")[0]}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
