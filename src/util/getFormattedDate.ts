export const getFormattedDate = (date: string): string => {
  if (isNaN(Date.parse(date))) {
    throw new Error('Invalid date format');
  }
  return `d${date.replaceAll(".", "")}`;
};