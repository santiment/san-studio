<script lang="ts">
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import Icon from 'webkit/ui/Icon.svelte'
  import { Event } from '@/analytics'
  import MetricButton from '@/MetricButton.svelte'
  import { getWidget } from '@/ChartWidget/context'
  import { studio } from '@/stores/studio'
  import { convertBaseProjectMetric } from './utilts'
  import MoreMenu from './MoreMenu.svelte'
  import ErrorTooltip from './ErrorTooltip.svelte'
  const { Metrics } = getWidget()

  export let metric: Studio.Metric
  export let colors
  export let error
  export let onHover, onClick, onDelete, onLock, onSettings

  let timer: number
  let isHovered = false
  let isMenuOpened = false

  $: isLocked = !!metric.project

  const clear = () => clearTimeout(timer)
  function onMouseEnter() {
    clear()
    timer = window.setTimeout(() => {
      isHovered = true
      onHover(metric)
    }, 120)
  }
  function onMouseLeave() {
    clear()
    if (isHovered) {
      isHovered = false
      onHover()
    }
  }

  function onLockClick() {
    if (Metrics.hasConvertedMetric(metric, $studio)) return

    if (metric.project) {
      track.event(Event.UnlockMetric, { metric: metric.key })
    } else {
      track.event(Event.LockMetric, { metric: metric.key, asset: $studio.slug })
    }

    onLock(convertBaseProjectMetric(metric, $studio), $Metrics.indexOf(metric))
  }

  onDestroy(onMouseLeave)
</script>

<ErrorTooltip {error}>
  <MetricButton
    {metric}
    {colors}
    {error}
    {onDelete}
    ticker={$studio.ticker}
    active={isMenuOpened}
    on:click={(e) => onClick(metric, e)}
    on:mouseenter={onMouseEnter}
    on:mouseleave={onMouseLeave}>
    {#if isLocked}
      <div class="locked row hv-center"><Icon id="locked-small" w="8" /></div>
    {:else if !metric.indicator}
      ({$studio.ticker})
    {/if}

    <MoreMenu
      {metric}
      {isLocked}
      bind:isMenuOpened
      {onLockClick}
      {onSettings} />
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
</style>
