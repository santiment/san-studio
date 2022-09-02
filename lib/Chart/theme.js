export var Color
;(function (Color) {
  Color['porcelain'] = '#e7eaf3'
  Color['mystic'] = '#d2d6e6'
  Color['casper'] = '#9faac4'
  Color['waterloo'] = '#7a859e'
  Color['mirage'] = '#181b2b'
  Color['shark'] = '#15181f'
  Color['rhino'] = '#2f354d'
  Color['cloudBurst'] = '#222639'
  Color['baliHai'] = '#8b93b6'
})(Color || (Color = {}))
export const dayAxesColor = Color.porcelain
export const nightAxesColor = Color.cloudBurst
export const dayHoverLineColor = Color.casper
export const nightHoverLineColor = Color.rhino
export const dayTicksTheme = {
  color: Color.casper,
  font: '10px sans-serif',
}
export const nightTicksTheme = {
  color: Color.waterloo,
  font: '10px sans-serif',
}
export const dayBubblesTheme = {
  font: '10px sans-serif',
  bgColor: Color.waterloo,
  textColor: Color.porcelain,
}
export const nightBubblesTheme = {
  font: '10px sans-serif',
  bgColor: Color.rhino,
  textColor: Color.baliHai,
}
export const dayTooltipTheme = {
  font: '12px sans-serif',
  headerFill: Color.porcelain,
  borderColor: Color.mystic,
  contentFill: '#fff',
  headerColor: Color.waterloo,
  valueColor: Color.waterloo,
  labelColor: Color.mirage,
}
export const nightTooltipTheme = {
  font: '12px sans-serif',
  headerFill: Color.cloudBurst,
  borderColor: Color.rhino,
  contentFill: Color.mirage,
  headerColor: Color.baliHai,
  valueColor: Color.baliHai,
  labelColor: '#fff',
}
export const dayBrushTheme = {
  bgColor: Color.porcelain,
  fadeColor: Color.mystic,
  handleColor: Color.waterloo,
}
export const nightBrushTheme = {
  bgColor: Color.cloudBurst,
  fadeColor: Color.rhino,
  handleColor: Color.baliHai,
}
export const dayDrawerTheme = Object.assign(Object.assign({}, dayBubblesTheme), {
  bgColor: Color.casper,
})
export const nightDrawerTheme = Object.assign(Object.assign({}, nightBubblesTheme), {
  bgColor: Color.cloudBurst,
})
export const themes = [
  // 0 = day
  {
    bg: '#fff',
    text: Color.mirage,
    axes: dayAxesColor,
    hoverLine: dayHoverLineColor,
    ticks: dayTicksTheme,
    bubbles: dayBubblesTheme,
    tooltip: dayTooltipTheme,
    brush: dayBrushTheme,
    drawer: dayDrawerTheme,
  },
  // 1 = night
  {
    bg: Color.mirage,
    text: '#fff',
    axes: nightAxesColor,
    hoverLine: nightHoverLineColor,
    ticks: nightTicksTheme,
    bubbles: nightBubblesTheme,
    tooltip: nightTooltipTheme,
    brush: nightBrushTheme,
    drawer: nightDrawerTheme,
  },
]
//# sourceMappingURL=theme.js.map
