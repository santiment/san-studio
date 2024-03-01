export declare enum MetricCategory {
    Financial = "Financial",
    Social = "Social",
    Development = "Development",
    Derivatives = "Derivatives",
    Indicators = "Indicators",
    OnChain = "On-chain",
    OnChainLabels = "On-chain Labels"
}
export declare enum MetricGroup {
    TotalSentiment = "Total sentiment",
    RedditSentiment = "Reddit sentiment",
    TelegramSentiment = "Telegram sentiment",
    TwitterSentiment = "Twitter sentiment",
    SupplyDistribution = "Supply distribution",
    Exchanges = "Exchanges",
    TopHolders = "Top Holders"
}
export declare type SelectorNode = {
    key: string;
    label: string;
    group?: string;
} | Studio.Metric;
export declare type SelectorGraph = {
    [K in MetricCategory]: SelectorNode[];
};
