import { newURLQuery } from '@/sharing'
import { shareWidget } from '@/sharing/widget'

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
