import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { zValidator } from '@hono/zod-validator';
import { eq, and } from 'drizzle-orm';
import { habits, habitLogs } from './schema/index';
import { createDb } from './db';
import { createAuth, type AuthEnv } from './auth';
import {
  checkInSchema,
  createHabitSchema,
  updateHabitSchema,
} from './validator';

type Bindings = AuthEnv;

type AuthInstance = ReturnType<typeof createAuth>;
type SessionData = NonNullable<
  Awaited<ReturnType<AuthInstance['api']['getSession']>>
>;

type AppEnv = {
  Bindings: Bindings;
  Variables: {
    user: SessionData['user'];
    session: SessionData['session'];
  };
};

type HabitWithDates = {
  id: string;
  name: string;
  category: string;
  frequency: string;
  dailyTarget: number;
  unit: string | null;
  createdAt: string;
  completedDates: string[];
};

const app = new Hono<AppEnv>();

const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const auth = createAuth(c.env);
  const sessionData = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!sessionData) {
    return c.json({ success: false, error: 'Unauthorized' }, 401);
  }

  c.set('user', sessionData.user);
  c.set('session', sessionData.session);
  await next();
});

app.use('/habits', requireAuth);
app.use('/habits/*', requireAuth);

app.get('/', async (c) => {
  return c.json({ message: 'Koneksi Drizzle ke Hono dan D1 berhasil!' });
});

app.get('/habits', async (c) => {
  const user = c.get('user');
  const db = createDb(c.env.DB);

  const rows = await db
    .select()
    .from(habits)
    .leftJoin(habitLogs, eq(habits.id, habitLogs.habitId))
    .where(eq(habits.userId, user.id));

  const habitsMap = new Map<string, HabitWithDates>();

  for (const row of rows) {
    if (!habitsMap.has(row.habits.id)) {
      habitsMap.set(row.habits.id, {
        id: row.habits.id,
        name: row.habits.name,
        category: row.habits.category,
        frequency: row.habits.frequency,
        dailyTarget: row.habits.dailyTarget,
        unit: row.habits.unit,
        createdAt: row.habits.createdAt,
        completedDates: [],
      });
    }

    if (row.habit_logs) {
      habitsMap.get(row.habits.id)!.completedDates.push(row.habit_logs.date);
    }
  }

  return c.json({ success: true, data: Array.from(habitsMap.values()) });
});

app.post('/habits', zValidator('json', createHabitSchema), async (c) => {
  const data = c.req.valid('json');
  const user = c.get('user');
  const db = createDb(c.env.DB);

  const newHabit = await db
    .insert(habits)
    .values({
      id: crypto.randomUUID(),
      userId: user.id,
      name: data.name,
      category: data.category,
      frequency: data.frequency,
      dailyTarget: data.dailyTarget,
      unit: data.unit ?? null,
      createdAt: new Date().toISOString(),
    })
    .returning();

  return c.json(
    { success: true, data: { ...newHabit[0], completedDates: [] } },
    201,
  );
});

app.patch('/habits/:id', zValidator('json', updateHabitSchema), async (c) => {
  const { id } = c.req.param();
  const data = c.req.valid('json');
  const user = c.get('user');
  const db = createDb(c.env.DB);

  if (Object.keys(data).length === 0) {
    return c.json({ success: false, error: 'No fields to update' }, 400);
  }

  const updated = await db
    .update(habits)
    .set(data)
    .where(and(eq(habits.id, id), eq(habits.userId, user.id)))
    .returning();

  if (updated.length === 0) {
    return c.json({ success: false, error: 'Habit not found' }, 404);
  }

  return c.json({ success: true, data: updated[0] });
});

app.delete('/habits/:id', async (c) => {
  const { id } = c.req.param();
  const user = c.get('user');
  const db = createDb(c.env.DB);

  const deleted = await db
    .delete(habits)
    .where(and(eq(habits.id, id), eq(habits.userId, user.id)))
    .returning();

  if (deleted.length === 0) {
    return c.json({ success: false, error: 'Habit not found' }, 404);
  }

  return c.json({ success: true, data: deleted[0] });
});

app.post(
  '/habits/:id/check-in',
  zValidator('json', checkInSchema),
  async (c) => {
    const { id } = c.req.param();
    const { date } = c.req.valid('json');
    const user = c.get('user');
    const db = createDb(c.env.DB);

    const habit = await db
      .select({ id: habits.id })
      .from(habits)
      .where(and(eq(habits.id, id), eq(habits.userId, user.id)));

    if (habit.length === 0) {
      return c.json({ success: false, error: 'Habit not found' }, 404);
    }

    const inserted = await db
      .insert(habitLogs)
      .values({ habitId: id, date })
      .onConflictDoNothing()
      .returning();

    if (inserted.length === 0) {
      return c.json(
        { success: false, error: `Already checked in on ${date}` },
        409,
      );
    }

    return c.json({ success: true, data: inserted[0] }, 201);
  },
);

app.delete('/habits/:id/check-in/:date', async (c) => {
  const { id, date } = c.req.param();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return c.json(
      { success: false, error: 'Date must be in YYYY-MM-DD format' },
      400,
    );
  }

  const user = c.get('user');
  const db = createDb(c.env.DB);

  const ownedHabit = await db
    .select({ id: habits.id })
    .from(habits)
    .where(and(eq(habits.id, id), eq(habits.userId, user.id)));

  if (ownedHabit.length === 0) {
    return c.json(
      { success: false, error: `No check-in found on ${date}` },
      404,
    );
  }

  const deleted = await db
    .delete(habitLogs)
    .where(and(eq(habitLogs.habitId, id), eq(habitLogs.date, date)))
    .returning();

  if (deleted.length === 0) {
    return c.json(
      { success: false, error: `No check-in found on ${date}` },
      404,
    );
  }

  return c.json({ success: true, data: deleted[0] });
});

const worker = new Hono<{ Bindings: Bindings }>();

worker.on(['POST', 'GET'], '/api/auth/*', (c) =>
  createAuth(c.env).handler(c.req.raw),
);

worker.route('/api', app);

export default worker; 