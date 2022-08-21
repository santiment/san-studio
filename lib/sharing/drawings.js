import { newDrawing } from './../../lib/Chart/Drawer/utils';
const DrawingShare = {
    emoji: ({ id, size }) => [id, size],
    note: ({ text }) => [text],
};
// TYPE GUARDS
DrawingShare;
DrawingShare;
const shareBasicDrawing = ({ type, relCoor }) => [type, relCoor];
export function shareDrawings(drawings = []) {
    return drawings.map((drawing) => {
        const { type } = drawing;
        let data = shareBasicDrawing(drawing);
        const sharer = DrawingShare[type];
        if (sharer)
            data = data.concat(sharer(drawing));
        return data;
    });
}
const DrawingParse = {
    emoji: ([id, size]) => ({ id, size }),
    note: ([text]) => ({ text }),
};
export function parseDrawings(drawings = []) {
    return drawings.map(([type, relCoor, ...data]) => {
        const drawing = { type, relCoor };
        const parser = DrawingParse[type];
        if (parser)
            Object.assign(drawing, parser(data));
        return newDrawing(drawing);
    });
}
//# sourceMappingURL=drawings.js.map