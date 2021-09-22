export function getCoinCostDate(date: Date, isPro = false) {
  date.setHours(23, 59, 59, 999)
  if (isPro === false) date.setMonth(date.getMonth() - 1)
  return date
}
