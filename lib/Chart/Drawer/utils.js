export function newDrawing(drawing) {
    const { absCoor = [], relCoor = [], ratioCoor = [], handlers = [] } = drawing;
    drawing.absCoor = absCoor;
    drawing.relCoor = relCoor;
    drawing.ratioCoor = ratioCoor;
    drawing.handlers = handlers;
    return drawing;
}
export function getEventCoordinates(e) {
    const { offsetX, offsetY, target } = e;
    const { offsetLeft, offsetTop } = target;
    return [offsetX + offsetLeft, offsetY + offsetTop];
}
export function newRectHandle(x, y, width, height) {
    const handle = new Path2D();
    handle.rect(x, y, width, height);
    return handle;
}
export function newRoundHandle(x, y) {
    const handle = new Path2D();
    handle.arc(x, y, 6, 0, 2 * Math.PI);
    return handle;
}
export function checkIsOnStrokeArea(ctx, shape, x, y) {
    if (ctx.isPointInStroke(shape, x, y))
        return true;
    for (let i = 1; i < 8; i++) {
        if (ctx.isPointInStroke(shape, x - i, y - i) ||
            ctx.isPointInStroke(shape, x - i, y + i) ||
            ctx.isPointInStroke(shape, x + i, y - i) ||
            ctx.isPointInStroke(shape, x + i, y + i)) {
            return true;
        }
    }
    return false;
}
export function hook(node, event, callback) {
    node.addEventListener(event, callback);
    return () => node.removeEventListener(event, callback);
}
//# sourceMappingURL=utils.js.map