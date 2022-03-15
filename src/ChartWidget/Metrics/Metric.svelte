<script lang="ts">
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg/svelte'
  import { Event } from '@/analytics'
  import MetricButton from '@/MetricButton.svelte'
  import { getWidget } from '@/ChartWidget/context'
  import { studio } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { getAdapterController } from '@/adapter/context'
  import { SelectorNode } from '@/metrics/selector'
  import { convertBaseProjectMetric } from './utils'
  import MoreMenu from './MoreMenu.svelte'
  import { getMetricErrorTooltip } from './ErrorTooltipCtx.svelte'

  const { isEmbedded, isWithMetricSettings = true } = getAdapterController()
  const { Metrics, MetricsSignals } = getWidget()
  const metricErrorTooltip = getMetricErrorTooltip()

  export let metric: Studio.Metric
  export let colors
  export let error, isLoading, isSettingsOpened
  export let onEnter, onLeave, onClick, onDelete, onLock, onSettings
  export let dndContext

  let isMenuOpened = false
  let node

  $: isLocked = !!metric.project
  $: ({ isPresenterMode } = $globals)
  $: node && dndContext?.addItem(node)
  $: node && useErrorTooltip(node, error)

  const onMouseEnter = () => onEnter(metric)
  const onMouseLeave = onLeave

  function onLockClick() {
    if (Metrics.hasConvertedMetric(metric, $studio)) return

    if (metric.project) {
      track.event(Event.UnlockMetric, { metric: metric.key })
    } else {
      track.event(Event.LockMetric, { metric: metric.key, asset: $studio.slug })
    }

    onLock(metric, convertBaseProjectMetric(metric, $studio), $Metrics.indexOf(metric))
  }

  function useErrorTooltip(node: HTMLElement, error?: string) {
    metricErrorTooltip(node, {
      error,
      isEnabled: !!error,
    })
  }

  onDestroy(onMouseLeave)
</script>

<MetricButton
  bind:node
  {metric}
  {colors}
  {error}
  {isLoading}
  onDelete={isPresenterMode || isEmbedded ? undefined : onDelete}
  ticker={$studio.ticker}
  active={isMenuOpened}
  highlight={isSettingsOpened && !(isPresenterMode || !isWithMetricSettings)}
  on:click={(e) => onClick(metric, e)}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}>
  {#if !metric.noProject}
    {#if isLocked}
      {#if !isEmbedded}
        <div class="locked row hv-center">
          <Svg id="locked-small" w="8" />
        </div>
      {/if}
    {:else if !metric.indicator}
      ({$studio.ticker})
    {/if}
  {/if}

  {#if $MetricsSignals.includes(metric)}
    <div class="locked signaled row hv-center"><Svg id="flash" w="8" /></div>
  {/if}

  {#if !(isPresenterMode || isEmbedded) && metric !== SelectorNode.SPENT_COIN_COST}
    <MoreMenu {metric} {isLocked} {isSettingsOpened} bind:isMenuOpened {onLockClick} {onSettings} />
  {/if}
</MetricButton>

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
