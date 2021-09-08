import type { DetailedLayout } from '@/api/layouts'
import { writable } from 'svelte/store'
import { addRecentLayoutId } from '@/Layouts/utils'

type SelectedLayout = undefined | DetailedLayout

const store = writable<SelectedLayout>()
export const selectedLayout = {
  ...store,
  set(layout: SelectedLayout) {
    if (layout) addRecentLayoutId(layout.id)
    store.set(layout)
  },
}
