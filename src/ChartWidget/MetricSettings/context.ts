import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'

type MetricSettingsStore = ReturnType<typeof newMetricSettingsStore>
export type MetricSetting = {
  node?: string
  interval?: string
}
export type MetricSettings = {
  [metricKey: string]: MetricSetting | undefined
}

export const CONTEXT = 'MetricSettings'
const setMetricSettings = (chart: MetricSettingsStore): void =>
  setContext(CONTEXT, chart)
export const getMetricSettings = (): MetricSettingsStore => getContext(CONTEXT)

export function newMetricSettingsStore(defaultValue?: MetricSettings) {
  const MetricSettings = (defaultValue || {}) as MetricSettings
  const { subscribe, set } = writable(MetricSettings)

  const store = {
    subscribe,
    set(metricKey: string, setting: MetricSetting) {
      let metricSettings = MetricSettings[metricKey]

      if (!metricSettings) {
        metricSettings = MetricSettings[metricKey] = {}
      }

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
  }

  setMetricSettings(store)
  return store
}

declare global {
  const $MetricSettings: {}
}
