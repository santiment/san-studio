import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const SparkMetric = each(
  {
    spark_action_deposits: {
      label: 'Spark Deposits',
      node: 'bar',
    },
    spark_action_deposits_usd: {
      label: 'Spark Deposits in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    spark_action_liquidations: {
      label: 'Spark Liquidations',
      node: 'bar',
    },
    spark_action_liquidations_usd: {
      label: 'Spark Liquidations in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    spark_action_new_debt: {
      label: 'Spark New Debt',
      node: 'bar',
    },
    spark_action_new_debt_usd: {
      label: 'Spark New Debt in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    spark_action_repayments: {
      label: 'Spark Repayments',
      node: 'bar',
    },
    spark_action_repayments_usd: {
      label: 'Spark Repayments in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    spark_supply_apy: {
      label: 'Spark Supply APY',
    },
    spark_borrow_apy: {
      label: 'Spark Borrow APY',
    },

    spark_total_deposits_usd: {
      label: 'Spark Protocol Total Deposits in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    spark_total_liquidations_usd: {
      label: 'Spark Protocol Total Liquidations in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    spark_total_new_debt_usd: {
      label: 'Spark Protocol Total New Debt in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    spark_total_repayments_usd: {
      label: 'Spark Protocol Total Repayments in USD',
      formatter: usdFormatter,
      node: 'bar',
    },
    spark_active_addresses: {
      label: 'Spark Protocol Active Addresses',
      node: 'bar',
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'Spark'
  },
)
