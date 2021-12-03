<script lang="ts">
  import { withScroll, getHistoryContext } from 'webkit/ui/history'
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import Checkbox from 'webkit/ui/Checkbox.svelte'
  import { initWidget } from '@/ChartWidget/context'
  import {
    HolderDistributionMetric,
    LABELED_HOLDER_DISTRIBUTION_METRICS,
  } from '@/metrics/_onchain/holderDistributions'
  import HolderDistributionWidget from './index.svelte'

  const History = getHistoryContext()

  export let widget
  export let isSingleWidget: boolean
  export let deleteWidget

  if (!widget.metrics)
    widget.metrics = LABELED_HOLDER_DISTRIBUTION_METRICS.slice()
  initWidget(widget)
  const { Metrics, MetricSettings } = widget
  const newHistory = (name, undo, redo = undo) =>
    History.add(name, withScroll(widget, undo), withScroll(widget, redo))

  const defaultMetrics = LABELED_HOLDER_DISTRIBUTION_METRICS.slice()
  const LABELS = ['exchange', 'infrastructure', 'miner', 'whale']

  let labels = new Set<number>(widget.holderLabels)
  $: widget.holderLabels = Array.from(labels)
  $: text = getSelectionText(labels)
  $: updateSettings($Metrics, labels)

  function updateSettings(metrics, ids: Set<number>) {
    const settings = ids.size && { labels: getTextLabels(ids) }

    metrics.forEach(({ key, baseMetrics }) => {
      if (!HolderDistributionMetric[key] && !baseMetrics) return
      if (!settings) return MetricSettings.delete(key, 'labels')

      MetricSettings.set(key, settings)
    })
  }

  function getSelectionText(labels: Set<number>) {
    return getTextLabels(labels)
      .map((label) => label[0].toUpperCase() + label.slice(1))
      .join(', ')
  }

  function getTextLabels(labels: Set<number>) {
    return Array.from(labels)
      .sort()
      .map((id) => LABELS[id])
  }

  function onToggle(id: number) {
    function update() {
      labels.has(id) ? labels.delete(id) : labels.add(id)
      labels = labels
    }
    update()
    newHistory('Toggle label', update)
  }

  function onReset() {
    const oldLabels = new Set(labels)
    function redo() {
      labels.clear()
      labels = labels
    }
    redo()
    newHistory('Reset labels', () => (labels = oldLabels), redo)
  }
</script>

<HolderDistributionWidget
  {widget}
  {isSingleWidget}
  {deleteWidget}
  {defaultMetrics}
  metrics={LABELED_HOLDER_DISTRIBUTION_METRICS}>
  <slot>labeled by number of addresses</slot>

  <svelte:fragment slot="tabs">
    <Tooltip on="click" duration={0} align="center" class="$style.tooltip">
      <div
        slot="trigger"
        class="border v-center btn row mrg-l mrg--b"
        class:text>
        {text || 'Show all labels'}
        <Svg id="arrow" w="8" h="4.5" class="mrg-a mrg--l $style.arrow" />
      </div>

      <svelte:fragment slot="tooltip">
        <div class="column">
          {#each LABELS as label, i}
            <div
              class="label btn btn--ghost mrg-s mrg--t row v-center"
              on:click={() => onToggle(i)}>
              <Checkbox class="mrg-s mrg--r" isActive={labels.has(i)} />
              {label}
            </div>
          {/each}

          <div class="reset btn row h-center" on:click={onReset}>Reset</div>
        </div>
      </svelte:fragment>
    </Tooltip>
  </svelte:fragment>
</HolderDistributionWidget>

<style>
  .border {
    padding: 5px 10px 5px 10px;
    --color: var(--waterloo);
    fill: var(--waterloo);
  }
  .border:hover {
    border-color: var(--green);
  }
  .arrow {
    transform: rotate(180deg);
  }
  .text {
    --color: var(--black);
  }

  .tooltip {
    width: calc(100% - 32px);
    padding: 0 8px;
  }

  .label {
    text-transform: capitalize;
  }

  .reset {
    padding: 6px;
    border-top: 1px solid var(--porcelain);
    margin: 8px -8px 0;
    border-radius: 0;
    --color-hover: var(--green);
  }
</style>
