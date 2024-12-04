import { getDateFormats } from 'webkit/utils/dates'
import { track } from 'webkit/analytics'
import { showPaymentDialog } from 'webkit/ui/PaymentDialog/index.svelte'
import { Event } from '@/analytics'

export function formatDate(date: string): string {
  const { DD, MMM, YY } = getDateFormats(new Date(date))
  return `${DD} ${MMM}, ${YY}`
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
