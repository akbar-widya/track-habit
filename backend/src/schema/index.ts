import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

export const habits = sqliteTable(
  "habits",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    frequency: text("frequency").notNull(),
    dailyTarget: integer("daily_target").notNull(),
    unit: text("unit"),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("habits_userId_idx").on(t.userId)],
);

export const habitLogs = sqliteTable(
  "habit_logs",
  {
    habitId: text("habit_id")
      .notNull()
      .references(() => habits.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.habitId, table.date] }),
    };
  },
);

export const habitsRelations = relations(habits, ({ many }) => ({
  logs: many(habitLogs),
}));

export const habitLogsRelations = relations(habitLogs, ({ one }) => ({
  habit: one(habits, {
    fields: [habitLogs.habitId],
    references: [habits.id],
  }),
}));

export * from "./auth-schema";
