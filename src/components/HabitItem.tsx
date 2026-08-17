import { Flame } from 'lucide-react';
import { cn } from '../utils/cn';
import type { Habit } from '../types/habit';
import { calculateStreak } from '../utils/date';

interface WeekDay {
  dateString: string;
  dayName: string;
  isToday: boolean;
}

interface HabitItemProps {
  habit: Habit;
  weekDays: WeekDay[];
  onToggle: (habitId: string, dateString: string) => void;
}

export default function HabitItem({
  habit,
  weekDays,
  onToggle,
}: HabitItemProps) {
  const streak = calculateStreak(habit.completedDates);

  const completedThisWeek = weekDays.filter((d) =>
    habit.completedDates.includes(d.dateString),
  ).length;
  const progressPercentage = Math.round((completedThisWeek / 7) * 100);

  return (
    <div className="group flex items-center py-2 border-b border-border last:border-0 hover:bg-background/50 transition-colors">
      {/* Habit Name */}
      <div className="w-60 flex-shrink-0">
        <h3 className="text-foreground text-[15px] font-medium tracking-tight">
          {habit.name}
        </h3>
      </div>

      {/* Days Grid */}
      <div className="flex-1 flex items-center justify-between px-2">
        {weekDays.map((d) => {
          const isCompleted = habit.completedDates.includes(d.dateString);

          return (
            <button
              key={d.dateString}
              onClick={() => onToggle(habit.id, d.dateString)}
              className={cn(
                'w-6 h-6 rounded-full border flex items-center justify-center transition-all',
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
      <div className="flex items-center gap-6 w-50 justify-end flex-shrink-0">
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
        <div className="text-muted text-[12px] font-mono w-10 text-right">
          {progressPercentage}%
        </div>
      </div>
    </div>
  );
}
