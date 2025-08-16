import { NextRequest } from "next/server";
import { parse } from "node-html-parser";
import OpenAI from "openai";

export const revalidate = 3600; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return new Response("URL parameter is required", { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    const content =
      parse(html, {
        blockTextElements: {
          script: false,
          style: false,
          noscript: false,
        },
      }).querySelector("body")?.structuredText ?? "";

    const prompt = `You are an expert HR consultant and compensation analyst. Analyze the following job posting and provide a comprehensive salary prediction with detailed reasoning.

Job Posting Content:
${content}

Please provide your analysis in the following format:

## Analysis Breakdown
[Break down the key factors that influenced your prediction]

### Role Level & Experience
[Analyze the required experience level and seniority]

### Technical Skills & Requirements
[Evaluate the technical complexity and specialized skills]

### Industry & Company Factors
[Consider the industry, company size, and market position]

### Location Considerations
[Note any location-specific factors mentioned]

### Market Comparison
[Compare to typical salaries for similar roles]

## Confidence Level
[Rate your confidence in this prediction (High/Medium/Low) and explain why]

## Additional Insights
[Any other relevant observations about compensation or market positioning]

## Salary Range Prediction
[Provide a specific salary range in USD, e.g., "$120,000 - $150,000"]

###### RESULT
lower bound: [lower bound of the salary range]
upper bound: [upper bound of the salary range]
confidence: [confidence level]

Please be specific, data-driven, and provide actionable insights.`;

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert HR consultant specializing in compensation analysis and salary benchmarking. Provide detailed, actionable, comprehensive insights based on job posting content with detailed reasoning.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(content);
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream);
  } catch (error) {
    console.error("Error analyzing job posting:", error);
    return new Response(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      { status: 500 }
    );
  }
}
