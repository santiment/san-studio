import type { Chart, Drawer, Drawing } from '../drawer'
import { newDrawing } from '../utils'

export interface Note extends Drawing {
  type: 'note'
  text: string
  width: number
  height: number
  hidden?: boolean
  /** [x, y] */
  absCoor: [number, number]
  /** [x, y] */
  relCoor: [number, number]
  /** [x, y] */
  ratioCoor: [number, number]
  handlers: []
}

type NewNote = Partial<Pick<Note, 'text' | 'absCoor' | 'relCoor' | 'ratioCoor'>>
export function newNote(drawing: NewNote) {
  if (!drawing.text) drawing.text = ''
  return newDrawing(Object.assign(drawing, { type: 'note' }) as Note)
}

const PADDING = 8
const BG = '#FFEA79'
const BORDER = '#68B3F4'
const STYLE = `padding:${PADDING}px;white-space:pre-line;background:${BG};font:14px sans-serif;position:absolute;line-height:15px;word-break:keep-all`
const EDIT_STYLE = STYLE + `;outline:0;border:1px solid ${BORDER}`
function newInput(text: string, style = STYLE, x = -999, y = -999) {
  const input = document.createElement('div')
  input.contentEditable = 'true'
  input.setAttribute('style', style + `;left:${x}px;top:${y}px`)
  input.textContent = text

  return input
}

export function paintNote(chart: Chart, drawing: Note) {
  if (drawing.hidden) return

  const { ctx } = chart.drawer
  const { absCoor, text, width, height } = drawing
  const [x, y] = absCoor

  ctx.save()

  ctx.fillStyle = BG
  ctx.fillRect(x, y, width, height)

  const lines = text.split('\n')
  ctx.fillStyle = '#2F354D'
  ctx.font = '14px sans-serif'
  ctx.textBaseline = 'top'
  for (let i = 0, len = lines.length; i < len; i++) {
    ctx.fillText(lines[i], x + PADDING, y + PADDING + 15 * i)
  }

  ctx.restore()
}

export function updateNote(_, drawing: Note) {
  if (!drawing.width) {
    const input = newInput(drawing.text)
    document.body.appendChild(input)
    const { clientWidth, clientHeight } = input
    drawing.width = clientWidth
    drawing.height = clientHeight

    input.remove()
  }
}

// ------------------------
// --- HOVERING ---
// ------------------------

export function checkNoteIsHovered(
  _,
  drawing: Note,
  mouseXY: [number, number],
) {
  if (drawing.hidden) return false

  const { absCoor, width, height } = drawing
  const [x, y] = absCoor
  const [mouseX, mouseY] = mouseXY

  return x < mouseX && mouseX < x + width && y < mouseY && mouseY < y + height
}

export function paintNoteHover({ drawer }: Chart, drawing: Note) {
  if (drawing.hidden) return

  const { ctx } = drawer
  const { absCoor, width, height } = drawing
  const [x, y] = absCoor

  ctx.save()
  ctx.strokeStyle = BORDER
  ctx.strokeRect(x, y, width, height)
  ctx.restore()
}

// ------------------------
// --- DRAGGING ---
// ------------------------

export function noteDragModifier(
  drawing: Note,
  [x, y]: Note['absCoor'],
  _,
  xDiff: number,
  yDiff: number,
) {
  drawing.absCoor[0] = x + xDiff
  drawing.absCoor[1] = y + yDiff
}

// ------------------------
// --- DOUBLE CLICK ---
// ------------------------

const stopPropagation = (e: Event) => e.stopImmediatePropagation()
export function handleNoteDoubleClick(drawer: Drawer, drawing: Note) {
  drawing.hidden = true

  const { absCoor, text } = drawing
  const [x, y] = absCoor
  const parent = drawer.canvas.parentNode as HTMLElement
  const input = newInput(text, EDIT_STYLE, x - 1, y - 1)

  input.onmousedown = stopPropagation
  input.ondblclick = stopPropagation
  input.onkeydown = stopPropagation
  input.onblur = () => {
    const { innerText, clientWidth, clientHeight } = input
    drawing.text = innerText
    drawing.width = clientWidth
    drawing.height = clientHeight
    drawing.hidden = false
    input.remove()
    drawer.redraw()
  }

  parent.append(input)
  window.getSelection()?.selectAllChildren(input)
  drawer.redraw()
}
