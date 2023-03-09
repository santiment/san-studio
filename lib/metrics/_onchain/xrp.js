import { each } from '../utils';
export const XrpMetric = each({
    daily_assets_issued: {
        label: 'Daily new XRPL assets issued',
    },
    total_assets_issued: {
        label: 'Total amount of XRPL assets issued',
    },
    daily_trustlines_count_change: {
        label: 'Daily amount of XRPL trustlines created or closed',
    },
    total_trustlines_count: {
        label: 'Total amount of XRPL trustlines created',
    },
    daily_dex_volume_in_xrp: {
        label: 'Daily DEX volume in XRP',
    },
}, (metric) => {
    metric.group = 'XRP';
    metric.checkIsVisible = ({ slug }) => slug === 'xrp' || slug === 'ripple';
});
//# sourceMappingURL=xrp.js.map