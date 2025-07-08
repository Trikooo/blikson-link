import { Context, Next } from "hono";
import { companies } from "@/config/companies";
import { actions } from "@/config/actions";
import { CompanyNotFoundException } from "@/errors/api-errors";
import { AppBindings } from "@/types/api-types";

export default async function companyActionValidation(
  c: Context<AppBindings>,
  next: Next
) {
  const { company, action } = c.req.param();
  const method = c.req.method;

  if (!company) {
    return c.json(
      { success: false, error: "Company parameter is required" },
      400
    );
  }

  const provider = companies[company]?.provider;
  if (!provider) {
    throw new CompanyNotFoundException(company);
  }
  c.set("provider", provider);
  c.set("company", company);
  // if (!action) {
  //   return c.json(
  //     { success: true, data: { actionList: actions[provider] } },
  //     200
  //   );
  // }

  // const actionMethod = actions[provider][action].method;
  // if (!actionMethod) {
  //   return c.json({ success: false, error: "Action not supported" }, 400);
  // }

  // if (method !== actionMethod) {
  //   return c.json(
  //     {
  //       success: false,
  //       error: `Method not allowed. Please use a ${actionMethod} request`,
  //     },
  //     405
  //   );
  // }

  // All good — continue
  await next();
}
