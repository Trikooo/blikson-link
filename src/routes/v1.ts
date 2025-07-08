import { Hono } from "hono";
import companyActionValidation from "@/middleware/company-action-validation";
import { AppBindings } from "@/types/api-types";
import validateProviderHeaders from "@/middleware/provider-headers";
import { normalizeSuccessResponse } from "@/utils/response";

const v1 = new Hono<AppBindings>();

v1.all(
  "/v1/:company/:model.action/:id?",
  companyActionValidation,
  validateProviderHeaders,
  async (c) => {
    const provider = c.get("provider");
    const [model, action] = c.req.param("model.action").split(".");
    const module = await import(
      `@/apis/${provider}/models/${model}/${action}.ts`
    );
    const actionFn = module.default;
    const response = await actionFn(c);
    const normalizedResponse = normalizeSuccessResponse<typeof response>(
      c,
      response
    );
    return c.json(normalizedResponse);
  }
);

export default v1;
