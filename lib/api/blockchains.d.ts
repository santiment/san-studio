declare type Blockchain = {
    blockchain: string;
    infrastructure: string;
    slug?: string;
};
export declare const queryAvailableBlockchains: () => Promise<Blockchain[]>;
export {};
