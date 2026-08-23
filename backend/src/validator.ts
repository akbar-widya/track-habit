import { z } from "zod";

const DATE_FORMAT = "YYYY-MM-DD";

function toUtcDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function shiftUtcDateString(days: number): string {
  const shifted = new Date();
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return toUtcDateString(shifted);
}

export const checkInDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, `Date must be in ${DATE_FORMAT} format`)
  .refine((date) => !Number.isNaN(new Date(`${date}T00:00:00Z`).getTime()), {
    message: "Invalid calendar date",
  })
  .refine((date) => date <= shiftUtcDateString(1), {
    message: "Cannot check in for a future date",
  })
  .refine((date) => date >= shiftUtcDateString(-7), {
    message: "Date must be within the last 7 days",
  });

export const checkInSchema = z.object({
  date: checkInDateSchema,
});

export const createHabitSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["Health", "Work", "Mindset"]),
  frequency: z.enum(["Daily", "Weekly", "Monthly"]),
  dailyTarget: z.number().positive(),
  unit: z.string().optional(),
});

export const updateHabitSchema = createHabitSchema.partial();

export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
