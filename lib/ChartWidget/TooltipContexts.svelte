<script>
  import OptionsMenuTooltipCtx from './../../lib/ChartWidget/OptionsMenuTooltipCtx.svelte'
  import MetricErrorTooltipCtx from './../../lib/ChartWidget/Metrics/ErrorTooltipCtx.svelte'
</script>

<MetricErrorTooltipCtx>
  <OptionsMenuTooltipCtx>
    <slot />
  </OptionsMenuTooltipCtx>
</MetricErrorTooltipCtx>
