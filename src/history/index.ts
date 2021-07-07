import type { Emitter } from 'webkit/ui/history'
import { setContext, getContext } from 'svelte'
import {
  newHistory,
  newHistoryEmitter,
  withScroll,
  scroll,
} from 'webkit/ui/history'

export const CONTEXT = 'USER_ACTIONS_HISTORY'
export const getHistoryContext = (): ReturnType<typeof newHistory> =>
  getContext(CONTEXT)

export function newHistoryContext(
  emitter?: Emitter,
): ReturnType<typeof newHistory> {
  const history = newHistory(emitter)
  setContext(CONTEXT, history)
  return history
}

export { newHistoryEmitter, withScroll, scroll }
