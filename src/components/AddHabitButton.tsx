import { Plus } from 'lucide-react';
interface addHabitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

export const AddHabitButton = ({
  onClick,
  className = '',
  ...props
}: addHabitButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded bg-[#6366F1] px-3.5 py-2 text-sm font-medium text-white transition-all duration-150 hover-:bg[#5558E6] ${className}`}
      {...props}
    >
      <Plus className="h-4 2-4 stroke-2.5" />
      <span>New Habit</span>
    </button>
  );
};

export default AddHabitButton;
