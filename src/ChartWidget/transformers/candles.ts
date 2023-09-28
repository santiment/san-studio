import { addCandlesTooltipPrintable } from 'san-chart/candles'
import { ONE_DAY_IN_MS } from 'webkit/utils/dates'
import { Node } from '@/Chart/nodes'
import { yAxisFormatter } from '@/Chart/Axes/utils'
import { getIntervals, getValidInterval } from '@/utils/intervals'
import { queryOHLC } from '@/api/timeseries/ohlc'

export function getCandlesPeriodMinInterval(from: Date, to: Date): string {
  const diff = (+to - +from) / ONE_DAY_IN_MS

  if (diff < 2) return '15m'
  if (diff < 8) return '30m'
  if (diff < 33) return '2h'
  if (diff < 185) return '12h'
  if (diff < 366) return '1d'

  return '7d'
}

export function cleanupCandlesSettings(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
  ChartMetricDisplays: any,
) {
  // if (metricSettings.fetcher === queryOHLC) {
  if (metricSettings.node === Node.CANDLES) {
    delete metricSettings.fetcher
    ChartMetricDisplays.delete(metric.key, 'metricPrintablePusher')
  }
}

const axisFormatter = (value) => value && yAxisFormatter(value.close || value)

export function setCandlesSettings(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
  { from, to },
  ChartMetricDisplays: any,
) {
  metricSettings.fetcher = queryOHLC
  metricSettings.interval = getValidInterval(
    metricSettings.interval,
    getIntervals(getCandlesPeriodMinInterval(new Date(from), new Date(to))),
  )
  ChartMetricDisplays.set(metric.key, {
    axisFormatter,
    metricPrintablePusher: addCandlesTooltipPrintable,
  })
}

export function transformCandles(
  metric: Studio.Metric,
  metricSettings: Studio.MetricSetting,
  studioSettings: any,
  ChartMetricDisplays?: any,
) {
  if (metricSettings.node !== Node.CANDLES) {
    cleanupCandlesSettings(metric, metricSettings, ChartMetricDisplays)
    return metricSettings
  }
  setCandlesSettings(metric, metricSettings, studioSettings, ChartMetricDisplays)

  return metricSettings
}
