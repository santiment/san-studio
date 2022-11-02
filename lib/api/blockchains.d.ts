declare type BlockchainType = {
    infrastructure: string;
    slug: string;
    name: string;
};
export declare const Blockchain: {
    BTC: any;
    ETH: any;
    BEP20: any;
    Ripple: any;
    Cardano: any;
    DOGE: any;
    Polygon: any;
    Avalanche: any;
    Arbitrum: any;
    LTC: any;
    BCH: any;
    Optimism: any;
};
export declare const queryAvailableBlockchains: () => Promise<BlockchainType[]>;
export declare const queryProjectBlockchain: (slug: string) => Promise<string>;
export {};
