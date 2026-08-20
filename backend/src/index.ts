import { Hono } from "hono";
import { createDb } from "./db";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", async (c) => {
  const db = createDb(c.env.DB);

  return c.json({ message: "Koneksi Drizzle ke Hono dan D1 berhasil!" });
});

export default app;
