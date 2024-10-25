import { paintLine, updateLine } from './line.js';
import { paintHorizontalRay, updateHorizontalRay } from './horizontalRay.js';
import { paintEmoji, updateEmoji } from './emoji/index.js';
import { paintNote, updateNote } from './note.js';
import { ratioToAbsoluteCoordinates, absoluteToRatioCoordinates } from '../coordinates.js';
import { clearCtx } from '../../utils.js';
import { paintVerticalRay, updateVerticalRay } from './verticalRay.js';
const DrawingPainter = {
    line: paintLine,
    hray: paintHorizontalRay,
    vray: paintVerticalRay,
    emoji: paintEmoji,
    note: paintNote,
};
const DrawingUpdater = {
    line: updateLine,
    hray: updateHorizontalRay,
    vray: updateVerticalRay,
    emoji: updateEmoji,
    note: updateNote,
};
export const getDrawingUpdater = ({ type }) => DrawingUpdater[type];
export function paintDrawings(chart) {
    const { drawer, right, bottom, left, canvasWidth } = chart;
    const { ctx, minMax } = drawer;
    if (!minMax)
        return;
    if (process.browser)
        clearCtx(chart, ctx);
    drawDrawings(chart);
    if (process.browser) {
        ctx.clearRect(left, 0, -200, bottom);
        ctx.clearRect(right, 0, 200, bottom);
        ctx.clearRect(0, bottom, canvasWidth, 200);
    }
}
export function drawDrawings(chart) {
    var _a;
    const { drawer, width, height } = chart;
    const { drawings } = drawer;
    for (let i = 0, len = drawings.length; i < len; i++) {
        const drawing = drawings[i];
        const { relCoor, absCoor, ratioCoor } = drawing;
        if (absCoor.length === 0) {
            if (ratioCoor.length) {
                ratioToAbsoluteCoordinates(ratioCoor, absCoor, width, height);
                drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor);
            }
            else {
                drawer.updateAbsoluteByRelativeCoordinates(relCoor, absCoor);
                absoluteToRatioCoordinates(absCoor, ratioCoor, width, height);
            }
            (_a = getDrawingUpdater(drawing)) === null || _a === void 0 ? void 0 : _a(chart, drawing);
        }
        const painter = DrawingPainter[drawing.type];
        painter === null || painter === void 0 ? void 0 : painter(chart, drawing);
    }
}
//# sourceMappingURL=index.js.map