import { useCallback, useEffect, useState } from 'react';
import type { Habit } from '../types/habit';
import { getTodayString } from '../utils/date';
import {
  checkInHabitApi,
  createHabit,
  deleteHabitApi,
  getHabits,
  removeCheckInApi,
  updateHabitApi,
  type NewHabitInput,
  type UpdateHabitInput,
} from '../api/habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await getHabits();
      setHabits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addHabit = async (habitData: NewHabitInput): Promise<Habit> => {
    const created = await createHabit(habitData);
    setHabits((prev) => [...prev, created]);
    return created;
  };

  const toggleHabitCompletion = async (
    habitId: string,
    dateString: string,
  ) => {
    const isCompleted =
      habits
        .find((habit) => habit.id === habitId)
        ?.completedDates.includes(dateString) ?? false;

    const applyToggle = (list: Habit[]) =>
      list.map((habit) => {
        if (habit.id !== habitId) return habit;
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter((d) => d !== dateString)
            : [...habit.completedDates, dateString],
        };
      });

    setHabits(applyToggle);

    try {
      if (isCompleted) {
        await removeCheckInApi(habitId, dateString);
      } else {
        await checkInHabitApi(habitId, dateString);
      }
    } catch (err) {
      setHabits(applyToggle);
      setError(
        err instanceof Error ? err.message : 'Failed to sync check-in',
      );
    }
  };

  const editHabit = async (habitId: string, updatedData: UpdateHabitInput) => {
    await updateHabitApi(habitId, updatedData);
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, ...updatedData } : habit,
      ),
    );
  };

  const deleteHabit = async (habitId: string) => {
    await deleteHabitApi(habitId);
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  };

  const today = getTodayString();
  const habitsCompletedToday = habits.filter((h) =>
    h.completedDates.includes(today),
  ).length;
  const totalHabits = habits.length;

  return {
    habits,
    loading,
    error,
    refresh,
    addHabit,
    toggleHabitCompletion,
    editHabit,
    deleteHabit,
    habitsCompletedToday,
    totalHabits,
  };
}
