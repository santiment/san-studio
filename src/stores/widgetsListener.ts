type Subscriber = () => void
type Unsubscriber = () => void
type TimerCleaner = () => void

const subscribers = new Set<Subscriber>()

const invoke = (subscriber: Subscriber) => subscriber()
const callSubscriber = () => subscribers.forEach(invoke)

let timer
const clearTimer = () => clearTimeout(timer)
export const widgetsListener = {
  subscribe(subscriber: Subscriber): Unsubscriber {
    subscribers.add(subscriber)
    return () => subscribers.delete(subscriber)
  },
  update(): TimerCleaner {
    clearTimer()
    timer = setTimeout(callSubscriber, 800)
    return clearTimer
  },
}
