import { newURLQuery } from './../sharing/index.js';
import { shareWidget } from './../sharing/widget.js';
export function getViewOnSantimentLink(settings, widget) {
    const { from, to, slug, ticker, address } = settings;
    const { wm, wax, wc, ws, wcm, wd } = shareWidget(widget);
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
    });
}
export function IframeMessage(type) {
    return {
        listen(clb) {
            window.addEventListener('message', (e) => {
                const msg = e.data;
                if (msg.type === type)
                    clb(msg.data);
            });
        },
        send(data) {
            window.parent.postMessage({ type, data }, '*');
        },
    };
}
export const AssetMessage = IframeMessage('chart_asset');
export const DatesMessage = IframeMessage('chart_dates');
export const ThemeMessage = IframeMessage('chart_theme');
export const AdaptiveLayoutMessage = IframeMessage('adaptive_layout');
//# sourceMappingURL=utils.js.map