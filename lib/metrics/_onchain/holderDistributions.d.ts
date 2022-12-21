import type { Node } from './../../../lib/metrics/utils';
declare const HOLDER_DISTRIBUTIONS: readonly [readonly ["_0_to_0001", "[0 - 0.001) coins", "_0_to_0.001"], readonly ["_0001_to_001", "[0.001 - 0.01) coins", "_0.001_to_0.01"], readonly ["_001_to_01", "[0.01 - 0.1) coins", "_0.01_to_0.1"], readonly ["_01_to_1", "[0.1 - 1) coins", "_0.1_to_1"], readonly ["_1_to_10", "[1 - 10) coins"], readonly ["_10_to_100", "[10 - 100) coins"], readonly ["_100_to_1k", "[100 - 1,000) coins"], readonly ["_1k_to_10k", "[1,000 - 10,000) coins"], readonly ["_10k_to_100k", "[10,000 - 100,000) coins"], readonly ["_100k_to_1M", "[100,000  - 1,000,000) coins"], readonly ["_1M_to_10M", "[1,000,000 - 10,000,000) coins"], readonly ["_10M_to_100M", "[10,000,000 - 100,000,000) coins"], readonly ["_100M_to_1B", "[100,000,000 - 1,000,000,000) coins"], readonly ["_1B_to_inf", "[1,000,000,000 - infinity) coins"]];
declare type HolderDistributions<T extends string> = {
    [K in typeof HOLDER_DISTRIBUTIONS[number][0] as `${T}${K}`]: Node<Studio.Metric, `${T}${K}`>;
};
export declare const HOLDERS_DISTRIBUTION = "holders_distribution";
export declare const HolderDistributionAbsoluteMetric: HolderDistributions<"holders_distribution">;
export declare const HOLDERS_DISTRUBTION_PERCENT = "percent_of_holders_distribution_combined_balance";
export declare const HolderDistributionBalancePercentMetric: HolderDistributions<"percent_of_holders_distribution_combined_balance">;
export declare const HOLDERS_DISTRUBTION_COMBINED = "holders_distribution_combined_balance";
export declare const HolderDistributionBalanceAbsoluteMetric: HolderDistributions<"holders_distribution_combined_balance">;
export declare const HOLDERS_LABELED_DISTRIBUTION = "holders_labeled_distribution";
export declare const HoldersLabeledDistributionMetric: HolderDistributions<"holders_labeled_distribution">;
export declare const HolderDistributionMetric: {
    holders_labeled_distribution_0_to_0001: Node<Studio.Metric, "holders_labeled_distribution_0_to_0001">;
    holders_labeled_distribution_0001_to_001: Node<Studio.Metric, "holders_labeled_distribution_0001_to_001">;
    holders_labeled_distribution_001_to_01: Node<Studio.Metric, "holders_labeled_distribution_001_to_01">;
    holders_labeled_distribution_01_to_1: Node<Studio.Metric, "holders_labeled_distribution_01_to_1">;
    holders_labeled_distribution_1_to_10: Node<Studio.Metric, "holders_labeled_distribution_1_to_10">;
    holders_labeled_distribution_10_to_100: Node<Studio.Metric, "holders_labeled_distribution_10_to_100">;
    holders_labeled_distribution_100_to_1k: Node<Studio.Metric, "holders_labeled_distribution_100_to_1k">;
    holders_labeled_distribution_1k_to_10k: Node<Studio.Metric, "holders_labeled_distribution_1k_to_10k">;
    holders_labeled_distribution_10k_to_100k: Node<Studio.Metric, "holders_labeled_distribution_10k_to_100k">;
    holders_labeled_distribution_100k_to_1M: Node<Studio.Metric, "holders_labeled_distribution_100k_to_1M">;
    holders_labeled_distribution_1M_to_10M: Node<Studio.Metric, "holders_labeled_distribution_1M_to_10M">;
    holders_labeled_distribution_10M_to_100M: Node<Studio.Metric, "holders_labeled_distribution_10M_to_100M">;
    holders_labeled_distribution_100M_to_1B: Node<Studio.Metric, "holders_labeled_distribution_100M_to_1B">;
    holders_labeled_distribution_1B_to_inf: Node<Studio.Metric, "holders_labeled_distribution_1B_to_inf">;
    holders_distribution_combined_balance_0_to_0001: Node<Studio.Metric, "holders_distribution_combined_balance_0_to_0001">;
    holders_distribution_combined_balance_0001_to_001: Node<Studio.Metric, "holders_distribution_combined_balance_0001_to_001">;
    holders_distribution_combined_balance_001_to_01: Node<Studio.Metric, "holders_distribution_combined_balance_001_to_01">;
    holders_distribution_combined_balance_01_to_1: Node<Studio.Metric, "holders_distribution_combined_balance_01_to_1">;
    holders_distribution_combined_balance_1_to_10: Node<Studio.Metric, "holders_distribution_combined_balance_1_to_10">;
    holders_distribution_combined_balance_10_to_100: Node<Studio.Metric, "holders_distribution_combined_balance_10_to_100">;
    holders_distribution_combined_balance_100_to_1k: Node<Studio.Metric, "holders_distribution_combined_balance_100_to_1k">;
    holders_distribution_combined_balance_1k_to_10k: Node<Studio.Metric, "holders_distribution_combined_balance_1k_to_10k">;
    holders_distribution_combined_balance_10k_to_100k: Node<Studio.Metric, "holders_distribution_combined_balance_10k_to_100k">;
    holders_distribution_combined_balance_100k_to_1M: Node<Studio.Metric, "holders_distribution_combined_balance_100k_to_1M">;
    holders_distribution_combined_balance_1M_to_10M: Node<Studio.Metric, "holders_distribution_combined_balance_1M_to_10M">;
    holders_distribution_combined_balance_10M_to_100M: Node<Studio.Metric, "holders_distribution_combined_balance_10M_to_100M">;
    holders_distribution_combined_balance_100M_to_1B: Node<Studio.Metric, "holders_distribution_combined_balance_100M_to_1B">;
    holders_distribution_combined_balance_1B_to_inf: Node<Studio.Metric, "holders_distribution_combined_balance_1B_to_inf">;
    percent_of_holders_distribution_combined_balance_0_to_0001: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_0_to_0001">;
    percent_of_holders_distribution_combined_balance_0001_to_001: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_0001_to_001">;
    percent_of_holders_distribution_combined_balance_001_to_01: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_001_to_01">;
    percent_of_holders_distribution_combined_balance_01_to_1: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_01_to_1">;
    percent_of_holders_distribution_combined_balance_1_to_10: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_1_to_10">;
    percent_of_holders_distribution_combined_balance_10_to_100: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_10_to_100">;
    percent_of_holders_distribution_combined_balance_100_to_1k: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_100_to_1k">;
    percent_of_holders_distribution_combined_balance_1k_to_10k: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_1k_to_10k">;
    percent_of_holders_distribution_combined_balance_10k_to_100k: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_10k_to_100k">;
    percent_of_holders_distribution_combined_balance_100k_to_1M: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_100k_to_1M">;
    percent_of_holders_distribution_combined_balance_1M_to_10M: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_1M_to_10M">;
    percent_of_holders_distribution_combined_balance_10M_to_100M: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_10M_to_100M">;
    percent_of_holders_distribution_combined_balance_100M_to_1B: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_100M_to_1B">;
    percent_of_holders_distribution_combined_balance_1B_to_inf: Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_1B_to_inf">;
    holders_distribution_0_to_0001: Node<Studio.Metric, "holders_distribution_0_to_0001">;
    holders_distribution_0001_to_001: Node<Studio.Metric, "holders_distribution_0001_to_001">;
    holders_distribution_001_to_01: Node<Studio.Metric, "holders_distribution_001_to_01">;
    holders_distribution_01_to_1: Node<Studio.Metric, "holders_distribution_01_to_1">;
    holders_distribution_1_to_10: Node<Studio.Metric, "holders_distribution_1_to_10">;
    holders_distribution_10_to_100: Node<Studio.Metric, "holders_distribution_10_to_100">;
    holders_distribution_100_to_1k: Node<Studio.Metric, "holders_distribution_100_to_1k">;
    holders_distribution_1k_to_10k: Node<Studio.Metric, "holders_distribution_1k_to_10k">;
    holders_distribution_10k_to_100k: Node<Studio.Metric, "holders_distribution_10k_to_100k">;
    holders_distribution_100k_to_1M: Node<Studio.Metric, "holders_distribution_100k_to_1M">;
    holders_distribution_1M_to_10M: Node<Studio.Metric, "holders_distribution_1M_to_10M">;
    holders_distribution_10M_to_100M: Node<Studio.Metric, "holders_distribution_10M_to_100M">;
    holders_distribution_100M_to_1B: Node<Studio.Metric, "holders_distribution_100M_to_1B">;
    holders_distribution_1B_to_inf: Node<Studio.Metric, "holders_distribution_1B_to_inf">;
};
export declare const HOLDER_DISTRIBUTION_ABSOLUTE_METRICS: (Node<Studio.Metric, "holders_distribution_0_to_0001"> | Node<Studio.Metric, "holders_distribution_0001_to_001"> | Node<Studio.Metric, "holders_distribution_001_to_01"> | Node<Studio.Metric, "holders_distribution_01_to_1"> | Node<Studio.Metric, "holders_distribution_1_to_10"> | Node<Studio.Metric, "holders_distribution_10_to_100"> | Node<Studio.Metric, "holders_distribution_100_to_1k"> | Node<Studio.Metric, "holders_distribution_1k_to_10k"> | Node<Studio.Metric, "holders_distribution_10k_to_100k"> | Node<Studio.Metric, "holders_distribution_100k_to_1M"> | Node<Studio.Metric, "holders_distribution_1M_to_10M"> | Node<Studio.Metric, "holders_distribution_10M_to_100M"> | Node<Studio.Metric, "holders_distribution_100M_to_1B"> | Node<Studio.Metric, "holders_distribution_1B_to_inf">)[];
export declare const LABELED_HOLDER_DISTRIBUTION_METRICS: (Node<Studio.Metric, "holders_labeled_distribution_0_to_0001"> | Node<Studio.Metric, "holders_labeled_distribution_0001_to_001"> | Node<Studio.Metric, "holders_labeled_distribution_001_to_01"> | Node<Studio.Metric, "holders_labeled_distribution_01_to_1"> | Node<Studio.Metric, "holders_labeled_distribution_1_to_10"> | Node<Studio.Metric, "holders_labeled_distribution_10_to_100"> | Node<Studio.Metric, "holders_labeled_distribution_100_to_1k"> | Node<Studio.Metric, "holders_labeled_distribution_1k_to_10k"> | Node<Studio.Metric, "holders_labeled_distribution_10k_to_100k"> | Node<Studio.Metric, "holders_labeled_distribution_100k_to_1M"> | Node<Studio.Metric, "holders_labeled_distribution_1M_to_10M"> | Node<Studio.Metric, "holders_labeled_distribution_10M_to_100M"> | Node<Studio.Metric, "holders_labeled_distribution_100M_to_1B"> | Node<Studio.Metric, "holders_labeled_distribution_1B_to_inf">)[];
export declare const HOLDER_DISTRIBUTION_BALANCE_ABSOLUTE_METRICS: (Node<Studio.Metric, "holders_distribution_combined_balance_0_to_0001"> | Node<Studio.Metric, "holders_distribution_combined_balance_0001_to_001"> | Node<Studio.Metric, "holders_distribution_combined_balance_001_to_01"> | Node<Studio.Metric, "holders_distribution_combined_balance_01_to_1"> | Node<Studio.Metric, "holders_distribution_combined_balance_1_to_10"> | Node<Studio.Metric, "holders_distribution_combined_balance_10_to_100"> | Node<Studio.Metric, "holders_distribution_combined_balance_100_to_1k"> | Node<Studio.Metric, "holders_distribution_combined_balance_1k_to_10k"> | Node<Studio.Metric, "holders_distribution_combined_balance_10k_to_100k"> | Node<Studio.Metric, "holders_distribution_combined_balance_100k_to_1M"> | Node<Studio.Metric, "holders_distribution_combined_balance_1M_to_10M"> | Node<Studio.Metric, "holders_distribution_combined_balance_10M_to_100M"> | Node<Studio.Metric, "holders_distribution_combined_balance_100M_to_1B"> | Node<Studio.Metric, "holders_distribution_combined_balance_1B_to_inf">)[];
export declare const HOLDER_DISTRIBUTION_BALANCE_PERCENT_METRICS: (Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_0_to_0001"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_0001_to_001"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_001_to_01"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_01_to_1"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_1_to_10"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_10_to_100"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_100_to_1k"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_1k_to_10k"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_10k_to_100k"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_100k_to_1M"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_1M_to_10M"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_10M_to_100M"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_100M_to_1B"> | Node<Studio.Metric, "percent_of_holders_distribution_combined_balance_1B_to_inf">)[];
export declare function getType(key: string): string;
export {};
