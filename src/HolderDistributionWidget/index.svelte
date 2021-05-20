<script lang="ts">
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import Icon from 'webkit/ui/Icon.svelte'
  import ChartWidget from '@/ChartWidget/index.svelte'
  import { initWidget } from '@/ChartWidget/context'
  import {
    HolderDistributionAbsoluteMetric,
    HolderDistributionMetric,
    HOLDER_DISTRIBUTION_ABSOLUTE_METRICS,
  } from '@/metrics/_onchain/holderDistributions'
  import { studio } from '@/stores/studio'
  import { buildMergedMetric } from './utils'

  // TODO: Refactor [@vanguard | May 19, 2021]

  export let widget
  export let metrics = HOLDER_DISTRIBUTION_ABSOLUTE_METRICS
  export let defaultMetrics
  export let isSingleWidget: boolean
  export let deleteWidget
  export let isMerging = false

  if (!widget.metrics)
    widget.metrics = defaultMetrics || [
      HolderDistributionAbsoluteMetric.holders_distribution_1_to_10,
    ]
  initWidget(widget)

  const enum Phase {
    None,
    Merge,
  }

  const { Metrics } = widget
  let isOpened = true
  let clientWidth
  let node
  export let phase = Phase.None
  let mergingMetrics = new Set()
  let mergedMetrics = widget.mergedMetrics || []
  let mergedMetricsSet = new Set(mergedMetrics)
  let mergedKeysSet = new Set(mergedMetrics.map(({ key }) => key))

  $: node && updateDimensions(clientWidth, isOpened)
  $: isMerging = phase === Phase.Merge

  function onMetricClick(metric: Studio.Metric) {
    if (isMerging) {
      return checkMetric(metric)
    }

    if ($Metrics.length === 1 && $Metrics.includes(metric)) return
    Metrics.toggle(metric)
  }

  function checkMetric(metric: Studio.Metric) {
    if (mergingMetrics.has(metric)) {
      mergingMetrics.delete(metric)
    } else {
      mergingMetrics.add(metric)
    }
    mergingMetrics = mergingMetrics
  }

  function onMergeClick() {
    if (!isMerging) return (phase = Phase.Merge)

    if (mergingMetrics.size > 1) {
      const metric = buildMergedMetric(Array.from(mergingMetrics))
      if (mergedKeysSet.has(metric.key) === false) {
        Metrics.add(metric)
        mergedKeysSet.add(metric.key)
        mergedMetrics = Array.from(mergedMetricsSet.add(metric))
      }
    }

    mergingMetrics = new Set()
    phase = Phase.None
  }

  function updateDimensions(width: number, isOpened: boolean) {
    node.firstChild.style.maxWidth = (isOpened ? width - 340 : width) + 'px'
  }

  function metricsFilter(metric: Studio.Metric) {
    return (
      !HolderDistributionMetric[metric.key] && !mergedMetricsSet.has(metric)
    )
  }

  function onUnmergeClick(metric: Studio.Metric) {
    mergedMetricsSet.delete(metric)
    mergedKeysSet.delete(metric.key)
    mergedMetrics = Array.from(mergedMetricsSet)
    Metrics.delete(metric)
  }

  function onWidgetDelete(isForced = false) {
    if (isForced) deleteWidget()
  }
</script>

<div class="widget row" bind:clientWidth bind:this={node}>
  <ChartWidget
    {widget}
    {metricsFilter}
    {isSingleWidget}
    deleteWidget={onWidgetDelete} />

  <div class="aside column" class:opened={isOpened}>
    <div class="toggle">
      <Icon
        id="sidebar"
        w="12"
        h="10"
        class="btn $style.icon"
        on:click={() => (isOpened = !isOpened)} />
    </div>

    {#if isOpened}
      <div class="row v-center mrg-l mrg--b">
        <div class="body-2 txt-m">
          {$studio.ticker} Supply Distribution
          <div class="body-3">
            <slot>by number of addresses</slot>
          </div>
        </div>

        <div
          class="merge btn border mrg-a mrg--l row v-center"
          on:click={onMergeClick}
          class:merging={isMerging}
          class:confirm={isMerging && mergingMetrics.size > 1}>
          {#if isMerging}
            {mergingMetrics.size > 1 ? 'Confirm' : 'Cancel'}
          {:else}
            <Icon id="merge" w="18" h="14" class="mrg-s mrg--r" /> Merge
          {/if}
        </div>
      </div>

      <slot name="tabs" />

      <div class="metrics column">
        {#if !isMerging}
          {#each mergedMetrics as metric}
            <div
              class="btn btn--ghost metric mrg-s mrg--b"
              class:active={$Metrics.includes(metric)}
              on:click={() => onMetricClick(metric)}>
              {metric.label}
              <span
                class="btn unmerge mrg-s mrg--l"
                on:click={() => onUnmergeClick(metric)}>
                Unmerge
              </span>
            </div>
          {/each}
        {/if}

        {#each metrics as metric}
          <div
            class="btn btn--ghost metric mrg-s mrg--b row v-center"
            class:active={isMerging
              ? mergingMetrics.has(metric)
              : $Metrics.includes(metric)}
            on:click={() => onMetricClick(metric)}>
            {#if isMerging}
              <Checkbox
                class="mrg-s mrg--r"
                isActive={mergingMetrics.has(metric)} />
            {/if}
            {metric.label}
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .widget {
    height: 100%;
  }

  .aside {
    margin: -16px;
    margin-left: 16px;
    position: relative;
  }

  .opened {
    width: 340px;
    padding: 20px 16px;
    border-left: 1px solid var(--porcelain);
  }

  .body-3 {
    color: var(--waterloo);
    font-weight: 400;
  }

  .merge {
    padding: 5px 12px;
    --color-hover: var(--green);
  }

  .metrics {
    overflow: auto;
  }

  .metric {
    padding: 6px 12px;
    --color: var(--casper);
    --color-hover: var(--black);
  }

  .active {
    --color: var(--black);
  }

  .toggle {
    position: absolute;
    top: 15px;
    left: -21px;
    width: 21px;
    border: 1px solid var(--porcelain);
    border-right: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .opened .toggle {
    left: -13px;
    width: 13px;
  }

  .icon {
    --fill: var(--casper);
    --fill-hover: var(--green);
    --bg: var(--white);
    padding: 10px 4px;
  }

  .merging {
    border-color: var(--red);
    --color: var(--red);
    --color-hover: var(--red-hover);
  }

  .confirm {
    border-color: var(--green);
    --color: var(--green);
    --color-hover: var(--green-hover);
  }

  .unmerge {
    color: var(--red);
  }
  .unmerge:hover {
    color: var(--red-hover);
    text-decoration: underline;
  }
</style>
