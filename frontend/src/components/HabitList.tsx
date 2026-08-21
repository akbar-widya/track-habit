import HabitItem from './HabitItem';
import type { Habit, HabitCategory } from '../types/habit';
import { getCurrentWeekDays } from '../utils/date';
import { useState } from 'react';
import { cn } from '../utils/cn';

interface HabitListProps {
  habits: Habit[];
  onToggle: (habitId: string, dateString: string) => void;
  onDelete: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
}

type FilterType = 'All' | HabitCategory;

export default function HabitList({
  habits,
  onToggle,
  onEdit,
  onDelete,
}: HabitListProps) {
  const [filter, setFilter] = useState<FilterType>('All');
  const weekDays = getCurrentWeekDays();

  const filteredHabits = habits.filter(
    (habit) => filter === 'All' || habit.category === filter,
  );

  const tabs: FilterType[] = ['All', 'Health', 'Work', 'Mindset'];

  return (
    <div className="flex flex-col gap-4">
      {/* Category Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              'px-4 py.1.5 text-[13px] font-medium transition-colors border',
              filter === tab
                ? 'bg-primary/10 text-primary border-primary'
                : 'bg-surface text-muted border-border hover:border-muted hover-text-foreground',
            )}
          >
            {tab}
          </button>
        ))}
      </div>
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
          {filteredHabits.length === 0 ? (
            <div className="py-8 text-center text-muted text-sm">
              No habits yet. Add one to get started!
            </div>
          ) : (
            filteredHabits.map((habit) => (
              <HabitItem
                key={habit.id}
                habit={habit}
                weekDays={weekDays}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
