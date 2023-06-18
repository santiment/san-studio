<script lang="ts">
  import { withScroll } from 'webkit/ui/history'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import { getHistoryContext } from '@/history/ctx'
  import { getWidget } from '@/ChartWidget/context'
  import Dropdown from '../Dropdown.svelte'
  import { INDICATORS, cacheIndicator } from './utils'

  const History = getHistoryContext()
  const widget = getWidget()
  const { Metrics, MetricIndicators } = widget

  export let metric: Studio.Metric

  $: metricIndicators = metric && $MetricIndicators && MetricIndicators.get(metric.key)

  function getActiveLabels(metricIndicators) {
    let label = ''
    for (let i = 0; i < INDICATORS.length; i++) {
      const indicator = INDICATORS[i]
      if (metricIndicators.has(indicator)) label += ', ' + indicator.label
    }
    return label.slice(2)
  }

  function onClick(indicator) {
    const indicatorMetric = cacheIndicator(metric, indicator)

    function toggle() {
      Metrics.toggle(indicatorMetric)
      MetricIndicators.toggle(metric.key, indicator)
    }

    toggle()
    History.add('Toggle indicator', withScroll(widget, toggle))
  }
</script>

<Dropdown>
  Indicators: {getActiveLabels(metricIndicators)}

  <svelte:fragment slot="options">
    {#each INDICATORS as indicator}
      <div
        class="btn-ghost row v-center justify"
        class:active={false}
        on:click={() => onClick(indicator)}
      >
        {indicator.fullLabel}
        {indicator.base || ''}
        <Toggle class="mrg-l mrg--l" isActive={metricIndicators.has(indicator)} />
      </div>
    {/each}
  </svelte:fragment>
</Dropdown>
