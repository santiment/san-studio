declare type Context = {
    cursor: number;
    items: any[];
    onSelect: (item: any) => void;
};
export declare function handleNavigation(e: KeyboardEvent, context: Context): void | boolean;
export {};
