import { getTodaysEnd } from 'san-webkit/lib/utils/dates';
import { getArrayValues, newURLQuery, newMetricAlias, shareMetrics, shareAxesMetrics, shareColors, shareMetricSettings, shareCombinedMetrics, } from './../../../sharing/index.js';
import { parse, parseArray, parseMetrics, parseCombinedMetrics, parseIndicators, parseMergedMetrics, parseMetricGraphValue, parseAxesMetrics, } from './../../../sharing/parse.js';
import { parseDrawings, shareDrawings } from './../../../sharing/drawings.js';
const stringify = (v) => JSON.stringify(v);
export function shareEmbeded(widget, studio, options) {
    const { slug, ticker, from, to, address } = studio;
    const { isNightMode, isWithMetricSettings, isCartesianGrid, isWatermarkHidden, isAutoUpdated } = options;
    const { metrics, axesMetrics, colors, metricSettings, isSharedAxisEnabled } = widget;
    const keys = shareMetrics(metrics);
    const metricAlias = newMetricAlias(keys);
    const keyAccessor = ({ key }) => metricAlias[key];
    const qs = newURLQuery({
        // project slug
        ps: slug,
        // project ticker
        pt: ticker,
        // selected address
        addr: address,
        // date from
        df: from,
        // date to
        dt: isAutoUpdated ? undefined : to,
        // Shared Access Token
        sat: options.dataToken,
        // embedded night mode
        emnm: isNightMode ? 1 : undefined,
        // embedded cartesian grid
        emcg: isCartesianGrid ? 1 : undefined,
        // embedded metric settings row
        emms: isWithMetricSettings ? 1 : undefined,
        emhwm: isWatermarkHidden ? 1 : undefined,
        // embedded shared axis
        emsax: isSharedAxisEnabled ? 1 : undefined,
        // widget metrics
        wm: keys,
        // widget axes
        wax: shareAxesMetrics(axesMetrics, keyAccessor),
        // widget colors
        wc: shareColors(colors, metricAlias),
        // widget settings
        ws: shareMetricSettings(metricSettings, metricAlias).map(stringify),
        // widget combined metrics
        wcm: shareCombinedMetrics(metrics).map(stringify),
        // widget drawings
        wd: shareDrawings(widget.drawings).map(stringify),
    });
    return qs;
}
const parseJSON = (value) => value && JSON.parse(value);
export function parseQueryString(qs) {
    const shared = parse(qs);
    const { ps, pt, addr } = shared;
    const { sat, df, dt, emnm, emcg, emms, emhwm, emsax } = shared;
    const { wm, wax, wc, ws, wcm, wd } = shared;
    const KnownMetric = {};
    parseCombinedMetrics(parseArray(wcm, true).map(parseJSON), KnownMetric);
    const metrics = parseMetrics(getArrayValues(wm), KnownMetric);
    const metricIndicators = parseIndicators(metrics);
    const mergedMetrics = parseMergedMetrics(metrics);
    const parsed = {
        slug: ps,
        ticker: pt,
        address: addr,
        from: df,
        to: dt || getTodaysEnd().toISOString(),
        sharedAccessToken: sat,
        isNightMode: emnm ? true : false,
        isCartesianGrid: emcg ? true : false,
        isWithMetricSettings: emms ? true : false,
        isWatermarkHidden: emhwm ? true : false,
        isSharedAxisEnabled: emsax ? true : false,
        metrics,
        metricIndicators,
        mergedMetrics,
        metricSettings: parseMetricGraphValue(parseArray(ws).map(parseJSON), metrics),
        colors: parseMetricGraphValue(parseArray(wc), metrics),
        drawings: parseDrawings(parseArray(wd).map(parseJSON)),
    };
    Object.assign(parsed, parseAxesMetrics(parseArray(wax), metrics));
    return parsed;
}
export function getChartWidgetLabel(widget, studio) {
    const { ticker } = studio;
    return widget.metrics
        .map(({ label, getLabel, project }) => {
        if (project)
            return label;
        return getLabel ? getLabel(ticker) : `${label} (${ticker})`;
    })
        .join(', ');
}
//# sourceMappingURL=utils.js.map