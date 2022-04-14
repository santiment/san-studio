import { newKey, MetricType } from '@/metrics/utils'

export function shareMetrics(metrics: Studio.Metric[]): string[] {
  console.log(metrics.map(({ key }) => key))
  return metrics.map(({ key }) => key)
}

function parseProjectLocked([_, metricKey, slug, ticker]) {
  return {}
}

export function parseMetrics(metrics: any[]) {
  console.log(metrics)
}

type TupleData = string | string[]
export function parseMetricKey(key: string): TupleData[] {
  return getTupleData(key.slice(1, -1).split(';'))
}

function getTupleData(args: string[], cursor = { i: 0 }): TupleData[] {
  const data: TupleData[] = []

  for (; cursor.i < args.length; cursor.i++) {
    const arg = args[cursor.i]

    if (arg.endsWith(']')) {
      data.push(arg.slice(0, -1))
      return data
    }

    if (arg.startsWith('[')) {
      cursor.i++
      data.push([arg.slice(1), ...(getTupleData(args, cursor) as TupleData)])
      continue
    }

    data.push(arg)
  }

  return data
}

// parseTuple('[2;[1;price_usd;bitcoin;BTC];MA30]')
