export default function App() {
  return (
    <div className="min-h-screen bg-[#0D0F12] text-[#e2e2e6] selection:bg-[#6366F1]/30">
      {/* Header Placeholder */}
      <header className="border-b border-[#23272F] h-16 flex items-center px-6 justify-between bg-[#0D0F12]">
        <div className="font-bold text-white tracking-tight">HabitEngine</div>
        <div className="text-sm text-[#8A8F98]">Navigation Placeholder</div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Date & Add Button Placeholder */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-[32px] font-semibold text-white tracking-tight leading-tight">
              Tuesday, Oct 24
            </h1>
            <p className="text-[#8A8F98] text-[15px] mt-1">
              0/0 habits completed today
            </p>
          </div>
          <button className="bg-[#6366F1] hover:bg-[#494bd6] text-white px-4 py-2 rounded transition-colors font-medium text-sm">
            + Add Habit
          </button>
        </div>

        {/* Habit List Placeholder */}
        <div className="border border-[#23272F] rounded-lg bg-[#16191E] p-8 text-center text-[#8A8F98] border-dashed">
          [HabitList Component Will Go Here]
        </div>

        {/* Performance Trend Placeholder */}
        <div className="border border-[#23272F] rounded-lg bg-[#16191E] p-8 text-center text-[#8A8F98] border-dashed h-48 flex items-center justify-center">
          [Performance Trend Component Will Go Here]
        </div>
      </main>
    </div>
  );
}
