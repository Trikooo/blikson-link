import type { Context, Next } from "hono";
import type { ZodIssue } from "zod";
import type { AppBindings } from "@/types/api-types";
import { join } from "node:path";
import { companies } from "@/config/companies";
import {
  ActionNotFoundException,
  CompanyNotFoundException,
  InternalServerException,
  MethodNotAllowedException,
  ValidationException,
} from "@/errors/api-errors";
import { resolveActionModule } from "@/utils/resolve-action-module";

/**
 * Middleware to validate the company and action parameters, load the action module,
 * check HTTP method support, and bind the action function and metadata to the context.
 * Throws appropriate exceptions for missing parameters, unknown actions, unsupported methods, or misconfigured modules.
 *
 * @param c - Hono context
 * @param next - Next middleware function
 */
export default async function validateCompanyAction(
  c: Context<AppBindings>,
  next: Next,
) {
  const { company, actionChain } = c.req.param();
  const method = c.req.method;

  validateRequiredParams(company, actionChain);

  const provider = companies[company!]?.provider;
  if (!provider) {
    throw new CompanyNotFoundException(company!);
  }
  c.set("provider", provider);
  c.set("company", company!);
  c.set("companyMetadata", companies[company]);

  const [model, ...actionSegments] = actionChain!.split(".");
  const actionModule = await loadActionModule(
    provider,
    model,
    actionSegments,
    actionChain!,
  );
  validateMethodAndBindContext(c, actionModule, method);

  await next();
}

/**
 * Validates that required parameters are present. Throws a ValidationException with ZodIssue(s) if any are missing.
 *
 * @param company - The company parameter from the request
 * @param actionChain - The actionChain parameter from the request
 */
function validateRequiredParams(
  company: string | undefined,
  actionChain: string | undefined,
) {
  const issues: ZodIssue[] = [];
  if (!company) {
    issues.push({
      code: "custom",
      message: "company parameter is required",
      path: ["company"],
    });
  }
  if (!actionChain) {
    issues.push({
      code: "custom",
      message: "actionChain parameter is required",
      path: ["actionChain"],
    });
  }
  if (issues.length)
    throw new ValidationException(issues);
}

/**
 * Resolves and imports the action module for the given provider, model, and action segments.
 * Throws ActionNotFoundException if the module cannot be found or loaded.
 *
 * @param provider - The provider name
 * @param model - The model name
 * @param actionSegments - Array of action/subaction segments
 * @param modelAction - The full model.action string (for error reporting)
 * @returns The imported action module
 */
async function loadActionModule(
  provider: string,
  model: string,
  actionSegments: string[],
  modelAction: string,
) {
  const basePath = join(__dirname, `../apis/${provider}/models/${model}`);
  try {
    const actionPath = resolveActionModule(basePath, actionSegments);
    return await import(actionPath);
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  catch (err) {
    throw new ActionNotFoundException(modelAction);
  }
}

/**
 * Validates the HTTP method against the action module's metadata, binds the action function and metadata to the context.
 * Throws InternalServerException if the handler or metadata is missing, or MethodNotAllowedException if the method is not supported.
 *
 * @param c - Hono context
 * @param actionModule - The imported action module
 * @param method - The HTTP method of the request
 */
function validateMethodAndBindContext(
  c: Context<AppBindings>,
  actionModule: any,
  method: string,
) {
  const actionFn = actionModule.default;
  const metadata = actionModule.metadata;
  if (!actionFn) {
    throw new InternalServerException(
      "Action handler (default export) missing in action module",
    );
  }
  if (!metadata) {
    throw new InternalServerException(
      "Action metadata (metadata export) missing in action module",
    );
  }
  if (metadata && method !== metadata.method) {
    throw new MethodNotAllowedException(method, metadata.method);
  }
  c.set("actionFn", actionFn);
  c.set("actionMetadata", metadata);
}
