// receive from habit prop from App

import type { Habit } from '../types/habit';

interface HabitListProps {
  habits: Habit[];
}

export const HabitList = ({ habits }: HabitListProps) => {
  return (
    <div>
      {habits.map((habit) => (
        <div key={habit.id}>
          <span>{habit.name}</span>
        </div>
      ))}
    </div>
  );
};

export default HabitList;
