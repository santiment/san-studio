import satoshiPng from './satoshi.png'
import wrightPng from './wright.png'
import saylorPng from './saylor.png'

const OPTIONS = [satoshiPng, wrightPng, saylorPng]
export const RANDOM_HALVING_PIC = OPTIONS[Math.floor(Math.random() * OPTIONS.length)]
