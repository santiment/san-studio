type Variables = {
    key: string;
    slug: string;
    from: string;
    to: string;
    interval: string;
};
export declare function queryOHLC(variables: Variables): Promise<any>;
export {};
