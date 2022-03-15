import type { downloadCsv } from './csv'
import { get } from 'svelte/store'
import { track } from 'webkit/analytics'
import { Event } from '@/analytics'
import { studio } from '@/stores/studio'
import { downloadPng } from './png'

export function download(widget, downloader: typeof downloadCsv | typeof downloadPng): void {
  track.event(Event.Download, { type: downloader === downloadPng ? 'png' : 'csv' })
  downloader(widget, get(studio))
}

export { downloadCsv } from './csv'
export { downloadPng } from './png'
