import { setContext, getContext } from 'svelte'
import { writable } from 'svelte/store'

export enum Action {
  Undo = 'Undo',
  Redo = 'Redo',
}

export function newHistory(emitter) {
  let history = [] as any[]
  let cursor = -1

  const emit = (action: Action, cmd) => emitter?.({ action, name: cmd.name })
  return {
    add(name: string, undo, redo = undo) {
      history = history.slice(-20).slice(0, cursor + 1)
      history.push({
        name,
        undo,
        redo,
      })

      cursor += 1
    },
    undo() {
      if (cursor < 0) return

      const cmd = history[cursor]
      if (cmd) {
        cmd.undo()
        cursor -= 1
        emit(Action.Undo, cmd)
      }
    },
    redo() {
      if (cursor >= history.length - 1) return

      const cmd = history[cursor + 1]
      if (cmd) {
        cmd.redo()
        cursor += 1
        emit(Action.Redo, cmd)
      }
    },
  }
}

export const CONTEXT = 'USER_ACTIONS_HISTORY'
export const getHistoryContext = (): ReturnType<typeof newHistory> =>
  getContext(CONTEXT)

export function newHistoryContext(emitter) {
  const history = newHistory(emitter)
  setContext(CONTEXT, history)
  return history
}

export function newHistoryEmitter() {
  return writable<any>()
}

export const scroll = (target) => target?.scrollIntoView()
// prettier-ignore
export const withScroll = (target, clb) => () => (clb(), scroll(target))
