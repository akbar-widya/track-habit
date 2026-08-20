import type { Habit } from '../types/habit';
import { getTodayString } from '../utils/date';
import { useLocalStorage } from './useLocalStorage';

export function useHabits() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('habit-data', []);

  const addHabit = (
    habitData: Omit<Habit, 'id' | 'createdAt' | 'completedDates'>,
  ) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    setHabits([...habits, newHabit]);
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
    addHabit,
    toggleHabitCompletion,
    editHabit,
    deleteHabit,
    habitsCompletedToday,
    totalHabits,
  };
}
