import { newDrawing } from '../utils';
export function newNote(drawing) {
    if (!drawing.text)
        drawing.text = 'Text';
    return newDrawing(Object.assign(drawing, { type: 'note' }));
}
const PADDING = 8;
const SIDES_PADDING = PADDING * 2;
const BG = '#FFEA79';
const BORDER = '#68B3F4';
const COLOR = '#2F354D';
const STYLE = `padding:${PADDING}px;white-space:pre-line;background:${BG};font:14px sans-serif;position:absolute;line-height:15px;word-break:keep-all`;
const EDIT_STYLE = STYLE + `;outline:0;border:1px solid ${BORDER};color:${COLOR}`;
function newInput(text, style = STYLE, x = -999, y = -999) {
    const input = document.createElement('div');
    input.contentEditable = 'true';
    input.setAttribute('style', style + `;left:${x}px;top:${y}px`);
    input.textContent = text;
    return input;
}
export function paintNote(chart, drawing) {
    const { hidden, text } = drawing;
    if (hidden || !text)
        return;
    const { ctx } = chart.drawer;
    const { absCoor, width, height } = drawing;
    const [x, y] = absCoor;
    ctx.save();
    ctx.fillStyle = BG;
    ctx.fillRect(x, y, width, height);
    const lines = text.split('\n');
    ctx.fillStyle = COLOR;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    for (let i = 0, len = lines.length; i < len; i++) {
        ctx.fillText(lines[i], x + PADDING, y + PADDING + 15 * i);
    }
    ctx.restore();
}
export function updateNote({ drawer }, drawing) {
    if (!drawing.width) {
        const { ctx } = drawer;
        ctx.save();
        const lines = drawing.text.split('\n');
        ctx.font = '14px sans-serif';
        let width = 0;
        let height = 0;
        for (let i = 0, len = lines.length; i < len; i++) {
            const lineWidth = ctx.measureText(lines[i]).width;
            if (lineWidth > width)
                width = lineWidth;
            height += 14;
        }
        ctx.restore();
        drawing.width = width + SIDES_PADDING;
        drawing.height = height + SIDES_PADDING;
    }
}
// ------------------------
// --- HOVERING ---
// ------------------------
export function checkNoteIsHovered(_, drawing, mouseXY) {
    if (drawing.hidden)
        return false;
    const { absCoor, width, height } = drawing;
    const [x, y] = absCoor;
    const [mouseX, mouseY] = mouseXY;
    return x < mouseX && mouseX < x + width && y < mouseY && mouseY < y + height;
}
export function paintNoteHover({ drawer }, drawing) {
    if (drawing.hidden)
        return;
    const { ctx } = drawer;
    const { absCoor, width, height } = drawing;
    const [x, y] = absCoor;
    ctx.save();
    ctx.strokeStyle = BORDER;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
}
// ------------------------
// --- DRAGGING ---
// ------------------------
export function noteDragModifier(drawing, [x, y], _, xDiff, yDiff) {
    drawing.absCoor[0] = x + xDiff;
    drawing.absCoor[1] = y + yDiff;
}
// ------------------------
// --- DOUBLE CLICK ---
// ------------------------
const stopPropagation = (e) => e.stopImmediatePropagation();
export function handleNoteDoubleClick(drawer, drawing, onDrawingModified) {
    var _a;
    drawing.hidden = true;
    const { absCoor, text, width, height } = drawing;
    const [x, y] = absCoor;
    const parent = drawer.canvas.parentNode;
    const input = newInput(text, EDIT_STYLE, x - 1, y - 1);
    input.onmousedown = stopPropagation;
    input.ondblclick = stopPropagation;
    input.onkeydown = stopPropagation;
    input.onblur = () => {
        const { textContent, clientWidth, clientHeight } = input;
        if (!textContent) {
            drawer.deleteDrawing(drawing);
            input.remove();
            drawing.hidden = false;
            return;
        }
        const newText = extractInputText(input);
        if (text !== newText) {
            drawing.text = newText;
            drawing.width = clientWidth;
            drawing.height = clientHeight;
            onDrawingModified(drawing, drawing.ratioCoor.slice(), [text, width, height]);
        }
        drawing.hidden = false;
        input.remove();
        drawer.redraw();
    };
    parent.append(input);
    (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.selectAllChildren(input);
    drawer.redraw();
}
function extractInputText(input) {
    const children = input.childNodes;
    let text = children[0].textContent;
    for (let i = 1, len = children.length; i < len; i++) {
        text += '\n' + children[i].textContent;
    }
    return text;
}
//# sourceMappingURL=note.js.map