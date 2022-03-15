<script>
  import OptionsMenuTooltipCtx from '@/ChartWidget/OptionsMenuTooltipCtx.svelte'
  import MetricErrorTooltipCtx from '@/ChartWidget/Metrics/ErrorTooltipCtx.svelte'
</script>

<MetricErrorTooltipCtx>
  <OptionsMenuTooltipCtx>
    <slot />
  </OptionsMenuTooltipCtx>
</MetricErrorTooltipCtx>
