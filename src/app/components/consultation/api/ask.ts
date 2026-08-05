/**
 * ask.ts — Q&A Turn / Document Grounded Inquiry API Mock
 * ---------------------------------------------------------
 * Future implementation:
 *   return fetch("/api/v1/ask", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ question, filename, summary, categoryLabel }),
 *   }).then(r => r.json());
 */

export interface AskContext {
  filename: string | null;
  summary: string | null;
  categoryLabel: string | null;
}

export interface AskResponse {
  success: boolean;
  answer: string;
}

export function askAboutDocument(
  question: string,
  context: AskContext
): Promise<AskResponse> {
  const q = (question || "").toLowerCase();
  const doc = context && context.filename ? '"' + context.filename + '"' : "this document";
  let answer: string;

  if (q.includes("risk")) {
    answer =
      "The main risk areas in " +
      doc +
      " are around liability limitation and termination for cause — those clauses are worth a closer read before signing.";
  } else if (q.includes("obligat")) {
    answer =
      "Both parties in " +
      doc +
      " have defined obligations: performance of the agreed scope, timely payment or compensation, and maintaining confidentiality throughout the term.";
  } else if (
    q.includes("date") ||
    q.includes("term") ||
    q.includes("deadline") ||
    q.includes("expire")
  ) {
    answer =
      "The term structure in " +
      doc +
      " follows a standard start date, a defined duration, and renewal or termination notice periods — check the definitions section for exact dates.";
  } else if (q.includes("clause")) {
    answer =
      "The notable clauses in " +
      doc +
      " cover scope of engagement, confidentiality, liability limitation, and dispute resolution, alongside the standard governing-law clause.";
  } else if (q.includes("summary") || q.includes("summarize")) {
    answer =
      context && context.summary
        ? context.summary
        : "Here's a recap of the document summary I generated earlier.";
  } else {
    answer =
      "Based on " +
      doc +
      (context && context.categoryLabel
        ? " (classified as " + context.categoryLabel + ")"
        : "") +
      ", I can walk you through its clauses, obligations, key dates, or risk areas — just ask.";
  }

  return new Promise((resolve) => {
    setTimeout(
      () => resolve({ success: true, answer }),
      700 + Math.random() * 700
    );
  });
}
