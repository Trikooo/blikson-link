import { Hono } from "hono";
import v1 from "./routes/v1";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    name: "Blikson Link API",
    version: "v1",
    message:
      "Welcome to the Blikson Link API. Refer to /v1/:company/:action to interact with delivery companies.",
    documentations: "link to docs",
  });
});

// Mount v1 routes
app.route("/", v1);

export default app;
