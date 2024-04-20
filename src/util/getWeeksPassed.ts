import { DAY } from "./constants";

export const getWeeksPassed = (startDate: Date): number => {
  const today = new Date();
  const timeDiff = Math.abs(today.getTime() - startDate.getTime());
  const weeksPassedSinceDate = Math.ceil(timeDiff / (DAY * 7));
  
  return weeksPassedSinceDate;
}