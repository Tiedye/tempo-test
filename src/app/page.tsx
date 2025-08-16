"use client";

import { useState } from "react";
import JobPostingDisplay from "./components/JobPostingDisplay";
import JobPostingForm from "./components/JobPostingForm";
import SalaryPrediction from "./components/SalaryPrediction";
import { JobData } from "./types";

export default function Home() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [jobPosting, setJobPosting] = useState<JobData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<string>("");

  const handleJobPostingSubmit = async (url: string) => {
    setIsAnalyzing(true);
    setPrediction("");

    try {
      const response = await fetch(
        `/api/analyze-job?url=${encodeURIComponent(url)}`
      );

      if (!response.ok) {
        throw new Error("Failed to analyze job posting");
      }

      const reader = response.body?.getReader();
      if (!reader) return;

      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        result += chunk;
        setPrediction(result);
      }
    } catch (error) {
      console.error("Error analyzing job posting:", error);
      alert(
        "Failed to analyze job posting. Please check the URL and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleJobPostingExtract = async (url: string) => {
    setIsExtracting(true);

    try {
      const response = await fetch(
        `/api/extract-job?url=${encodeURIComponent(url.trim())}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to extract job posting content");
      }

      const data = await response.json();
      setJobPosting(data.job);
    } catch (error) {
      console.error("Error extracting job posting:", error);
      alert(
        "Failed to extract job posting content. Please check the URL and try again."
      );
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💼 Job Salary Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Analyze job postings and get AI-powered salary predictions to help
            you make informed hiring decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <JobPostingForm
              onSubmit={handleJobPostingSubmit}
              onExtract={handleJobPostingExtract}
              isAnalyzing={isAnalyzing}
              isExtracting={isExtracting}
            />

            {jobPosting && <JobPostingDisplay job={jobPosting} />}
          </div>

          <div className="space-y-6">
            <SalaryPrediction
              prediction={prediction}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
