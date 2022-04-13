import { newKey, MetricType } from '@/metrics/utils'

function parseProjectLocked([_, metricKey, slug, ticker]) {
  return {}
}

export function parseMetrics(metrics: any[]) {
  console.log(metrics)
}

export function shareMetrics(metrics: Studio.Metric[]) {
  console.log(metrics.map(({ key }) => key))
}

type TupleData = string | string[]

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
function parseTuple(key: string) {
  return getTupleData(key.slice(1, -1).split(';'))
}

// parseTuple('[2;[1;price_usd;bitcoin;BTC];MA30]')
