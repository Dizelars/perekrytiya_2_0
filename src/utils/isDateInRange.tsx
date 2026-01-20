/**
 * Проверяет, попадает ли выбранная дата в диапазон [start, end]
 * Все даты ожидаются в формате YYYY-MM-DD
 */
export const isDateInRange = (
  selected: string,
  start: string,
  end: string
): boolean => {
  if (!selected || !start || !end) {
    return false;
  }

  const selectedTime = Date.parse(selected);
  const startTime = Date.parse(start);
  const endTime = Date.parse(end);

  if (
    Number.isNaN(selectedTime) ||
    Number.isNaN(startTime) ||
    Number.isNaN(endTime)
  ) {
    return false;
  }

  return selectedTime >= startTime && selectedTime <= endTime;
};
