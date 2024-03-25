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

type Message = { type: string; data: unknown }

export function IframeMessage<Data>(type: string) {
  return {
    listen<T extends (data: Data) => void>(clb: T) {
      window.addEventListener('message', (e) => {
        const msg = e.data as Message

        if (msg.type === type) clb(msg.data as Data)
      })
    },
    send(data: Data) {
      window.parent.postMessage({ type, data }, '*')
    },
  }
}

export const AssetMessage = IframeMessage<{ slug: string; ticker: string }>('chart_asset')

export const DatesMessage = IframeMessage<{ from: string; to: string }>('chart_dates')

export const ThemeMessage = IframeMessage<{ dark: boolean }>('chart_theme')

export const AdaptiveLayoutMessage = IframeMessage<{ minimized?: boolean; controls?: boolean }>(
  'adaptive_layout',
)
