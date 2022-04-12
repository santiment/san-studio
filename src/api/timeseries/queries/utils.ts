export type Variables = {
  key: string
  from: string
  to: string
  slug: string
  interval?: string
}

const defaultModifier = (key: string, datetime: number, value: number) => ({
  datetime,
  [key]: value,
})

export function newPrecacher(dataAccessor: any, modifyData = defaultModifier, prepareResult?: any) {
  return ({ key }: Variables) =>
    (response: any) => {
      const data = dataAccessor(response)
      const result = new Array(data.length)

      for (let i = result.length - 1; i > -1; i--) {
        const { d, v } = data[i]
        result[i] = modifyData(key, +new Date(d), v)
      }
      return prepareResult ? prepareResult(result) : result
    }
}
