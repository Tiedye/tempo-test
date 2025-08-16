import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

export const revalidate = 3600; // 1 hour

const jobDataSchema = z.object({
  title: z.string(),
  company: z.string(),
  location: z.string(),
  employmentType: z.enum(["Full-Time", "Part-Time", "Contract", "Internship"]),
  locationType: z.enum(["Remote", "On-Site", "Hybrid"]),
  content: z
    .string()
    .describe("The job posting content in markdown format, exactly as written"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    // this allows up to make it a lot prettier in the UI as it is a structured response
    const parsedResponse = await openai.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts job data from a job posting. When formatting the content of the posting, copy the content exactly as is do not rework or summarize anything, just adapt it to markdown.",
        },
        {
          role: "user",
          content: html,
        },
      ],
      text: {
        format: zodTextFormat(jobDataSchema, "job_data"),
      },
    });

    return NextResponse.json({
      job: parsedResponse.output_parsed,
    });
  } catch (error) {
    console.error("Error extracting job posting:", error);
    return NextResponse.json(
      { error: "Failed to extract job posting content", details: error },
      { status: 500 }
    );
  }
}
