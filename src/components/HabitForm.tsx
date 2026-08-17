import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Briefcase, Heart, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '../utils/cn';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['Health', 'Work', 'Mindset'] as const),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly'] as const),
  dailyTarget: z.number().min(1),
});

type FormData = z.infer<typeof formSchema>;

interface HabitFormProps {
  onClose: () => void;
  onSubmitHabit: (data: FormData) => void;
}

export default function HabitForm({ onClose, onSubmitHabit }: HabitFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: 'Health',
      frequency: 'Daily',
      dailyTarget: 1,
    },
  });

  const selectedCategory = watch('category');

  const onSubmit = (data: FormData) => {
    onSubmitHabit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="bg-surface border border-border w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2>Add New Habit</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-5 flex flex-col gap-6"
        >
          {/* Habit Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">
              Habit Name
            </label>
            <input
              {...register('name')}
              placeholder="e.g., Read 10 pages"
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">
              Category
            </label>
            <div className="flex gap-3">
              {(['Health', 'Work', 'Mindset'] as const).map((cat) => {
                const Icon =
                  cat === 'Health' ? Heart : cat === 'Work' ? Briefcase : Brain;
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() =>
                      setValue('category', cat, { shouldValidate: true })
                    }
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded border text-sm transition-colors',
                      isActive
                        ? 'border-primary text-primary bg-primary/10'
                        : 'border-border text-muted hover:border-muted',
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frequency & Target */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                Frequency
              </label>
              <select
                {...register('frequency')}
                className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                Daily Target
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register('dailyTarget', { valueAsNumber: true })}
                  className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors w-full"
                />
                <span className="absolute right-3 top-2 text-sm text-muted font-mono">
                  times
                </span>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-4 text-sm font-medium text-foreground bg-transparent hover:bg-surface-elevated border border-transparent rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-foreground bg-primary hover:bg-primary-hover rounded transition-colors flex items-center gap-1"
            >
              <span>+</span> Create Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
