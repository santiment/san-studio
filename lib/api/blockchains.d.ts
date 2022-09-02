declare type Blockchain = {
  blockchain: string
  infrastructure: string
  slug?: string
}
export declare const BLOCKCHAINS_NAMES: {
  btc: string
  eth: string
  bep20: string
  ripple: string
  cardano: string
  doge: string
  polygon: string
  avalanche: string
  ltc: string
  bch: string
  optimism: string
}
export declare const queryAvailableBlockchains: () => Promise<Blockchain[]>
export {}
