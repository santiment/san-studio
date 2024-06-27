<script lang="ts">
  import { track } from 'san-webkit/lib/analytics'
  import { withScroll } from 'san-webkit/lib/ui/history'
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { Event } from './../../analytics'
  import { getHistoryContext } from './../../history/ctx'
  import { getMetricMinInterval } from './../../api/metrics/restrictions'
  import { INTERVALS, getIntervals, getValidInterval } from './../../utils/intervals'
  import { studio } from './../../stores/studio'
  import { Node } from './../../Chart/nodes'
  import { getWidget } from './../../ChartWidget/context'
  import { getCandlesPeriodMinInterval } from './../../ChartWidget/transformers/candles'
  import Dropdown from './Dropdown.svelte'

  const History = getHistoryContext()
  const widget = getWidget()
  const { MetricSettings } = widget

  export let metric: Studio.Metric

  let intervals = INTERVALS

  $: ({ from, to, interval } = $studio)
  $: metricSettings = $MetricSettings[metric.key]
  $: metricInterval = metricSettings?.interval
  $: metricNode = metricSettings?.node || metric.node
  $: isCandleNode = metricNode === Node.CANDLES
  $: getMinInterval(metric, isCandleNode, from, to)
  $: autoInterval = getValidInterval(interval, intervals)

  function getMinInterval(metric: Studio.Metric, isCandleNode: boolean, from: string, to: string) {
    let promise
    if (isCandleNode) {
      promise = Promise.resolve(getCandlesPeriodMinInterval(new Date(from), new Date(to)))
    } else {
      promise = metric.minInterval
        ? Promise.resolve(metric.minInterval)
        : getMetricMinInterval(metric)
    }

    promise.then(getIntervals).then((metricIntervals) => {
      intervals = metricIntervals
    })
  }

  function setInterval(metricKey: string, newInterval) {
    if (!newInterval) return MetricSettings.delete(metricKey, 'interval')
    MetricSettings.set(metricKey, { interval: newInterval })
  }

  function updateInterval(metricKey: string, newInterval?: string) {
    const oldInterval = metricInterval
    const redo = () => setInterval(metricKey, newInterval)

    redo()
    History.add(
      'Interval change',
      withScroll(widget, () => setInterval(metricKey, oldInterval)),
      withScroll(widget, redo),
    )
  }

  function onClick(interval) {
    // prettier-ignore
    track.event(Event.MetricInterval, { metric: metric.key, interval: interval.id})
    updateInterval(metric.key, interval.id)
  }

  function onAutoClick() {
    track.event(Event.MetricInterval, { metric: metric.key, interval: 'auto' })
    updateInterval(metric.key)
  }
</script>

<Dropdown>
  <Svg id="interval" w="16" h="12" class="mrg-s mrg--r $style.icon" />
  Interval:
  {#if metricInterval} {metricInterval} {:else} Auto ({autoInterval}) {/if}

  <svelte:fragment slot="options">
    {#if isCandleNode === false}
      <div class="btn-ghost" class:active={!metricInterval} on:click={onAutoClick}>
        Auto ({autoInterval})
      </div>
    {/if}

    {#each intervals as interval}
      <div
        class="btn-ghost"
        class:active={metricInterval === interval.id}
        on:click={() => onClick(interval)}
      >
        {interval.label}
      </div>
    {/each}
  </svelte:fragment>
</Dropdown>

<style>
  .icon {
    fill: var(--waterloo);
  }
</style>
