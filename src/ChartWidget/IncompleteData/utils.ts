import { getDateFormats, ONE_DAY_IN_MS } from 'webkit/utils/dates'
import { getSavedValue, saveValue } from 'webkit/utils/localStorage'
import { track } from 'webkit/analytics'
import { showPaymentDialog } from 'webkit/ui/PaymentDialog/index.svelte'
import { Event } from '@/analytics'

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

export type TrackUpgrageProps = {
  e: MouseEvent
  restrictedMetrics: any[]
  isLoggedIn: boolean
  location: string
}

export function trackUpgrade({ e, restrictedMetrics, isLoggedIn, location }: TrackUpgrageProps) {
  track.event(Event.IncompleteDataUpgrade, {
    location,
    metrics: Array.from(new Set(restrictedMetrics.map(({ key, queryKey = key }) => queryKey))),
  })
  closeBanners()

  if (isLoggedIn) {
    e.preventDefault()
    const node = e.currentTarget as null | HTMLElement
    return showPaymentDialog({
      source: 'charts_incomplete_data_upgrade',
      triggeredBy: node,
    })
  }

  window.__onLinkClick?.(e)
}

export type RestrictionInfo = {
  metric: string
  date: string
}
