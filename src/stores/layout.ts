import type { DetailedLayout } from '@/api/layouts'
import { writable } from 'svelte/store'

type SelectedLayout = undefined | DetailedLayout

export const selectedLayout = writable<SelectedLayout>()
