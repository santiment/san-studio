<script lang="ts">
  import { onDestroy } from 'svelte'
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg/svelte'
  import ProjectIcon from 'webkit/ui/ProjectIcon.svelte'
  import { Event } from '@/analytics'
  import { Blockchain, queryProjectBlockchain } from '@/api/blockchains'
  import MetricButton from '@/MetricButton.svelte'
  import { getWidget } from '@/ChartWidget/context'
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
  export let project
  export let colors
  export let error, isLoading, isSettingsOpened, isHidden
  export let onEnter, onLeave, onClick, onDelete, onLock, onSettings
  export let dndContext
  export let isMultipleMetricsOnChart

  let isMenuOpened = false
  let node

  $: isLocked = !!metric.project
  $: projectSlug = metric.project?.slug || project.slug

  $: ({ isPresenterMode } = $globals)
  $: node && dndContext?.addItem(node)
  $: node && useErrorTooltip(node, error)
  $: address = metric.reqMeta?.address

  const onMouseEnter = () => onEnter(metric)
  const onMouseLeave = onLeave

  function onLockClick() {
    const settings = Object.assign({}, project)

    if (Metrics.hasConvertedMetric(metric, settings)) return

    if (metric.project) {
      track.event(Event.UnlockMetric, { metric: metric.key })
    } else {
      track.event(Event.LockMetric, { metric: metric.key, asset: project.slug })
    }

    onLock(metric, convertBaseProjectMetric(metric, settings), $Metrics.indexOf(metric))
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
  ticker={project.ticker}
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
      ({project.ticker})
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

  {#await queryProjectBlockchain(projectSlug) then blockchain}
    {#if blockchain}
      <ProjectIcon slug={blockchain} size={16} class="$style.blockchain" />
    {/if}
  {/await}

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

  .blockchain {
    position: absolute;
    right: -6px;
    top: -6px;
  }
</style>
