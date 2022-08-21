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
export const Node = Object.assign({ CANDLES: 'candle' }, LineNode, BarNode);
export const LINES = new Set(Object.values(LineNode));
export const BARS = new Set(Object.values(BarNode));
export const NodeAlias = {
    autoWidthBar: BarNode.BAR,
};
export function getMetricNodes(metrics, MetricSettings) {
    var _a;
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
    };
    for (let i = 0; i < metrics.length; i++) {
        const { key, node } = metrics[i];
        joinedCategories[i] = key;
        const metricNode = ((_a = MetricSettings[key]) === null || _a === void 0 ? void 0 : _a.node) || node;
        MetricNodes[(NodeAlias[metricNode] || metricNode) + 's'].push(key);
    }
    return MetricNodes;
}
//# sourceMappingURL=nodes.js.map