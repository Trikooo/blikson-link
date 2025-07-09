import type { AppBindings } from "@/types/api-types";
import { Hono } from "hono";
import { startServer } from "@/app";
import client from "@/utils/request";

const app = new Hono<AppBindings>();

app.get("/timeout", async (c) => {
  try {
    const response = await client.get("http://localhost:3005", {
      timeout: 1000,
    });
    return c.json({ data: response.data });
  }
  catch (error: any) {
    if (error.code === "ECONNABORTED") {
      return c.json({ error: error.code }, 504);
    }
    else {
      return c.json({ error: error.message }, 500);
    }
  }
});
startServer(app, 3002, 10);
