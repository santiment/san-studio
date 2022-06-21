<script lang="ts">
  import { track } from 'webkit/analytics'
  import { withScroll, getHistoryContext } from 'webkit/ui/history'
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import Setting from './Setting.svelte'

  const History = getHistoryContext()
  const widget = getWidget()
  const { PinnedChartAxes } = widget

  export let metric: Studio.Metric

  function onClick() {
    track.event($PinnedChartAxes.has(metric) ? Event.UnpinMetricAxis : Event.PinMetricAxis, {
      metric: metric.key,
    })

    const toggle = () => PinnedChartAxes.toggle(metric)
    toggle()
    History.add('Pin axis', withScroll(widget, toggle))
  }
</script>

<Setting on:click={onClick}>
  Pin axis
  <Checkbox class="mrg-s mrg--l" isActive={$PinnedChartAxes.has(metric)} />
</Setting>
