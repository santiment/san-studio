import { setContext, getContext } from 'svelte'
import { updateSize } from '@santiment-network/chart'
import { newSortableContext } from 'san-webkit/lib/ui/dnd/sortable'
export const getSortableDndCtx = () => getContext('sortable-dnd')
export function newSortableDndCtx(options) {
  const ctx = newSortableContext(Object.assign({ cloner, scroll: true }, options))
  setContext('sortable-dnd', ctx)
  return ctx
}
function cloner(node) {
  const cloned = node.cloneNode(true)
  const nodeCanvas = node.querySelector('canvas')
  if (node.dnd) cloned.style.minWidth = node.dnd.clientRect.width + 'px'
  if (nodeCanvas) {
    const clonedCanvas = cloned.querySelector('canvas')
    const { offsetWidth, offsetHeight } = nodeCanvas
    const dpr = window.devicePixelRatio || 1
    const ctx = clonedCanvas.getContext('2d')
    updateSize(clonedCanvas, ctx, dpr, offsetWidth, offsetHeight)
    ctx.drawImage(nodeCanvas, 0, 0, offsetWidth, offsetHeight)
  }
  return cloned
}
//# sourceMappingURL=dnd.js.map
