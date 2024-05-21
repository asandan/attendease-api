import { DAY, SECOND_SEMESTER_START_DATE } from "./constants";

export const getWeeksPassed = (endDate: Date): number => {
  const timeDiff = Math.abs(endDate.getTime() - SECOND_SEMESTER_START_DATE.getTime());
  const weeksPassedSinceDate = Math.floor(timeDiff / (DAY * 7));

  if (weeksPassedSinceDate === 0) return 1
  if (weeksPassedSinceDate > 15) throw new Error('Week is out of semester range');
  if (weeksPassedSinceDate < 0) throw new Error('Week is negative');

  return weeksPassedSinceDate;
}