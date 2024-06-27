<script lang="ts">
  import { withScroll } from 'san-webkit/lib/ui/history'
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { getHistoryContext } from './../../history/ctx'
  import { getWidget } from './../../ChartWidget/context'
  import { showCombineDialog } from './../../CombineDialog/index.svelte'
  import { updateCombinedMetric } from './../../CombineDialog/flow'
  import Setting from './Setting.svelte'

  const History = getHistoryContext()
  const widget = getWidget()
  const { Metrics } = widget

  export let metric: Studio.Metric

  function onExpressionClick() {
    showCombineDialog({ metric }).then((updatedMetric) => {
      if (!updatedMetric) return

      updateCombinedMetric(metric, updatedMetric, {
        History,
        widget,
        onUpdate: () => Metrics.set(Metrics.getValue()),
      })
    })
  }

  function onCombineClick() {
    showCombineDialog({ metrics: [metric] }).then((combinedMetric) => {
      if (!combinedMetric) return

      Metrics.add(combinedMetric)
      History.add(
        'Combine metrics',
        withScroll(widget, () => Metrics.delete(combinedMetric)),
        withScroll(widget, () => Metrics.add(combinedMetric)),
      )
    })
  }
</script>

<Setting on:click={metric.expression ? onExpressionClick : onCombineClick}>
  {#if metric.expression}
    Expression: {metric.expression}
  {:else}
    <Svg id="plus" w="8" class="mrg-s mrg--r" />
    Combine metrics
  {/if}
</Setting>
