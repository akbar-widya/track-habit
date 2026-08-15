import { useEffect, useState } from 'react';
import HabitList from './components/HabitList';
import type { Habit } from './types/habit';
import AddHabitButton from './components/AddHabitButton';

// fetch habit storage one time, feeds all other components

const App = () => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem('habits');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse habits from localStorage', error);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('habits', JSON.stringify(habits));
    } catch (error) {
      console.error('Failed to save habits to localStorage', error);
    }
  }, [habits]);
  return (
    <main>
      <h1>Track Habit</h1>
      <AddHabitButton onClick={() => {}} />
      {/* <HabitList habits={habits} /> */}
    </main>
  );
};

export default App;
