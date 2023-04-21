import { getContext, setContext } from 'svelte'

export const CTX = 'STUDIO'

export const newStudioCtx = () => setContext(CTX, new Map())
export const getStudioCtx = () => getContext<Map<string, any>>(CTX)

export function setStudioContext<T>(key: string, value: T) {
  getStudioCtx().set(key, value)

  return value
}

export const getStudioContext = (key: string) => getStudioCtx().get(key)
