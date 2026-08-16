import { useState } from 'react';
import HabitList from './components/HabitList';
import type { Habit } from './types/habit';
import HabitForm from './components/HabitForm';

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const mockHabits: Habit[] = [
    {
      id: '1',
      name: 'Read for 30 mins',
      category: 'Mindset',
      frequency: 'Daily',
      dailyTarget: 1,
      createdAt: '',
      completedDates: [],
    },
    {
      id: '2',
      name: 'Morning Yoga',
      category: 'Health',
      frequency: 'Daily',
      dailyTarget: 1,
      createdAt: '',
      completedDates: [],
    },
  ];

  return (
    <div className="min-h-screen selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-border h-16 flex items-center px-6 justify-between bg-background">
        <div className="font-bold tracking-tight">HabitEngine</div>
        <div className="text-sm text-muted">Navigation Placeholder</div>
      </header>

      <main className="max-w-300 mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Date & Add Button */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[32px] font-semibold tracking-tight leading-tight">
              Tuesday, Oct 24
            </h1>
            <p className="text-muted text-[15px] mt-1">
              0/0 habits completed today
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-primary hover:bg-primary-hover text-foreground px-4 py-2 rounded transition-colors font-medium text-sm"
          >
            + Add Habit
          </button>
        </div>

        {/* Habit List */}
        <HabitList habits={mockHabits} />

        {/* Performance Trend Placeholder */}
        <div className="border border-border rounded-lg bg-surface p-8 text-center text-muted border-dashed h-48 flex items-center justify-center">
          [Performance Trend Component Will Go Here]
        </div>

        {isFormOpen && <HabitForm onClose={() => setIsFormOpen(false)} />}
      </main>
    </div>
  );
}
