import HabitItem from './HabitItem';
import type { Habit } from '../types/habit';
import { getCurrentWeekDays } from '../utils/date';

interface HabitListProps {
  habits: Habit[];
  onToggle: (habitId: string, dateString: string) => void;
}

export default function HabitList({ habits, onToggle }: HabitListProps) {
  const weekDays = getCurrentWeekDays();

  return (
    <div className="border border-border rounded-lg bg-surface overflow-hidden">
      {/* Header Row */}
      <div className="flex items-center py-3 px-4 border-b border-border text-[11px] font-semibold text-muted uppercase tracking-wider">
        <div className="w-60">Habit</div>
        <div className="flex-1 flex justify-between px-2">
          {weekDays.map(({ dayName }) => (
            <div key={dayName} className="w-6 text-center">
              {dayName}
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
        {habits.length === 0 ? (
          <div className="py-8 text-center text-muted text-sm">
            No habits yet. Add one to get started!
          </div>
        ) : (
          habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              weekDays={weekDays}
              onToggle={onToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}
