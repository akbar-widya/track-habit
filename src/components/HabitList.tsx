import HabitItem from './HabitItem';
import type { Habit } from '../types/habit';

interface HabitListProps {
  habits: Habit[];
}

export default function HabitList({ habits }: HabitListProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      {/* Header Row */}
      <div className="flex items-center py-3 px-4 border-b border-border text-[11px] font-semibold text-muted uppercase tracking-wider">
        <div className="w-60">Habit</div>
        <div className="flex-1 flex justify-between px-2">
          {days.map((day) => (
            <div key={day} className="w-6 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="w-50 flex justify-end gap-10 pr-2">
          <span>Streak</span>
          <span>Progress</span>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col px-4">
        {habits.map((habit) => (
          <HabitItem key={habit.id} habit={habit} />
        ))}
      </div>
    </div>
  );
}
