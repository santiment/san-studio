import type { SetOf, Store } from './utils'
import { writable } from 'svelte/store'
import { each, getSelectableType, SelectableModifier } from './utils'

export const selectedItems = (() => {
  const setOf = { all: new Set() } as SetOf
  const store = { has: (item) => setOf.all.has(item) } as Store

  each((selectable) => {
    store[selectable] = []
    setOf[selectable] = new Set<any>()
  })

  const { subscribe, set } = writable(store)

  return {
    subscribe,
    set(metrics: Studio.Metric[]) {
      setOf.metrics = new Set(metrics)
      store.metrics = metrics
      set(store)
    },
    clear() {
      setOf.all.clear()
      each((selectable) => {
        store[selectable] = []
        setOf[selectable].clear()
      })
      set(store)
    },
    toggle(item: any) {
      const selectable = getSelectableType(item)
      const selectableSet = setOf[selectable]
      const modifier = SelectableModifier[selectable]
      const hasItem = selectableSet.has(item)

      if (hasItem) {
        selectableSet.delete(item)
        setOf.all.delete(item)
      } else {
        selectableSet.add(item)
        setOf.all.add(item)
      }
      modifier?.(item, store, setOf, hasItem)

      store[selectable] = Array.from(selectableSet)
      set(store)
    },
  }
})()
