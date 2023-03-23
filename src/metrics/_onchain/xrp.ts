import { each } from '../utils'
import { usdFormatter } from '../formatters'

export const XrpMetric = each(
  {
    daily_assets_issued: {
      label: 'Daily new XRPL assets issued',
    },
    total_assets_issued: {
      label: 'Total amount of XRPL assets issued',
    },
    daily_trustlines_count_change: {
      label: 'Daily net amount of XRPL trustlines created',
    },
    total_trustlines_count: {
      label: 'Total amount of XRPL trustlines created',
    },
    dex_volume_in_xrp_5m: {
      label: 'DEX volume in XRP',
    },
    dex_volume_in_usd_5m: {
      label: 'DEX volume in USD',
      formatter: usdFormatter,
    },
  },
  (metric: Studio.Metric) => {
    metric.group = 'XRP'
    metric.checkIsVisible = ({ slug }) => slug === 'xrp' || slug === 'ripple'
  },
)
