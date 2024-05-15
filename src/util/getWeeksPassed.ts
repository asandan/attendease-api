import { DAY, SECOND_SEMESTER_START_DATE } from "./constants";

export const getWeeksPassed = (endDate: Date): number => {
  const timeDiff = Math.abs(endDate.getTime() - SECOND_SEMESTER_START_DATE.getTime());
  const weeksPassedSinceDate = Math.ceil(timeDiff / (DAY * 7));

  console.log(endDate, weeksPassedSinceDate)

  // if (weeksPassedSinceDate < 0 || weeksPassedSinceDate > 15) throw new Error('Week is out of semester range');

  return weeksPassedSinceDate;
}