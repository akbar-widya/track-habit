import { format, startOfDay, subDays } from 'date-fns';
import type { Habit } from '../types/habit';
import { cn } from '../utils/cn';

interface PerformanceTrendProps {
  habits: Habit[];
}

export default function PerformanceTrend({ habits }: PerformanceTrendProps) {
  const today = startOfDay(new Date());
  const last28Days = Array.from({ length: 28 }).map((_, i) => {
    const date = subDays(today, 27 - i);
    const dateStr = format(date, 'yyyy-MM-dd');

    const completedCount = habits.filter((h) =>
      h.completedDates.includes(dateStr),
    ).length;

    return { date, dateStr, completedCount };
  });

  const weeklyData = [
    last28Days.slice(0, 7).reduce((acc, day) => acc + day.completedCount, 0),
    last28Days.slice(8, 14).reduce((acc, day) => acc + day.completedCount, 0),
    last28Days.slice(15, 21).reduce((acc, day) => acc + day.completedCount, 0),
    last28Days.slice(21, 28).reduce((acc, day) => acc + day.completedCount, 0),
  ];

  const maxWeekly = Math.max(...weeklyData, 1); // Avoid division by zero

  // Helper to determine heatmap square color based on intensity
  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-[#1C1F26 border-[#23272F]';
    if (count === 1) return 'bg-success/40 border-success/20';
    if (count === 2) return 'bg-success/70 border-success/40';
    return 'bg-success border-success/60';
  };

  return (
    <div className="border border-border rounded-lg bg-surface p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-foreground text-[16px] font-semibold tracking-tight">
          Performance Trend
        </h2>
        <span className="text-muted text-[11px] font-semibold uppercase tracking-wider">
          Last 4 Weeks
        </span>
      </div>

      <div className="grid grid-cols-2 gap-12">
        {/* Left: Activity Heatmap */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
              Activity Heatmap
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-muted">
              <span>Low</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-[#1C1F26] border border-border"></div>
                <div className="w-3 h-3 rounded-sm bg-success/40 border border-success/20"></div>
                <div className="w-3 h-3 rounded-sm bg-success/70 border border-success/40"></div>
                <div className="w-3 h-3 rounded-sm bg-success border border-success/60"></div>
              </div>
              <span>High</span>
            </div>
          </div>

          {/* Heatmap Grid (4 rows x 7 cols) */}
          <div className="grid grid-cols-7 gap-2">
            {last28Days.map((day) => (
              <div
                key={day.dateStr}
                title={`${day.dateStr}: ${day.completedCount} habits`}
                className={cn(
                  'aspect-square rounded border transition-colors',
                  getIntensityClass(day.completedCount),
                )}
              />
            ))}
          </div>
        </div>

        {/* Right: Weekly Completion Bar Chart */}
        <div className='flex flex-col h-full'>
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block mb-4">
            Weekly Completion
          </span>
          <div className="flex items-end gap-4 flex-1 pb-2 border-b border-border">
            {weeklyData.map((count, index) => {
              const height = `${(count / maxWeekly) * 100}%`;
              const isCurrentWeek = index === 3;

              return (
                <div className="flex-1 flex flex-col justify-end h-full group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1C1F26] text-foreground text-[11px] py-1 px-2 rounded border border-border pointer-events-none">
                    {count} total
                  </div>

                  {/* Bar */}
                  <div
                    className={cn(
                      'w-full rounded-t transition-all',
                      isCurrentWeek
                        ? 'bg-primary'
                        : 'bg-[#1C1F26] hover:bg-border',
                    )}
                    style={{ height: count > 0 ? height : '4px' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
