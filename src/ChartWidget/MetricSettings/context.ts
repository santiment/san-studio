import { writable } from 'svelte/store'

type MetricSettingsStore = ReturnType<typeof newMetricSettingsStore>
export type MetricSetting = {
  node?: string
  interval?: string
  transform?: {
    type: string
    movingAverageBase: number
  }
  fetcher?: any
  queryKey?: string
  owner?: string
  preTransform?: (...args: any[]) => any
  getPreTransformValue?: (...args: any[]) => any
}
export type MetricSettings = {
  [metricKey: string]: MetricSetting | undefined
}

const noopTransformer = (
  _: Studio.Metric,
  __: Studio.MetricSetting,
  ___: Studio.Metric[],
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
    replace(oldMetricKey: string, newMetricKey: string) {
      MetricSettings[newMetricKey] = MetricSettings[oldMetricKey]
      set(MetricSettings)
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
        NewMetricSetings[metric.key] = transformer(metric, metricSettings, metrics)
      })

      set((MetricSettings = NewMetricSetings))
    },
  }

  return store
}

declare global {
  const $MetricSettings: {}
}
