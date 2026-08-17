import { addDays, format, startOfWeek, subDays } from 'date-fns';

const DATE_FORMAT = 'yyy-MM-dd';

export function getTodayString(): string {
  return format(new Date(), DATE_FORMAT);
}

export function getCurrentWeekDays() {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const todayStr = getTodayString();

  return Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(start, i);
    const dateStr = format(date, DATE_FORMAT);
    return {
      dateString: format(date, DATE_FORMAT),
      dayName: format(date, 'EEE'),
      isToday: format(date, DATE_FORMAT) === getTodayString(),
      isFuture: dateStr > todayStr,
    };
  });
}

export function calculateStreak(completedDates: string[]): number {
  if (!completedDates.length) return 0;

  const sorted = [...completedDates].sort((a, b) => b.localeCompare(a));

  const todayStr = getTodayString();
  const yesterdayStr = format(subDays(new Date(), 1), DATE_FORMAT);

  if (sorted[0] !== todayStr && sorted[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let checkDate = new Date(sorted[0]);

  for (const dateStr of sorted) {
    if (dateStr === format(checkDate, DATE_FORMAT)) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  return streak;
}
