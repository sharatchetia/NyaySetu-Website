/**
 * upload.ts — FastAPI Upload Endpoint Mock
 * ---------------------------------------------------------
 * Future implementation:
 *   const form = new FormData();
 *   form.append("file", file);
 *   return fetch("/api/v1/upload", { method: "POST", body: form }).then(r => r.json());
 */

export interface UploadReceipt {
  success: boolean;
  documentId: string;
  filename: string;
  sizeBytes: number;
  uploadedAt: string;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return value.toFixed(1) + " " + units[unitIndex];
}

export function uploadDocument(file: File): Promise<UploadReceipt> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        documentId: "doc_" + Math.random().toString(36).slice(2, 10),
        filename: file.name,
        sizeBytes: file.size,
        uploadedAt: new Date().toISOString(),
      });
    }, 900);
  });
}

export function simulateProgress(
  onProgress: (pct: number) => void
): Promise<void> {
  return new Promise((resolve) => {
    let pct = 0;
    const timer = setInterval(() => {
      pct = Math.min(pct + Math.random() * 20 + 10, 96);
      onProgress(pct);
      if (pct >= 96) {
        clearInterval(timer);
        setTimeout(() => {
          onProgress(100);
          resolve();
        }, 350);
      }
    }, 160);
  });
}
