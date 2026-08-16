import { HabitList } from './components/HabitList';
import type { Habit } from './types/habit';

export default function App() {
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
    <div className="min-h-screen selection:bg-accent-indigo/30">
      {/* Header */}
      <header className="border-b border-border h-16 flex items-center px-6 justify-between bg-surface">
        <div className="font-bold tracking-tight">HabitEngine</div>
        <div className="text-sm text-text-secondary">
          Navigation Placeholder
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Date & Add Button */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[32px] font-semibold tracking-tight leading-tight">
              Tuesday, Oct 24
            </h1>
            <p className="text-text-secondary text-[15px] mt-1">
              0/0 habits completed today
            </p>
          </div>
          <button className="bg-accent-indigo hover:bg-[#494bd6] text-text-primary px-4 py-2 rounded transition-colors font-medium text-sm">
            + Add Habit
          </button>
        </div>

        {/* Habit List */}
        <HabitList habits={mockHabits} />

        {/* Performance Trend Placeholder */}
        <div className="border border-border rounded-lg bg-surface-elevated p-8 text-center text-text-secondary border-dashed h-48 flex items-center justify-center">
          [Performance Trend Component Will Go Here]
        </div>
      </main>
    </div>
  );
}
