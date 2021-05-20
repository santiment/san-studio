export type Variables = {
  key: string
  from: string
  to: string
  slug: string
  interval?: string
}

export function newPrecacher(dataAccessor: any) {
  return ({ key }: Variables) =>
    (response: any) => {
      const data = dataAccessor(response)
      const result = new Array(data.length)

      for (let i = result.length - 1; i > -1; i--) {
        const { d, v } = data[i]
        result[i] = {
          datetime: +new Date(d),
          [key as any]: v,
        }
      }
      return result
    }
}
