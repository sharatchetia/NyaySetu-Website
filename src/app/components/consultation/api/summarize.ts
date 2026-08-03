/**
 * summarize.ts — Gemini Summarization API Mock
 * ---------------------------------------------------------
 * Future implementation:
 *   return fetch("/api/v1/summarize", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ documentId }),
 *   }).then(r => r.json());
 */

export interface SummarizeResponse {
  success: boolean;
  summary: string;
  wordCount: number;
}

export function summarizeDocument(file: File): Promise<SummarizeResponse> {
  const mockSummary =
    "This agreement outlines the terms between the two named parties, including " +
    "scope of engagement, compensation, term and termination conditions, " +
    "confidentiality obligations, and dispute resolution procedures. Key " +
    "obligations are clearly defined for both parties, with standard clauses " +
    "covering liability limitation and governing law.";

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        summary: mockSummary,
        wordCount: mockSummary.split(" ").length,
      });
    }, 1400);
  });
}
