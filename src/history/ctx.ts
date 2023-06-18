import type { newHistory } from 'webkit/ui/history'

import { CONTEXT } from 'webkit/ui/history'
import { getStudioContext } from '@/context'

export const getHistoryContext = () => getStudioContext(CONTEXT) as ReturnType<typeof newHistory>
