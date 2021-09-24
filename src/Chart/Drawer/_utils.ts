export function newRectHandle(
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const handle = new Path2D()
  handle.rect(x, y, width, height)
  return handle
}
