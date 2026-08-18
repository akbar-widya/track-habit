import { useState } from 'react';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import { format } from 'date-fns';
import { useHabits } from './hooks/useHabits';

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const {
    habits,
    addHabit,
    toggleHabitCompletion,
    deleteHabit,
    habitsCompletedToday,
    totalHabits,
  } = useHabits();

  const todayLabel = format(new Date(), 'EEE, MMM d');

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
              {todayLabel}
            </h1>
            <p className="text-muted text-[15px] mt-1">
              {habitsCompletedToday}/{totalHabits} habits completed today
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
        <HabitList
          habits={habits}
          onToggle={toggleHabitCompletion}
          onDelete={deleteHabit}
        />

        {/* Performance Trend Placeholder */}
        <div className="border border-border rounded-lg bg-surface p-8 text-center text-muted border-dashed h-48 flex items-center justify-center">
          [Performance Trend Component Will Go Here]
        </div>

        {isFormOpen && (
          <HabitForm
            onClose={() => setIsFormOpen(false)}
            onSubmitHabit={addHabit}
          />
        )}
      </main>
    </div>
  );
}
