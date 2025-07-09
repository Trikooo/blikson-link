import type { AppBindings } from "@/types/api-types";
import { Hono } from "hono";
import validateProviderHeaders from "@/middleware/provider-headers";
import validateCompanyAction from "@/middleware/validate-company-action";
import { normalizeSuccessResponse } from "@/utils/response";

const v1 = new Hono<AppBindings>();

v1.all(
  "/v1/:company/:actionChain/:id?",
  validateCompanyAction,
  validateProviderHeaders,
  async (c) => {
    const actionFn = c.get("actionFn");
    const response = await actionFn(c);
    const normalizedResponse = normalizeSuccessResponse<typeof response>(
      c,
      response,
    );
    return c.json(normalizedResponse);
  },
);

export default v1;
