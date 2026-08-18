export type HabitCategory = 'Health' | 'Work' | 'Mindset';
export type HabitFrequency = 'Daily' | 'Weekly' | 'Monthly';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  dailyTarget: number;
  unit?: string;
  createdAt: string;
  completedDates: string[];
}
