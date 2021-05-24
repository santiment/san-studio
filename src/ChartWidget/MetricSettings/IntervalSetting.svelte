<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'
  import { getMetricMinInterval } from '@/api/metrics/restrictions'
  import { INTERVALS, getIntervals } from '@/utils/intervals'
  import Dropdown from './Dropdown.svelte'
  import { studio } from '@/stores/studio'
  import { Node } from '@/Chart/nodes'
  import { getWidget } from '@/ChartWidget/context'
  import { getCandlesPeriodMinInterval } from '@/ChartWidget/transformers/candles'
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
    MetricSettings.set(metric.key, {
      interval: interval.id,
    })
  }

  function onAutoClick() {
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
