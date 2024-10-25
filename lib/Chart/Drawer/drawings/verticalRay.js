import { newDrawing, newRectHandle, checkIsOnStrokeArea, getEventCoordinates } from '../utils.js';
import { Color } from '../../theme.js';
export function newVerticalRay(x) {
    const vray = {
        type: 'vray',
        absCoor: [x, 0],
    };
    return newDrawing(vray);
}
export function paintVerticalRay(chart, drawing) {
    const { ctx } = chart.drawer;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = Color.baliHai;
    ctx.stroke(drawing.shape);
    ctx.restore();
}
export function updateVerticalRay({ top, bottom }, drawing) {
    const { absCoor } = drawing;
    const x = absCoor[0];
    const shape = new Path2D();
    drawing.shape = shape;
    shape.moveTo(x, top);
    shape.lineTo(x, bottom);
    const offset = 4;
    // drawing.handlers = [newRectHandle((right - left) / 2, y + offset, -9, -9)]
    drawing.handlers = [newRectHandle(x + offset, (bottom - top) / 2, -9, -9)];
}
// ------------------------
// --- HOVERING ---
// ------------------------
export function checkVerticalRayIsHovered(ctx, drawing, mouseXY, dpr) {
    const { shape, handlers } = drawing;
    const x = mouseXY[0] * dpr;
    const y = mouseXY[1] * dpr;
    if (checkIsOnStrokeArea(ctx, shape, x, y))
        return true;
    if (ctx.isPointInPath(handlers[0], x, y))
        return true;
    return false;
}
export function paintVerticalRayHover({ drawer, theme }, drawing) {
    const { ctx } = drawer;
    const { handlers } = drawing;
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = Color.baliHai;
    ctx.fillStyle = theme.bg;
    ctx.fill(handlers[0]);
    ctx.stroke(handlers[0]);
    ctx.restore();
}
// ------------------------
// --- DRAGGING ---
// ------------------------
export function verticalRayDragModifier(drawing, [x], __, xDiff) {
    drawing.absCoor[0] = x + xDiff;
}
//
export function newVerticalRayCreationHandler(chart, onNewDrawingStart, onNewDrawingEnd) {
    const { drawer, canvas } = chart;
    const parent = canvas.parentNode;
    function onMouseDown(e) {
        parent.removeEventListener('mousedown', onMouseDown);
        const x = getEventCoordinates(e)[0];
        const drawing = newVerticalRay(x);
        const { absCoor, relCoor } = drawing;
        updateVerticalRay(chart, drawing);
        drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor);
        onNewDrawingStart(drawing);
        onNewDrawingEnd(drawing);
    }
    return onMouseDown;
}
//# sourceMappingURL=verticalRay.js.map