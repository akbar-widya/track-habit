import { useState } from 'react';
import type { Habit } from '../types/habit';

interface HabitFormProps {
  onSubmit: (habit: Omit<Habit, 'id'>) => void;
  onCancel?: () => void;
}

export const HabitForm = ({ onSubmit, onCancel }: HabitFormProps) => {
  const [name, setName] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      completed: false,
    });
    setName('');
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-[#23272F] bg-[#16191E] p-4"
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="habit-name"
          className="text-xs font-medium text-[#8A8F98]"
        >
          Habit Name
        </label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Read for 30 mins"
          className="h-9 w-full rounded border border-[#23272F] bg-[#0D0F12] px-3 text-sm font-medium text-white placeholder-[#4B515D] transition-colors focus:border-[#6366F1] focus:outline-none"
          autoFocus
        />
      </div>

      <div className="flex">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="h-8 rounded border border-[#23272F] px-3 text-xs font-medium text-[#8A8F98] transition-colors hover:border-[#333538] hover:text-white focus:outline-none"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={!name.trim()}
          className="h-8 rounded bg-[#6366F1] px-3 text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default HabitForm;
