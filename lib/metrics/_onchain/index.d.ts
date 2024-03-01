export declare const DefiMetric: {
    defi_total_value_locked_usd: import("./../../metrics/utils").Node<Studio.Metric, "defi_total_value_locked_usd">;
};
export declare const BeaconMetric: {
    eth_beacon_deposits: import("./../../metrics/utils").Node<Studio.Metric, "eth_beacon_deposits">;
    eth_beacon_validator_withdrawals: import("./../../metrics/utils").Node<Studio.Metric, "eth_beacon_validator_withdrawals">;
    eth_beacon_reward_withdrawals: import("./../../metrics/utils").Node<Studio.Metric, "eth_beacon_reward_withdrawals">;
};
export declare const FeesMetric: {
    average_fees_usd: import("./../../metrics/utils").Node<Studio.Metric, "average_fees_usd">;
    median_fees_usd: import("./../../metrics/utils").Node<Studio.Metric, "median_fees_usd">;
    fees_burnt_5m: import("./../../metrics/utils").Node<Studio.Metric, "fees_burnt_5m">;
    fees_burnt_usd_5m: import("./../../metrics/utils").Node<Studio.Metric, "fees_burnt_usd_5m">;
};
export declare const NFTMetric: {
    nft_trades_count: import("./../../metrics/utils").Node<Studio.Metric, "nft_trades_count">;
    nft_trade_volume_usd: import("./../../metrics/utils").Node<Studio.Metric, "nft_trade_volume_usd">;
    nft_whale_trades_count: import("./../../metrics/utils").Node<Studio.Metric, "nft_whale_trades_count">;
    nft_whale_trade_volume_usd: import("./../../metrics/utils").Node<Studio.Metric, "nft_whale_trade_volume_usd">;
    nft_retail_trades_count: import("./../../metrics/utils").Node<Studio.Metric, "nft_retail_trades_count">;
    nft_retail_trade_volume_usd: import("./../../metrics/utils").Node<Studio.Metric, "nft_retail_trade_volume_usd">;
};
export declare const OnChainMetric: {
    [x: string]: import("./../../metrics/utils").Node<Studio.Metric, string>;
};
