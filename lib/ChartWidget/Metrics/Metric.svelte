<script lang="ts">
  var _a

  import { onDestroy } from 'svelte'
  import { track } from 'san-webkit/lib/analytics'
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { Event } from './../../../lib/analytics'
  import MetricButton from './../../../lib/MetricButton.svelte'
  import { getWidget } from './../../../lib/ChartWidget/context'
  import { studio } from './../../../lib/stores/studio'
  import { globals } from './../../../lib/stores/globals'
  import { getAdapterController } from './../../../lib/adapter/context'
  import { SelectorNode } from './../../../lib/metrics/selector'
  import { convertBaseProjectMetric } from './utils'
  import MoreMenu from './MoreMenu.svelte'
  import { getMetricErrorTooltip } from './ErrorTooltipCtx.svelte'
  const { isEmbedded, isWithMetricSettings = true } = getAdapterController()
  const { Metrics, MetricsSignals } = getWidget()
  const metricErrorTooltip = getMetricErrorTooltip()
  export let metric
  export let colors
  export let error, isLoading, isSettingsOpened, isHidden
  export let onEnter, onLeave, onClick, onDelete, onLock, onSettings
  export let dndContext
  export let isMultipleMetricsOnChart
  let isMenuOpened = false
  let node

  $: isLocked = !!metric.project

  $: ({ isPresenterMode } = $globals)

  $: node && (dndContext === null || dndContext === void 0 ? void 0 : dndContext.addItem(node))

  $: node && useErrorTooltip(node, error)

  $: address = (_a = metric.reqMeta) === null || _a === void 0 ? void 0 : _a.address

  const onMouseEnter = () => onEnter(metric)

  const onMouseLeave = onLeave

  function onLockClick() {
    if (Metrics.hasConvertedMetric(metric, $studio)) return

    if (metric.project) {
      track.event(Event.UnlockMetric, {
        metric: metric.key,
      })
    } else {
      track.event(Event.LockMetric, {
        metric: metric.key,
        asset: $studio.slug,
      })
    }

    onLock(metric, convertBaseProjectMetric(metric, $studio), $Metrics.indexOf(metric))
  }

  function useErrorTooltip(node, error) {
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
  on:mouseleave={onMouseLeave}
>
  {#if !metric.noProject}
    {#if isLocked}
      {#if !isEmbedded}
        <div class="locked row hv-center">
          <Svg id="locked-small" w="8" />
        </div>
      {/if}
    {:else if !metric.indicator && !address}
      ({$studio.ticker})
    {/if}
  {/if}

  {#if $MetricsSignals.includes(metric)}
    <div class="locked signaled row hv-center"><Svg id="flash" w="8" /></div>
  {/if}

  {#if address}
    <div class="address locked row hv-center expl-tooltip" aria-label={address}>
      <Svg id="report" w="9" />
    </div>
  {/if}

  {#if isHidden}
    <div class="locked row hv-center  expl-tooltip" aria-label="Hidden">
      <Svg id="eye-crossed" w="11" />
    </div>
  {/if}

  {#if !(isPresenterMode || isEmbedded) && metric !== SelectorNode.SPENT_COIN_COST}
    <MoreMenu
      {metric}
      {address}
      {isHidden}
      isLocked={isLocked || address}
      {isSettingsOpened}
      {isMultipleMetricsOnChart}
      bind:isMenuOpened
      {onLockClick}
      {onSettings}
    />
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

  .address {
    --expl-position-y: -4px;
    --expl-align-x: 50%;
  }
  .address::before {
    z-index: 11;
  }
</style>
