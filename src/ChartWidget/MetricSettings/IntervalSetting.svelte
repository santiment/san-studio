<script lang="ts">
  import { track } from 'webkit/analytics'
  import Icon from 'webkit/ui/Icon.svelte'
  import { Event } from '@/analytics'
  import { getMetricMinInterval } from '@/api/metrics/restrictions'
  import { INTERVALS, getIntervals } from '@/utils/intervals'
  import { studio } from '@/stores/studio'
  import { Node } from '@/Chart/nodes'
  import { getWidget } from '@/ChartWidget/context'
  import { getCandlesPeriodMinInterval } from '@/ChartWidget/transformers/candles'
  import Dropdown from './Dropdown.svelte'
  const { MetricSettings } = getWidget()

  export let metric: Studio.Metric

  let intervals = INTERVALS

  $: ({ from, to } = $studio)
  $: metricSettings = $MetricSettings[metric.key]
  $: metricInterval = metricSettings?.interval
  $: metricNode = metricSettings?.node || metric.node
  $: isCandleNode = metricNode === Node.CANDLES
  $: getMinInterval(metric, isCandleNode, from, to)

  function getMinInterval(
    metric: Studio.Metric,
    isCandleNode: boolean,
    from: string,
    to: string,
  ) {
    let promise
    if (isCandleNode) {
      promise = Promise.resolve(
        getCandlesPeriodMinInterval(new Date(from), new Date(to)),
      )
    } else {
      promise = getMetricMinInterval(metric)
    }

    promise.then(getIntervals).then((metricIntervals) => {
      intervals = metricIntervals
    })
  }

  function onClick(interval) {
    // prettier-ignore
    track.event(Event.MetricInterval, { metric: metric.key, interval: interval.id})
    MetricSettings.set(metric.key, { interval: interval.id })
  }

  function onAutoClick() {
    track.event(Event.MetricInterval, { metric: metric.key, interval: 'auto' })
    MetricSettings.delete(metric.key, 'interval')
  }
</script>

<Dropdown>
  <Icon id="interval" w="16" h="12" class="mrg-s mrg--r $style.icon" />
  Interval:
  {#if metricInterval} {metricInterval} {:else} Auto ({$studio.interval}) {/if}

  <svelte:fragment slot="options">
    {#if isCandleNode === false}
      <div
        class="btn btn--ghost"
        class:active={!metricInterval}
        on:click={onAutoClick}>
        Auto ({$studio.interval})
      </div>
    {/if}

    {#each intervals as interval}
      <div
        class="btn btn--ghost"
        class:active={metricInterval === interval.id}
        on:click={() => onClick(interval)}>
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
