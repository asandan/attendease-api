import { WeekDays } from "@prisma/client"

export const getFullWeekDay = (day: number): null | WeekDays => {
  if (day === 0) return null
  if (day === 1) return WeekDays.MONDAY
  if (day === 2) return WeekDays.TUESDAY
  if (day === 3) return WeekDays.WEDNESDAY
  if (day === 4) return WeekDays.THURSDAY
  if (day === 5) return WeekDays.FRIDAY
  if (day === 6) return WeekDays.SATURDAY
}