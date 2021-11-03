function parseJson(data: string) {
  try {
    return JSON.parse(data)
  } catch (e) {
    console.warn(e)
  }
}

export function saveValue(key: string, value: any) {
  window.localStorage.setItem(key, value)
}
export function saveJson(key: string, value: any) {
  saveValue(key, JSON.stringify(value))
}

export function getSavedValue(key: string, defaultValue?: any) {
  const data = window.localStorage.getItem(key)
  return data === null ? defaultValue : data
}

export function getSavedJson(key: string, defaultValue?: any): any | undefined {
  const value = getSavedValue(key)
  return value ? parseJson(value) : defaultValue
}

export function deleteSavedValue(key: string) {
  window.localStorage.removeItem(key)
}
