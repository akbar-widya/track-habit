import { useState } from 'react';
import HabitList from './components/HabitList';
import HabitForm from './components/HabitForm';
import type { HabitFormData } from './components/HabitForm';
import ConfirmDialog from './components/ConfirmDialog';
import AuthModal from './components/AuthModal';
import { format } from 'date-fns';
import { useHabits } from './hooks/useHabits';
import PerformanceTrend from './components/PerformanceTrend';
import type { Habit } from './types/habit';
import { authClient } from './lib/auth-client';

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const user = session?.user;
  const {
    habits,
    loading,
    error,
    refresh,
    addHabit,
    toggleHabitCompletion,
    editHabit,
    deleteHabit,
    habitsCompletedToday,
    totalHabits,
  } = useHabits();

  const handleFormSubmit = async (data: HabitFormData) => {
    if (editingHabit) {
      await editHabit(editingHabit.id, {
        category: data.category,
        frequency: data.frequency,
        dailyTarget: data.dailyTarget,
        unit: data.unit,
      });
    } else {
      await addHabit(data);
    }
  };

  const openEditForm = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (habit: Habit) => {
    setHabitToDelete(habit);
  };

  const handleConfirmDelete = async () => {
    if (!habitToDelete) return;
    await deleteHabit(habitToDelete.id);
    setHabitToDelete(null);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingHabit(null);
  };

  const todayLabel = format(new Date(), 'EEE, MMM d');

  return (
    <div className="min-h-screen selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-border h-16 flex items-center px-6 justify-between bg-background">
        <div className="font-bold tracking-tight">HabitEngine</div>
        {isSessionLoading ? null : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">
              {user.name || user.email}
            </span>
            <button
              onClick={() => authClient.signOut()}
              className="text-sm font-medium text-foreground bg-transparent hover:bg-surface-elevated border border-border rounded px-3 py-1.5 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAuthOpen(true)}
            className="bg-primary hover:bg-primary-hover text-foreground px-4 py-2 rounded transition-colors font-medium text-sm"
          >
            Log In
          </button>
        )}
      </header>

      <main className="max-w-300 mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Date & Add Button */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[32px] font-semibold tracking-tight leading-tight">
              {todayLabel}
            </h1>
            <p className="text-muted text-[15px] mt-1">
              {habitsCompletedToday}/{totalHabits} habits completed today
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-primary hover:bg-primary-hover text-foreground px-4 py-2 rounded transition-colors font-medium text-sm"
          >
            + Add Habit
          </button>
        </div>

        {/* Habit List */}
        {error && (
          <div className="flex items-center justify-between border border-[#FFB4AB]/30 bg-[#FFB4AB]/10 text-[#FFB4AB] rounded px-4 py-3 text-sm">
            <span>{error}</span>
            <button
              onClick={refresh}
              className="font-medium hover:underline"
            >
              Retry
            </button>
          </div>
        )}
        {loading ? (
          <div className="border border-border rounded-lg bg-surface py-8 text-center text-muted text-sm">
            Loading habits...
          </div>
        ) : (
          <HabitList
            habits={habits}
            onToggle={toggleHabitCompletion}
            onEdit={openEditForm}
            onDelete={openDeleteDialog}
          />
        )}

        {/* Performance Trend Placeholder */}
        <PerformanceTrend habits={habits} />

        {isFormOpen && (
          <HabitForm
            onClose={closeForm}
            onSubmitHabit={handleFormSubmit}
            initialData={editingHabit}
          />
        )}

        {isAuthOpen && <AuthModal onClose={() => setIsAuthOpen(false)} />}

        {habitToDelete && (
          <ConfirmDialog
            title="Delete Habit"
            message={`Are you sure you want to delete "${habitToDelete.name}"? This will permanently remove the habit and all of its check-in logs.`}
            confirmLabel="Delete"
            onConfirm={handleConfirmDelete}
            onCancel={() => setHabitToDelete(null)}
          />
        )}
      </main>
    </div>
  );
}
