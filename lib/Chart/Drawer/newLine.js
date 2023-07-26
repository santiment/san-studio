import { getEventCoordinates } from './utils.js';
import { absoluteToRatioCoordinates } from './coordinates.js';
import { LineLockType, getLineLockType, updateLine, newLine } from './drawings/line.js';
export function newLineCreationHandler(chart, onNewDrawingStart, onNewDrawingEnd) {
    const { drawer, canvas, width, height } = chart;
    const parent = canvas.parentNode;
    function onMouseDown(e) {
        const [startX, startY] = getEventCoordinates(e);
        const drawing = newLine(startX, startY);
        const { absCoor, relCoor, ratioCoor } = drawing;
        updateLine(undefined, drawing);
        drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor);
        onNewDrawingStart(drawing);
        parent.removeEventListener('mousedown', onMouseDown);
        parent.addEventListener('mousemove', onMouseMove);
        parent.addEventListener('mousedown', finishLine);
        function onMouseMove(e) {
            const [moveX, moveY] = getEventCoordinates(e);
            const lineLock = e.shiftKey
                ? getLineLockType(startX, startY, moveX, moveY)
                : LineLockType.FREE;
            drawing.absCoor[2] = lineLock === LineLockType.X ? startX : moveX;
            drawing.absCoor[3] = lineLock === LineLockType.Y ? startY : moveY;
            updateLine(undefined, drawing);
            absoluteToRatioCoordinates(absCoor, ratioCoor, width, height);
            drawer.updateRelativeByAbsoluteCoordinates(absCoor, relCoor);
            drawer.redraw();
        }
        function finishLine() {
            parent.removeEventListener('mousemove', onMouseMove);
            parent.removeEventListener('mousedown', finishLine);
            onNewDrawingEnd(drawing);
        }
    }
    return onMouseDown;
}
//# sourceMappingURL=newLine.js.map