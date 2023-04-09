import { withScroll } from 'san-webkit/lib/ui/history';
import { resetDrawingAbsoluteCoordinates } from './../Chart/Drawer/coordinates';
export function recordNewDrawing(History, ChartDrawer, widget, drawing) {
    History.add('New drawing', withScroll(widget, () => ChartDrawer.deleteDrawing(drawing)), withScroll(widget, () => {
        resetDrawingAbsoluteCoordinates(drawing);
        ChartDrawer.addDrawing(drawing);
    }));
}
export function recordDeleteDrawing(History, ChartDrawer, widget, drawing) {
    History.add('Delete drawing', withScroll(widget, () => {
        resetDrawingAbsoluteCoordinates(drawing);
        ChartDrawer.addDrawing(drawing);
    }), withScroll(widget, () => ChartDrawer.deleteDrawing(drawing)));
}
export function recordDrawingModified(History, widget, drawing, oldRatioCoor, data) {
    const newRatioCoor = drawing.ratioCoor.slice();
    function reset(ratioCoor) {
        if (drawing.type === 'emoji') {
            const emoji = drawing;
            const { size } = emoji;
            emoji.size = data[0];
            data[0] = size;
        }
        else if (drawing.type === 'note' && data) {
            const note = drawing;
            const { text, width, height } = note;
            note.text = data[0];
            data[0] = text;
            note.width = data[1];
            data[1] = width;
            note.height = data[2];
            data[2] = height;
        }
        applyCoordinates(drawing.ratioCoor, ratioCoor);
        resetDrawingAbsoluteCoordinates(drawing);
        widget.ChartDrawer.redrawDrawers();
    }
    History.add('Drawing modified', withScroll(widget, () => reset(oldRatioCoor)), withScroll(widget, () => reset(newRatioCoor)));
}
function applyCoordinates(coordinates, newCoordinates) {
    for (let i = 0, len = newCoordinates.length; i < len; i++) {
        coordinates[i] = newCoordinates[i];
    }
}
export function recordDrawingVisibility(History, widget, isHidden) {
    History.add(isHidden ? 'Hide drawings' : 'Show drawings', withScroll(widget, () => widget.ChartDrawer.toggleVisibility(!isHidden)), withScroll(widget, () => widget.ChartDrawer.toggleVisibility(isHidden)));
}
//# sourceMappingURL=drawings.js.map