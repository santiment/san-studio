type Interval = { id: string; label: string }

const intervalIndices: string[] = []
export const INTERVALS = [
  makeInterval('5m', '5 minutes'),
  makeInterval('15m', '15 minutes'),
  makeInterval('30m', '30 minutes'),
  makeInterval('1h', '1 hour'),
  makeInterval('2h', '2 hours'),
  makeInterval('3h', '3 hours'),
  makeInterval('4h', '4 hours'),
  makeInterval('8h', '8 hours'),
  makeInterval('12h', '12 hours'),
  makeInterval('1d', '1 day'),
  makeInterval('5d', '5 days'),
  makeInterval('7d', '7 days'),
] as Interval[]

function makeInterval(id: string, label: string): Interval {
  intervalIndices.push(id)
  return { id, label }
}

export function getIntervals(minInterval: string): Interval[] {
  const index = intervalIndices.indexOf(minInterval)
  return index === -1 ? INTERVALS : INTERVALS.slice(index)
}

export const isAvailableInterval = (
  interval?: string,
  intervals: Interval[],
): boolean => intervals.some(({ id }) => id === interval)

export const getValidInterval = (
  interval?: string,
  intervals: Interval[],
): string =>
  isAvailableInterval(interval, intervals) ? interval : intervals[0].id
