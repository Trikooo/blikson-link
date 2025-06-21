// src/routes/v1.ts
import { Hono } from "hono";
import companyActionValidation from "../middleware/companyActionValidation";
type Env = {
  Variables: {
    provider: string;
  };
};

const v1 = new Hono<Env>();

v1.all("/v1/:company/:action", companyActionValidation, async (c) => {
  const { action } = c.req.param();
  const provider = c.get("provider");
  const module = await import(`../providers/${provider}/${action}.ts`);
  const actionFn = module.default;
  const data = await c.req.json();

  const response = await actionFn(data, c);
  return c.json(response);
});

export default v1;
