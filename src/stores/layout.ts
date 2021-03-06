import { writable } from 'svelte/store'
import { addRecentLayoutId } from '@/Layouts/utils'

type SelectedLayout = undefined | SAN.Layout

const store = writable<SelectedLayout>()
export const selectedLayout = {
  ...store,
  set(layout: SelectedLayout): void {
    if (layout) addRecentLayoutId(layout.id)
    store.set(layout)
  },
}
