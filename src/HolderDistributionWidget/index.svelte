<script lang="ts">
  import { withScroll, getHistoryContext } from '@/history'
  import ChartWidget from '@/ChartWidget/index.svelte'
  import { initWidget } from '@/ChartWidget/context'
  import {
    HolderDistributionMetric,
    HOLDER_DISTRIBUTION_ABSOLUTE_METRICS,
  } from '@/metrics/_onchain/holderDistributions'
  import { buildMergedMetric } from './utils'
  import Sidebar from './Sidebar.svelte'

  const History = getHistoryContext()

  export let widget
  export let metrics = HOLDER_DISTRIBUTION_ABSOLUTE_METRICS
  export let defaultMetrics
  export let isSingleWidget: boolean
  export let deleteWidget
  export let isMerging = false

  if (!widget.metrics) {
    widget.metrics =
      defaultMetrics || HOLDER_DISTRIBUTION_ABSOLUTE_METRICS.slice()
  }
  initWidget(widget)
  const { Metrics, ChartColors } = widget
  const newHistory = (name, undo, redo) =>
    History.add(name, withScroll(widget, undo), withScroll(widget, redo))

  let mergingMetrics = new Set()
  let mergedMetrics = widget.mergedMetrics || []
  let mergedMetricsSet = new Set(mergedMetrics)
  let mergedKeysSet = new Set(mergedMetrics.map(({ key }) => key))

  $: colors = $ChartColors

  function metricsFilter(metric: Studio.Metric) {
    return (
      !HolderDistributionMetric[metric.key] && !mergedMetricsSet.has(metric)
    )
  }

  function checkMetric(metric: Studio.Metric) {
    if (mergingMetrics.has(metric)) {
      mergingMetrics.delete(metric)
    } else {
      mergingMetrics.add(metric)
    }
    mergingMetrics = mergingMetrics
  }

  function onMetricClick(metric: Studio.Metric, e: MouseEvent) {
    if (isMerging) return checkMetric(metric)

    const oldMetrics = $Metrics.slice()
    const { metaKey, ctrlKey } = e
    if (metaKey || ctrlKey) {
      const newMetrics = [metric]
      newHistory(
        'Toggle metric',
        () => Metrics.set(oldMetrics),
        () => Metrics.set(newMetrics),
      )
      return Metrics.set(newMetrics)
    }

    if ($Metrics.length === 1 && $Metrics.includes(metric)) return

    newHistory(
      'Toggle metric',
      () => Metrics.set(oldMetrics),
      () => Metrics.toggle(metric),
    )
    Metrics.toggle(metric)
  }

  function onMergeClick() {
    if (!isMerging) return (isMerging = true)

    if (mergingMetrics.size > 1) {
      const metric = buildMergedMetric(Array.from(mergingMetrics))
      addMergedMetrics(metric)
      newHistory(
        'Merge metrics',
        () => unmergeMetrics(metric),
        () => addMergedMetrics(metric),
      )
    }

    mergingMetrics = new Set()
    isMerging = false
  }

  function onUnmergeClick(metric: Studio.Metric) {
    unmergeMetrics(metric)

    newHistory(
      'Unmerge metrics',
      () => addMergedMetrics(metric),
      () => unmergeMetrics(metric),
    )
  }

  function addMergedMetrics(metric: any) {
    if (mergedKeysSet.has(metric.key)) return
    Metrics.add(metric)
    mergedKeysSet.add(metric.key)
    mergedMetrics = Array.from(mergedMetricsSet.add(metric))
  }

  function unmergeMetrics(metric: Studio.Metric) {
    mergedMetricsSet.delete(metric)
    mergedKeysSet.delete(metric.key)
    mergedMetrics = Array.from(mergedMetricsSet)
    Metrics.delete(metric)
  }

  function onWidgetDelete(isForced = false) {
    if (isForced) deleteWidget()
  }
</script>

<div class="widget row">
  <ChartWidget
    {widget}
    {metricsFilter}
    {isSingleWidget}
    deleteWidget={onWidgetDelete} />

  <Sidebar
    {metrics}
    {Metrics}
    {mergedMetrics}
    {mergingMetrics}
    {colors}
    {isMerging}
    {onMergeClick}
    {onMetricClick}
    {onUnmergeClick}>
    <slot>by number of addresses</slot>
    <slot name="tabs" slot="tabs" />
  </Sidebar>
</div>

<style>
  .widget {
    height: 100%;
  }
</style>
