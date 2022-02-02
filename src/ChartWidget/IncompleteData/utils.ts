import { getDateFormats, ONE_DAY_IN_MS } from 'san-webkit/lib/utils/dates'
import { getSavedValue, saveValue } from 'san-webkit/lib/utils/localStorage'

export function formatDate(date: string): string {
  const { DD, MMM, YY } = getDateFormats(new Date(date))
  return `${DD} ${MMM}, ${YY}`
}

export function closeBanners(): void {
  const banners = document.querySelectorAll('.limit-banner')
  for (let i = 0; i < banners.length; i++) banners[i].remove()
  saveBannerCloseDate()
}

const INCOMPLETE_DATA_BANNER_CLOSE_DATE = 'INCOMPLETE_DATA_BANNER_CLOSE_DATE'
export function saveBannerCloseDate(): void {
  const nextDay = Date.now() + ONE_DAY_IN_MS
  saveValue(INCOMPLETE_DATA_BANNER_CLOSE_DATE, nextDay.toString())
}

export function checkShouldShowBanner(): boolean {
  const value = getSavedValue(INCOMPLETE_DATA_BANNER_CLOSE_DATE)
  return !value || +value < Date.now()
}
