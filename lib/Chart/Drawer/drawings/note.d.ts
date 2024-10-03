declare type NewNote = Partial<Pick<SAN.Charts.Note, 'text' | 'absCoor' | 'relCoor' | 'ratioCoor'>>;
export declare function newNote(drawing: NewNote): SAN.Charts.Note;
export declare function paintNote(chart: SAN.Charts.Chart, drawing: SAN.Charts.Note): void;
export declare function updateNote({ drawer }: SAN.Charts.Chart, drawing: SAN.Charts.Note): void;
export declare function checkNoteIsHovered(_: any, drawing: SAN.Charts.Note, mouseXY: [number, number]): boolean;
export declare function paintNoteHover({ drawer }: SAN.Charts.Chart, drawing: SAN.Charts.Note): void;
export declare function noteDragModifier(drawing: SAN.Charts.Note, [x, y]: SAN.Charts.Note['absCoor'], _: any, xDiff: number, yDiff: number): void;
export declare function handleNoteDoubleClick(drawer: SAN.Charts.Drawer, drawing: SAN.Charts.Note, onDrawingModified: any): void;
export {};
