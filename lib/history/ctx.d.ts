export declare const getHistoryContext: () => {
    get(): import("webkit/ui/history").Command[];
    getCursor(): number;
    add(name: string, undo: () => void, redo?: (() => void) | undefined): void;
    undo(): void;
    redo(): void;
};
