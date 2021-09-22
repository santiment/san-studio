import { getTodaysEnd } from 'webkit/utils/dates'

const MAX_DATE = getTodaysEnd()
const MAX_FREE_DATE = new Date(MAX_DATE)
MAX_FREE_DATE.setMonth(MAX_FREE_DATE.getMonth() - 1)

export function getCoinCostDate(isoDate: undefined | string, isPro = false) {
  const maxDate = isPro ? MAX_DATE : MAX_FREE_DATE
  const date = new Date(isoDate || maxDate)
  date.setHours(23, 59, 59, 999)
  return date < maxDate ? date : maxDate
}
