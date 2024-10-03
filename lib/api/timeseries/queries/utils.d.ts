export declare type Variables = {
    key: string;
    from: string;
    to: string;
    slug: string;
    interval?: string;
};
export declare function newPrecacher(dataAccessor: any, modifyData?: (key: string, datetime: number, value: number) => {
    [x: string]: number;
    datetime: number;
}, prepareResult?: any): ({ key }: Variables) => (response: any) => any;
