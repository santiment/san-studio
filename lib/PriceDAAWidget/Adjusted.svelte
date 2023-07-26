<script>import { Metric } from './../metrics';
import PriceDAAWidget from './index.svelte';
export let widget;
export let isSingleWidget;
export let deleteWidget;
const metrics = [Metric.price_usd, Metric.adjusted_price_daa_divergence];
</script>

<PriceDAAWidget {widget} {isSingleWidget} {deleteWidget} {metrics} prefix="Adjusted" />

<style>
</style>
