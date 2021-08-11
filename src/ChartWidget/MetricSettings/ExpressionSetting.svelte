<script lang="ts">
  import { withScroll, getHistoryContext } from 'webkit/ui/history'
  import { getWidget } from '@/ChartWidget/context'
  import { showCombineDialog } from '@/CombineDialog/index.svelte'
  import Dropdown from './Dropdown.svelte'

  const History = getHistoryContext()
  const widget = getWidget()
  const { Metrics } = widget

  export let metric: Studio.Metric

  function onClick(e: MouseEvent) {
    e.stopImmediatePropagation()
    showCombineDialog({ metric }).then((updatedMetric) => {
      if (!updatedMetric) return

      const oldMetric = Object.assign({}, metric)
      const update = (newMetric: any) => {
        metric.expression = newMetric.expression
        metric.label = newMetric.label
        metric.minInterval = newMetric.minInterval
        metric.baseMetrics = newMetric.baseMetrics
        Metrics.set($Metrics)
      }

      update(updatedMetric)
      History.add(
        'Combined metric change',
        withScroll(widget, () => update(oldMetric)),
        withScroll(widget, () => update(updatedMetric)),
      )
    })
  }
</script>

<Dropdown {onClick}>
  Expression: {metric.expression}
</Dropdown>
