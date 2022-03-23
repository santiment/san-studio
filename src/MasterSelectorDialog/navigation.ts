const NAV_KEYS = new Set(['ArrowUp', 'ArrowDown', 'Enter'])

type Context = {
  cursor: number
  items: any[]
  onSelect: (item: any) => void
}

export function handleNavigation(e: KeyboardEvent, context: Context): void | boolean {
  const { key } = e
  if (!NAV_KEYS.has(key)) return true

  e.preventDefault()

  if (key === 'ArrowUp') {
    context.cursor -= 1
  } else if (key === 'ArrowDown') {
    context.cursor += 1
  } else if (key === 'Enter') {
    context.onSelect(context.items[context.cursor])
    return true
  }

  const max = context.items.length
  if (context.cursor < 0) context.cursor = max - 1
  else if (context.cursor >= max) context.cursor = 0
}
