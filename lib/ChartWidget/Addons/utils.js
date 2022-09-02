import { getTodaysEnd } from 'san-webkit/lib/utils/dates'
export const MAX_DATE = getTodaysEnd()
export const MAX_FREE_DATE = new Date(MAX_DATE)
MAX_FREE_DATE.setMonth(MAX_FREE_DATE.getMonth() - 1)
export function getCoinCostDate(settings, isPro = false) {
  const maxDate = isPro ? MAX_DATE : MAX_FREE_DATE
  const date = new Date((settings && (settings.to || settings.from)) || maxDate)
  date.setHours(23, 59, 59, 999)
  const to = date < maxDate ? date : maxDate
  let from = new Date((settings === null || settings === void 0 ? void 0 : settings.from) || to)
  if (from > to) from = new Date(to)
  from.setHours(0, 0, 0, 0)
  return [from, to]
}
export const checkAreSameDay = (a, b) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear()
//# sourceMappingURL=utils.js.map
