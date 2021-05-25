import type { DragElement } from 'webkit/ui/dnd/sortable'
import { setContext, getContext } from 'svelte'
import { updateSize } from 'san-chart'
import { newSortableContext } from 'webkit/ui/dnd/sortable'

export const getSortableDndCtx = () => getContext('sortable-dnd')
export function newSortableDndCtx(
  options,
): ReturnType<typeof newSortableContext> {
  const ctx = newSortableContext(Object.assign({ cloner }, options))
  setContext('sortable-dnd', ctx)
  return ctx
}

function cloner(node: DragElement): HTMLElement {
  const cloned = node.cloneNode(true) as HTMLElement
  const nodeCanvas = node.querySelector('canvas')
  if (node.dnd) cloned.style.minWidth = node.dnd.clientRect.width + 'px'

  if (nodeCanvas) {
    const clonedCanvas = cloned.querySelector('canvas') as HTMLCanvasElement

    const { offsetWidth, offsetHeight } = nodeCanvas
    const dpr = window.devicePixelRatio || 1
    const ctx = clonedCanvas.getContext('2d') as CanvasRenderingContext2D

    updateSize(clonedCanvas, ctx, dpr, offsetWidth, offsetHeight)
    ctx.drawImage(nodeCanvas, 0, 0, offsetWidth, offsetHeight)
  }

  return cloned
}
