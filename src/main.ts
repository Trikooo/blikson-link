import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Scalar } from "@scalar/hono-api-reference";
import { getBaseUrl } from "@/lib/env";
import v1 from "@/routes/v1";
import css from "@/utils/test-css";
import createApp from "./app";

const app = createApp();

app.get("/", (c) => {
  return c.json({
    name: "Blikson Link API",
    version: "v1",
    message:
      "Refer to /v1/:company/:action to interact with delivery companies.",
    documentations: `${getBaseUrl()}/v1/docs`,
  });
});

// Mount v1 routes
app.route("/", v1);

// Serve the OpenAPI YAML spec at /v1/openapi.yaml
app.get("/v1/openapi.yaml", (c) => {
  const yaml = readFileSync(join(process.cwd(), "spec.yaml"), "utf8");
  return c.text(yaml, 200, { "Content-Type": "application/yaml" });
});

// Serve Scalar API Reference at /v1/docs
app.use(
  "/v1/docs/*",
  Scalar({
    defaultHttpClient: {
      targetKey: "node",
      clientKey: "axios",
    },
    customCss: css,
    hideClientButton: true,
    theme: "saturn",
    url: "/v1/openapi.yaml",
  }),
);

// app.get("/timeout", async (c) => {
//   try {
//     const response = await client.get("http://localhost:3005");
//     return c.json({ data: response.data });
//   } catch (error) {
//     return c.json({ error: error });
//   }
// });
// // timeout-server.js
// import http from "http";
// import client from "./utils/request";

// const server = http.createServer((req, res) => {
//   // Simulate a timeout: do nothing
// });

// server.listen(3005, () => {
//   console.log("Timeout server running on http://localhost:3005");
// });
