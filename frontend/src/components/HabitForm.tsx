import { zodResolver } from '@hookform/resolvers/zod';
import { Brain, Briefcase, Heart, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';
import { cn } from '../utils/cn';
import type { Habit } from '../types/habit';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['Health', 'Work', 'Mindset'] as const),
  frequency: z.enum(['Daily', 'Weekly', 'Monthly'] as const),
  dailyTarget: z.number().min(1),
  unit: z.string().max(25, 'Max 25 characters').optional(),
});

export type HabitFormData = z.infer<typeof formSchema>;

interface HabitFormProps {
  onClose: () => void;
  onSubmitHabit: (data: HabitFormData) => void | Promise<void>;
  initialData?: Habit | null;
}

export default function HabitForm({
  onClose,
  onSubmitHabit,
  initialData,
}: HabitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue } = useForm<HabitFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          category: initialData.category,
          frequency: initialData.frequency,
          dailyTarget: initialData.dailyTarget,
          unit: initialData.unit || '',
        }
      : {
          category: 'Health',
          frequency: 'Daily',
          dailyTarget: 1,
          unit: '',
        },
  });

  const selectedCategory = watch('category');
  const selectedFrequency = watch('frequency');

  const onSubmit = async (data: HabitFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmitHabit(data);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="bg-surface border border-border w-full max-w-md rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2>{initialData ? 'Edit Habit' : 'Add New Habit'}</h2>
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
              disabled={!!initialData}
              placeholder="e.g., Read 10 pages"
              className="bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              autoFocus
            />
            {initialData && (
              <p className="text-[12px] text-muted">
                Habit name can't be changed after creation.
              </p>
            )}
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
                {selectedFrequency} Target
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  {...register('dailyTarget', { valueAsNumber: true })}
                  className="w-16 bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors text-center"
                />
                <input
                  type="text"
                  {...register('unit')}
                  placeholder="e.g. pages, km"
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          {submitError && (
            <p className="text-[13px] text-[#FFB4AB] bg-[#FFB4AB]/10 border border-[#FFB4AB]/30 rounded px-3 py-2">
              {submitError}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-foreground bg-transparent hover:bg-surface-elevated border border-transparent rounded transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-foreground bg-primary hover:bg-primary-hover rounded transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Saving...'
              ) : initialData ? (
                'Save Changes'
              ) : (
                <span>+ Create Habit</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
