<script lang="ts">
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import Icon from 'webkit/ui/Icon.svelte'
  import { Event } from '@/analytics'
  import MetricButton from '@/MetricButton.svelte'
  import { getWidget } from '@/ChartWidget/context'
  import { studio } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { convertBaseProjectMetric } from './utilts'
  import MoreMenu from './MoreMenu.svelte'
  import ErrorTooltip from './ErrorTooltip.svelte'
  const { Metrics, MetricsSignals } = getWidget()

  export let metric: Studio.Metric
  export let colors
  export let error, isLoading, isSettingsOpened
  export let onEnter, onLeave, onClick, onDelete, onLock, onSettings
  export let dndContext

  let isMenuOpened = false

  $: isLocked = !!metric.project
  $: ({ isPresenterMode } = $globals)

  const onMouseEnter = () => onEnter(metric)
  const onMouseLeave = onLeave

  function onLockClick() {
    if (Metrics.hasConvertedMetric(metric, $studio)) return

    if (metric.project) {
      track.event(Event.UnlockMetric, { metric: metric.key })
    } else {
      track.event(Event.LockMetric, { metric: metric.key, asset: $studio.slug })
    }

    onLock(
      metric,
      convertBaseProjectMetric(metric, $studio),
      $Metrics.indexOf(metric),
    )
  }

  onDestroy(onMouseLeave)

  let node
  $: node && dndContext?.addItem(node)
</script>

<ErrorTooltip {error}>
  <MetricButton
    bind:node
    {metric}
    {colors}
    {error}
    {isLoading}
    onDelete={isPresenterMode ? undefined : onDelete}
    ticker={$studio.ticker}
    active={isMenuOpened}
    on:click={(e) => onClick(metric, e)}
    on:mouseenter={onMouseEnter}
    on:mouseleave={onMouseLeave}>
    {#if !metric.noProject}
      {#if isLocked}
        <div class="locked row hv-center"><Icon id="locked-small" w="8" /></div>
      {:else if !metric.indicator}
        ({$studio.ticker})
      {/if}
    {/if}

    {#if $MetricsSignals.includes(metric)}
      <div class="locked signaled row hv-center"><Icon id="flash" w="8" /></div>
    {/if}

    {#if isPresenterMode === false}
      <MoreMenu
        {metric}
        {isLocked}
        {isSettingsOpened}
        bind:isMenuOpened
        {onLockClick}
        {onSettings} />
    {/if}
  </MetricButton>
</ErrorTooltip>

<style>
  .locked {
    position: absolute;
    top: -5px;
    left: -5px;
    background: #505573;
    border-radius: 50%;
    fill: #fff;
    width: 16px;
    height: 16px;
  }

  .signaled {
    background: var(--red);
  }
</style>
