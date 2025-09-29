export function transformMorpho(metric, metricSettings) {
    const key = (metric.base || metric).key;
    if (key === 'morpho_vaults_total_supplied_usd' || key === 'morpho_vaults_apy') {
        if (!metricSettings.label_fqn) {
            metricSettings.label_fqn = 'santiment/morpho_vault->steakhouse usdc:v1';
        }
    }
    return metricSettings;
}
//# sourceMappingURL=morpho.js.map