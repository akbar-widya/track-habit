import { Edit2, Flame, Trash2 } from 'lucide-react';
import { cn } from '../utils/cn';
import type { Habit } from '../types/habit';
import { calculateStreak } from '../utils/date';

interface WeekDay {
  dateString: string;
  dayName: string;
  isToday: boolean;
  isFuture: boolean;
}

interface HabitItemProps {
  habit: Habit;
  weekDays: WeekDay[];
  onToggle: (habitId: string, dateString: string) => void;
  onDelete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
}

export default function HabitItem({
  habit,
  weekDays,
  onToggle,
  onDelete,
  onEdit,
}: HabitItemProps) {
  const streak = calculateStreak(habit.completedDates);

  return (
    <div className="group flex items-center py-2 border-b border-border last:border-0 hover:bg-background/50 transition-colors">
      {/* Habit Name, Details & Action Button */}
      <div className="w-85 flex-shrink-0 flex items-center justify-between pr-4">
        <div className="flex flex-col min-w-0">
          <h3 className="text-foreground text-[15px] font-medium tracking-tight line-clamp-2 break-words">
            {habit.name}
          </h3>
          <p className="text-muted text-[12px] mt-0.5 font-medium">
            {habit.frequency}• {habit.dailyTarget} {habit.unit || 'times'}
          </p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(habit)}
            className="text-muted hover:text-foreground transition-colors"
            title="Edit Habit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(habit)}
            className="text-muted hover:text-[#FFB4AB] transition-colors"
            title="Delete Habit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="flex-1 flex items-center justify-between px-2">
        {weekDays.map((d) => {
          const isCompleted = habit.completedDates.includes(d.dateString);

          return (
            <button
              key={d.dateString}
              onClick={() => onToggle(habit.id, d.dateString)}
              disabled={d.isFuture}
              className={cn(
                'w-6 h-6 rounded-full border flex items-center justify-center transition-all',
                d.isFuture && 'opacity-30 cursor-not-allowed',
                !d.isFuture &&
                  !isCompleted &&
                  !d.isToday &&
                  'hover:border-muted',
                isCompleted
                  ? 'bg-success/10 border-success text-success'
                  : d.isToday
                    ? 'border-primary border-2 bg-transparent'
                    : 'border-border bg-transparent hover:border-muted',
              )}
            >
              {isCompleted && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {/* Metrics */}
      <div className="flex items-center justify-end w-25 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-foreground text-[14px]">
          <Flame
            className={cn(
              'w-4 h-4',
              streak > 0 ? 'text-[#d97721]' : 'text-muted',
            )}
          />
          <span className="font-semibold">{streak}</span>
          <span className="text-muted text-[12px] font-medium">days</span>
        </div>
      </div>
    </div>
  );
}
