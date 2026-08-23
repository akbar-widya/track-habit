import type { Habit } from '../types/habit';

const API_BASE = '/api';

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  error: string;
}

export type NewHabitInput = Omit<Habit, 'id' | 'createdAt' | 'completedDates'>;

function normalizeHabit(raw: Habit): Habit {
  return {
    ...raw,
    unit: raw.unit ?? undefined,
    completedDates: raw.completedDates ?? [],
  };
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  const body = (await res.json()) as ApiSuccess<T> | ApiError;

  if (!res.ok || !body.success) {
    if (res.status === 401) {
      throw new Error('Your session has expired. Please sign in again.');
    }
    const message =
      'error' in body ? body.error : `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return body.data;
}

export async function getHabits(): Promise<Habit[]> {
  const data = await request<Habit[]>('/habits');
  return data.map(normalizeHabit);
}

export async function createHabit(input: NewHabitInput): Promise<Habit> {
  const payload = {
    ...input,
    unit: input.unit === '' ? undefined : input.unit,
  };
  const data = await request<Habit>('/habits', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeHabit(data);
}

export async function deleteHabitApi(id: string): Promise<void> {
  await request(`/habits/${id}`, { method: 'DELETE' });
}

export interface UpdateHabitInput {
  category: Habit['category'];
  frequency: Habit['frequency'];
  dailyTarget: number;
  unit?: string;
}

export async function updateHabitApi(
  id: string,
  input: UpdateHabitInput,
): Promise<void> {
  const payload = { ...input, unit: input.unit === '' ? undefined : input.unit };
  await request(`/habits/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function checkInHabitApi(id: string, date: string): Promise<void> {
  await request(`/habits/${id}/check-in`, {
    method: 'POST',
    body: JSON.stringify({ date }),
  });
}

export async function removeCheckInApi(id: string, date: string): Promise<void> {
  await request(`/habits/${id}/check-in/${date}`, { method: 'DELETE' });
}
