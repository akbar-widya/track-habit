import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { habits } from "./habits";

export const habitLogs = sqliteTable("habit_logs", {
  id: text("id").primaryKey(),
  habitId: text("habit_id")
    .notNull()
    .references(() => habits.id, { onDelete: "cascade" }), // Jika habit dihapus, log juga terhapus
  date: text("date").notNull(), // Format 'yyyy-MM-dd'
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
});
