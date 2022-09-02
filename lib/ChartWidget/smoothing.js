// TODO: Refactor [@vanguard | Jun 16, 2021]
export function smoothAsCMA(data, t, valueKey) {
  const result = []
  const leftOffset = Math.floor(t / 2)
  const isEven = leftOffset * 2 === t
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
    let value = sum / amount
    if (isEven) {
      sum = 0
      amount = 0
      for (let j = i - (leftOffset - 1), k = 0; k < t; k++, j++) {
        const item = data[j]
        if (item) {
          sum += item[valueKey]
          amount++
        }
      }
      value = (value + sum / amount) / 2
    }
    result[i] = {
      datetime: data[i].datetime,
      [valueKey]: value,
    }
  }
  return result
}
//# sourceMappingURL=smoothing.js.map
