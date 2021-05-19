<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'
  import { getMetricMinInterval } from '@/api/metrics/restrictions'
  import { INTERVALS, getIntervals } from '@/utils/intervals'
  import Dropdown from './Dropdown.svelte'
  import { getMetricSettings } from './context'
  import { studio } from '@/stores/studio'
  const MetricSettings = getMetricSettings()

  export let metric: Studio.Metric

  let intervals = INTERVALS

  $: getMinInterval(metric)
  $: metricInterval = $MetricSettings[metric.key]?.interval

  function getMinInterval(metric: Studio.Metric) {
    getMetricMinInterval(metric)
      .then(getIntervals)
      .then((metricIntervals) => {
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
    <div
      class="btn btn--ghost"
      class:active={!metricInterval}
      on:click={onAutoClick}>
      Auto ({$studio.interval})
    </div>

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
