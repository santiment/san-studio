var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import 'webkit/styles/main.css';
import App from './../EmbeddableChartWidget/WithApi.svelte';
import { studio } from './../stores/studio.js';
import { globals } from './../stores/globals.js';
import { newWidget } from './../stores/widgets.js';
import { parseQueryString } from './../ChartWidget/Controls/Embed/utils.js';
const _a = parseQueryString(window.location.search ||
    `?ps=ethereum&pt=ETH&df=2021-02-25T20%3A59%3A59.999Z&dt=2021-08-25T20%3A59%3A59.999Z&emcg=1&wm=ethereum_MC_ETH_MC_price_usd%3BMA7_price_usd%3BMA50_price_usd%3BMA30_ethereum_MC_ETH_MC_price_usd&wax=0%3B1&wc=%23FFCB47%3B%23F47BF7%3B%23FF5B5B%3B%235275FF&ws=%3B%3B%3B&win=%5B%22price_usd%22%2C%5B%22MA7%22%2C%22MA50%22%5D%5D%3B%5B0%2C%5B%22MA30%22%5D%5D`), { from, to, slug, ticker, isNightMode, isWithMetricSettings } = _a, widgetProps = __rest(_a, ["from", "to", "slug", "ticker", "isNightMode", "isWithMetricSettings"]);
studio.setProject({ from, to, slug, ticker });
globals.toggle('isNightMode', isNightMode);
document.body.classList.toggle('night-mode', isNightMode);
const app = new App({
    target: document.querySelector('body'),
    props: {
        isWithMetricSettings,
        widget: newWidget(null, widgetProps),
    },
});
export default app;
//# sourceMappingURL=main.js.map