import { useCallback, useEffect, useState } from 'react';
import type { Habit } from '../types/habit';
import { getTodayString } from '../utils/date';
import { createHabit, getHabits, type NewHabitInput } from '../api/habits';

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

  const toggleHabitCompletion = (habitId: string, dateString: string) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id !== habitId) return habit;

        const isCompleted = habit.completedDates.includes(dateString);
        const newDates = isCompleted
          ? habit.completedDates.filter((d) => d !== dateString)
          : [...habit.completedDates, dateString];

        return { ...habit, completedDates: newDates };
      }),
    );
  };

  const editHabit = (
    habitId: string,
    updatedData: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>,
  ) => {
    setHabits(
      habits.map((habit) =>
        habit.id === habitId ? { ...habit, ...updatedData } : habit,
      ),
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter((habit) => habit.id !== habitId));
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
