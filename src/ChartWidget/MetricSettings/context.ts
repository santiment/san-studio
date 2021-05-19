import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'

type MetricSettingsStore = ReturnType<typeof newMetricSettingsStore>
export type MetricSetting = {
  node?: string
  interval?: string
  transform?: {
    type: string
    movingAverageBase: number
  }
}
export type MetricSettings = {
  [metricKey: string]: MetricSetting | undefined
}

export const CONTEXT = 'MetricSettings'
const setMetricSettings = (chart: MetricSettingsStore): void =>
  setContext(CONTEXT, chart)
export const getMetricSettings = (): MetricSettingsStore => getContext(CONTEXT)

const noopTransformer = (
  _: Studio.Metric,
  __: Studio.MetricSetting,
): MetricSetting => __ // eslint-disable-line
export function newMetricSettingsStore(defaultValue?: MetricSettings) {
  let MetricSettings = (defaultValue || {}) as MetricSettings
  const { subscribe, set } = writable(MetricSettings)

  const store = {
    subscribe,
    getValue() {
      return MetricSettings
    },
    getMetricSettings(metricKey: string) {
      return MetricSettings[metricKey] || (MetricSettings[metricKey] = {})
    },
    set(metricKey: string, setting: MetricSetting) {
      const metricSettings = store.getMetricSettings(metricKey)
      Object.assign(metricSettings, setting)
      set(MetricSettings)
    },
    delete(metricKey: string, settingKey: string) {
      const metricSettings = MetricSettings[metricKey]
      if (metricSettings) {
        delete metricSettings[settingKey]
        set(MetricSettings)
      }
    },
    update(metrics: Studio.Metric[], transformer = noopTransformer) {
      const NewMetricSetings = {}
      metrics.forEach((metric) => {
        const metricSettings = MetricSettings[metric.key] || {}
        NewMetricSetings[metric.key] = transformer(
          metric,
          metricSettings,
          metrics,
        )
      })

      MetricSettings = NewMetricSetings
      set(MetricSettings)
    },
  }

  setMetricSettings(store)
  return store
}

declare global {
  const $MetricSettings: {}
}
