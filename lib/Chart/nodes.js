const LineNode = {
    LINE: 'line',
    FILLED_LINE: 'filledLine',
    GRADIENT_LINE: 'gradientLine',
    AREA: 'area',
};
const BarNode = {
    BAR: 'bar',
    GREEN_RED_BAR: 'greenRedBar',
};
export const Node = Object.assign({ CANDLES: 'candle', REFERENCE: 'reference' }, LineNode, BarNode);
export const LINES = new Set(Object.values(LineNode));
export const BARS = new Set(Object.values(BarNode));
export const NodeAlias = {
    autoWidthBar: BarNode.BAR,
};
export function getMetricNodes(metrics, MetricSettings) {
    var _a, _b;
    const joinedCategories = new Array(metrics.length);
    const MetricNodes = {
        joinedCategories,
        candles: [],
        lines: [],
        bars: [],
        areas: [],
        filledLines: [],
        gradientLines: [],
        greenRedBars: [],
        references: [],
    };
    for (let i = 0; i < metrics.length; i++) {
        const { key, node } = metrics[i];
        joinedCategories[i] = key;
        const metricNode = ((_a = MetricSettings[key]) === null || _a === void 0 ? void 0 : _a.node) || node;
        (_b = MetricNodes[(NodeAlias[metricNode] || metricNode) + 's']) === null || _b === void 0 ? void 0 : _b.push(key);
    }
    return MetricNodes;
}
//# sourceMappingURL=nodes.js.map