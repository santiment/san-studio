export function debounced(clb: (...args: any[]) => any) {
  let timer: number
  return (...args: any[]) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => clb(...args), 100)
  }
}
