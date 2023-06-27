import type { newHistory } from 'webkit/ui/history'

import { getContext } from 'svelte'
import { CONTEXT } from 'webkit/ui/history'
import { getStudioContext } from '@/context'

export const getHistoryContext = () =>
  (getStudioContext(CONTEXT) as ReturnType<typeof newHistory>) || getContext(CONTEXT)
