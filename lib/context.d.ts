export declare const CTX = "STUDIO";
export declare const newStudioCtx: () => Map<any, any>;
export declare const getStudioCtx: () => Map<string, any>;
export declare function setStudioContext<T>(key: string, value: T): T;
export declare const getStudioContext: (key: string) => any;
