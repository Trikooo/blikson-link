/**
 * Joins a base URL and an endpoint path, ensuring exactly one slash between them.
 *
 * @param base - The base URL (e.g., "https://api.example.com/")
 * @param path - The endpoint path (e.g., "/get/data")
 * @returns A clean, concatenated URL (e.g., "https://api.example.com/get/data")
 */
export function buildUrl(base: string, path: string): string {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
