import { Flame } from 'lucide-react';
import { cn } from '../utils/cn';
import type { Habit } from '../types/habit';

interface HabitItemProps {
  habit: Habit;
}

export function HabitItem({ habit }: HabitItemProps) {
  const weekDays = [
    { day: 'Mon', status: 'completed' },
    { day: 'Tue', status: 'completed' },
    { day: 'Wed', status: 'today' },
    { day: 'Thu', status: 'upcoming' },
    { day: 'Fri', status: 'upcoming' },
    { day: 'Sat', status: 'upcoming' },
    { day: 'Sun', status: 'upcoming' },
  ];

  return (
    <div className="group flex items-center py-2 border-b border-border last:border-0 hover:bg-background/50 transition-colors">
      {/* Habit Name */}
      <div className="w-[240px] flex-shrink-0">
        <h3 className="text-foreground text-[15px] font-medium tracking-tight">
          {habit.name}
        </h3>
      </div>

      {/* Days Grid */}
      <div className="flex-1 flex items-center justify-between px-2">
        {weekDays.map((d, i) => (
          <button
            key={i}
            className={cn(
              'w-6 h-6 rounded-full border flex items-center justify-center transition-all',
              d.status === 'completed' &&
                'bg-success/10 border-success text-success',
              d.status === 'today' && 'border-primary border-2 bg-transparent',
              d.status === 'upcoming' &&
                'border-border bg-transparent hover:border-muted',
            )}
          >
            {d.status === 'completed' && (
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
        ))}
      </div>

      {/* Metrics */}
      <div className="flex items-center gap-6 w-50 justify-end flex-shrink-0">
        <div className="flex items-center gap-1.5 text-foreground text-[14px]">
          <Flame className="w-4 h-4 text-[#d97721]" />
          <span className="font-semibold">12</span>
          <span className="text-muted text-[12px] font-medium">days</span>
        </div>
        <div className="text-muted text-[12px] font-mono w-10 text-right">
          70%
        </div>
      </div>
    </div>
  );
}
