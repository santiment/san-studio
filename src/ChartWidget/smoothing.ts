export function smoothAsCMA(data: any[], t: number, valueKey: string) {
  const result = [] as any[]
  const leftOffset = Math.floor(t / 2)
  for (let i = 0, len = data.length; i < len; i++) {
    let sum = 0
    let amount = 0

    for (let j = i - leftOffset, k = 0; k < t; k++, j++) {
      const item = data[j]
      if (item) {
        sum += item[valueKey]
        amount++
      }
    }
    result[i] = {
      datetime: data[i].datetime,
      [valueKey]: sum / amount,
    }
  }

  return result
}
