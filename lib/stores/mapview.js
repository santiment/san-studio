import { writable } from 'svelte/store'
export var MapviewPhase
;(function (MapviewPhase) {
  MapviewPhase[(MapviewPhase['None'] = 0)] = 'None'
  MapviewPhase[(MapviewPhase['Overview'] = 1)] = 'Overview'
  MapviewPhase[(MapviewPhase['Metrics'] = 2)] = 'Metrics'
})(MapviewPhase || (MapviewPhase = {}))
export const mapview = (() => {
  let phase = MapviewPhase.None
  const { subscribe, set: _set } = writable(phase)
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
    checkActiveMetrics(hasActiveMetrics) {
      if (hasActiveMetrics) {
        set(MapviewPhase.Metrics)
      } else if (phase === MapviewPhase.Metrics) {
        set(MapviewPhase.Overview)
      }
    },
  }
})()
//# sourceMappingURL=mapview.js.map
