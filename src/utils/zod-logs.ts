import { ZodError } from "zod";

/**
 * Logs a minimal version of Zod validation errors.
 * Example: [{ path: "user.email", message: "Invalid email" }]
 */
export function logZodIssues(error: unknown, context: string = "Zod validation error") {
  if (error instanceof ZodError) {
    const issues = error.errors.map(issue => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    console.warn(`${context}:`, issues);
  }
}
