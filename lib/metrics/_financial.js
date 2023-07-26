import { MetricCategory } from './graph.js';
import { each } from './utils.js';
import { usdFormatter, btcFormatter, ethFormatter } from './formatters.js';
import { Node } from './../Chart/nodes.js';
const NFTPrices = each({
    nft_collection_min_price: {
        label: 'Minimum Daily Price of NFT Collections in ETH',
    },
    nft_collection_max_price: {
        label: 'Maximum Daily Price of NFT Collections in ETH',
    },
    nft_collection_avg_price: {
        label: 'Average Daily Price of NFT Collections in ETH',
    },
    nft_collection_min_price_usd: {
        label: 'Minimum Daily Price of NFT Collections in USD',
    },
    nft_collection_max_price_usd: {
        label: 'Maximum Daily Price of NFT Collections in USD',
    },
    nft_collection_avg_price_usd: {
        label: 'Average Daily Price of NFT Collections in USD',
    },
}, (metric) => {
    metric.isNFTMetric = true;
});
const PriceVolatilityMetric = each({
    price_volatility_1d: { label: 'Price Volatility 1d' },
    price_volatility_1w: { label: 'Price Volatility 1w' },
    price_volatility_2w: { label: 'Price Volatility 2w' },
    price_volatility_4w: { label: 'Price Volatility 4w' },
}, () => { });
export const FinancialMetric = each(Object.assign(Object.assign({ price_usd: {
        label: 'Price',
        formatter: usdFormatter,
    }, price_btc: {
        label: 'Price BTC',
        formatter: btcFormatter,
        checkIsVisible: ({ slug }) => slug !== 'bitcoin',
    }, price_eth: {
        label: 'Price ETH',
        formatter: ethFormatter,
        checkIsVisible: ({ slug }) => slug !== 'ethereum',
    }, marketcap_usd: {
        label: 'Marketcap',
        formatter: usdFormatter,
    }, volume_usd: {
        node: Node.BAR,
        label: 'Volume',
    } }, PriceVolatilityMetric), NFTPrices), (metric) => {
    metric.category = MetricCategory.Financial;
});
//# sourceMappingURL=_financial.js.map