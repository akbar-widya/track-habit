import { useEffect, useState } from 'react';
import HabitList from './components/HabitList';
import type { Habit } from './types/habit';
import AddHabitButton from './components/AddHabitButton';
import HabitForm from './components/HabitForm';

// fetch habit storage one time, feeds all other components

const App = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('habits');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const handleAddHabit = (habitData: Omit<Habit, 'id'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
    };
    setHabits((prev) => [...prev, newHabit]);
    setIsModalOpen(false);
  };
  return (
    <div className="min-h-screen bg-[#0D0F12] text-white p-8">
      <div className="mx-auto max-w-[1200px] flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Track Habit</h1>
          <AddHabitButton onClick={() => setIsModalOpen(true)} />
        </header>
        {isModalOpen && (
          <HabitForm
            onSubmit={handleAddHabit}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
      <HabitList habits={habits} />
    </div>
  );
};

export default App;
