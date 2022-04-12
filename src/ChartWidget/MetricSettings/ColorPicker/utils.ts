const toHex = (value: number) => Math.round(value).toString(16).padStart(2, '0')
const rgbToHex = (r, g, b) => '#' + toHex(r) + toHex(g) + toHex(b)

// NOTE: https://gist.github.com/mjackson/5311256 [@vanguard | Jun 16, 2021]
export function hsvToHex(h, s, v) {
  let r, g, b

  let i = Math.floor(h * 6)
  let f = h * 6 - i
  let p = v * (1 - s)
  let q = v * (1 - f * s)
  let t = v * (1 - (1 - f) * s)

  // prettier-ignore
  switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

  return rgbToHex(r * 255, g * 255, b * 255)
}

const parseHex = (hex: any) => parseInt(hex, 16)

function hexToRgb(hex: string) {
  return [parseHex(hex.slice(1, 3)), parseHex(hex.slice(3, 5)), parseHex(hex.slice(5, 7))]
}

export function hexToHsv(hex) {
  let [r, g, b] = hexToRgb(hex)
  ;(r /= 255), (g /= 255), (b /= 255)

  let max = Math.max(r, g, b)
  let min = Math.min(r, g, b)
  let h
  let s
  let v = max

  let d = max - min
  s = max == 0 ? 0 : d / max

  if (max == min) {
    h = 0 // achromatic
  } else {
    // prettier-ignore
    switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

    h /= 6
  }

  return [h * 360, s * 100, v * 100]
}
