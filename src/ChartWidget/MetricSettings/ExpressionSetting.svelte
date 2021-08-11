<script lang="ts">
  import { getWidget } from '@/ChartWidget/context'
  import { showCombineDialog } from '@/CombineDialog/index.svelte'
  import Dropdown from './Dropdown.svelte'

  const widget = getWidget()
  const { Metrics } = widget

  export let metric: Studio.Metric

  function onClick(e: MouseEvent) {
    e.stopImmediatePropagation()
    showCombineDialog({ metric }).then((updatedMetric) => {
      if (!updatedMetric) return
      metric.expression = updatedMetric.expression
      metric.label = updatedMetric.label

      Metrics.set($Metrics)
    })
  }
</script>

<Dropdown {onClick}>
  Expression: {metric.expression}
</Dropdown>
