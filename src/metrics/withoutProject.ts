import { NFTMetric } from './_onchain/index'
import { TopHoldersMetrics } from './_onchain_labels'

export const NO_PROJECT_METRICS = Object.keys(NFTMetric).concat(
  TopHoldersMetrics.percent_of_whale_stablecoin_total_supply.key,
)
