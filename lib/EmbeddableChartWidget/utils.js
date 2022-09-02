import { newURLQuery } from './../../lib/sharing'
import { shareWidget } from './../../lib/sharing/widget'
export function getViewOnSantimentLink(settings, widget) {
  const { from, to, slug, ticker, address } = settings
  const { wm, wax, wc, ws, wcm, wd } = shareWidget(widget)
  return newURLQuery({
    settings: JSON.stringify({ from, to, slug, ticker, address }),
    widgets: JSON.stringify([
      {
        widget: 'ChartWidget',
        wm,
        wax,
        wc,
        ws,
        wcm,
        wd,
      },
    ]),
  })
}
//# sourceMappingURL=utils.js.map
