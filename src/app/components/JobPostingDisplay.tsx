"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { JobData } from "../types";

interface Props {
  job: JobData;
}

export default function JobPostingDisplay({ job }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        📄 Job Posting Details
      </h2>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-blue-900 mb-2">{job.title}</h3>
        <p className="text-lg text-blue-800 mb-3">at {job.company}</p>

        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            📍 {job.location}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            💼 {job.employmentType}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            🏢 {job.locationType}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">
          📋 Job Description
        </h4>
        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-ul:text-gray-800 prose-li:text-gray-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {job.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
