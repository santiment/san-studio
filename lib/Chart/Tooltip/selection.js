import { handleMove as handlePointEvent } from '@santiment-network/chart/events';
import { drawValueBubbleX } from '@santiment-network/chart/tooltip';
import { clearCtx, getDateDayMonthYear } from '../utils';
export function onSelection(chart, canvas, onPoinClick, onRangeSelect) {
    canvas.onmousedown = handlePointEvent(chart, (point) => {
        if (!point || chart.isDrawing)
            return;
        const startX = point.x;
        let endPoint = point;
        let endY = 0;
        chart.isSelecting = true;
        window.addEventListener('mouseup', onMouseUp);
        chart.drawSelection = (x, y, newPoint) => {
            if (chart.isDrawing)
                return cleanUp();
            plotRangeSelection(chart, x, startX - x, point);
            endY = y;
            endPoint = newPoint;
            return point;
        };
        function onMouseUp(e) {
            var _a;
            cleanUp();
            if (endPoint === point) {
                // NOTE: When the drawing is finished, last mouseup still will be triggered [@vanguard | May 25, 2021]
                if (!chart.isDrawing && onPoinClick)
                    onPoinClick(point, e);
                return;
            }
            clearCtx(chart, chart.tooltip.ctx);
            (_a = chart.drawTooltip) === null || _a === void 0 ? void 0 : _a.call(chart, endPoint, endY);
            onRangeSelect === null || onRangeSelect === void 0 ? void 0 : onRangeSelect(point, endPoint, e);
        }
        function cleanUp() {
            chart.drawSelection = undefined;
            chart.isSelecting = false;
            window.removeEventListener('mouseup', onMouseUp);
        }
    });
}
function plotRangeSelection(chart, left, width, startPoint) {
    const { tooltip, top, height, theme } = chart;
    const { ctx } = tooltip;
    ctx.save();
    const { x, value: datetime } = startPoint;
    const xValueFormatted = getDateDayMonthYear(datetime);
    drawValueBubbleX(chart, ctx, xValueFormatted, x, theme.bubbles);
    ctx.fillStyle = '#9faac435';
    ctx.fillRect(left, top, width, height);
    ctx.restore();
}
//# sourceMappingURL=selection.js.map