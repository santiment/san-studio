import { writable } from 'svelte/store'

export enum MapviewPhase {
  None,
  Overview,
  Metrics,
}
export const mapview = (() => {
  let phase = MapviewPhase.None
  const { subscribe, set: _set } = writable<MapviewPhase>(phase)

  function set(value) {
    phase = value
    _set(value)
  }

  return {
    subscribe,
    overview() {
      set(MapviewPhase.Overview)
    },
    exit() {
      set(MapviewPhase.None)
    },
    toggle() {
      set(phase !== MapviewPhase.None ? MapviewPhase.None : MapviewPhase.Overview)
    },
    checkActiveMetrics(hasActiveMetrics: boolean): void {
      if (hasActiveMetrics) {
        set(MapviewPhase.Metrics)
      } else if (phase === MapviewPhase.Metrics) {
        set(MapviewPhase.Overview)
      }
    },
  }
})()

declare global {
  const $mapview: MapviewPhase
}
