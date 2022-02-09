<script lang="ts">
  import { onDestroy } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { getDateFormats, getTimeFormats } from 'webkit/utils/dates'
  import { getWidgets } from '@/stores/widgets'
  import { studio } from '@/stores/studio'
  import { widgetsListener } from '@/stores/widgetsListener'
  import { Description, prepareDescription } from '@/metrics/description'
  import Section from './Section.svelte'
  import { Frequency } from './frequencies'
  import { queryMetricInfo } from './api'

  const Widgets = getWidgets()
  const unsubWidgets = widgetsListener.subscribe(getMetrics)

  let metrics = [] as Studio.Metric[]
  getMetrics()
  let metric = metrics[0] as undefined | Studio.Metric

  let isOpened = false
  let loading = true
  let availableSince
  let lastDatetimeComputedAt

  $: ({ slug, ticker } = $studio)
  $: slug, metric && loadMetricData()

  function getMetrics() {
    const items = [] as Studio.Metric[]
    const baseMapper = (metric) => metric.base || metric.baseMetrics || metric
    $Widgets.forEach(({ metrics }) => metrics && items.push(...metrics.map(baseMapper)))

    metrics = Array.from(new Set(items.flat())).filter(({ queryKey }) => !queryKey)
  }

  function loadMetricData() {
    if (!metric) return
    loading = true
    queryMetricInfo(metric.key, slug).then((data) => {
      loading = false
      availableSince = formatMetricData(data.availableSince)
      lastDatetimeComputedAt = formatMetricData(data.lastDatetimeComputedAt)
    })
  }

  function formatMetricData(value: string) {
    const date = new Date(value)
    const { HH, mm } = getTimeFormats(date)
    const { MMMM, DD, YYYY } = getDateFormats(date)
    return `${HH}:${mm}, ${MMMM} ${DD}, ${YYYY}`
  }

  function onMetricChange(item) {
    metric = item
    isOpened = false
  }

  onDestroy(() => {
    unsubWidgets()
  })
</script>

<h2 class="txt-m mrg-l mrg--b">Metric Explanations</h2>

{#if metric}
  <Tooltip bind:isOpened duration={0} on="click" align="start">
    <div slot="trigger" class="selection btn-2 btn--s btn--l row v-center">
      {metric.label}
      <Svg id="arrow" w="8" h="4.5" class="mrg-a mrg--l $style.arrow" />
    </div>
    <div slot="tooltip" class="tooltip">
      {#each metrics as item (item.key)}
        <div
          class="btn btn--ghost"
          class:active={metric === item}
          on:click={() => onMetricChange(item)}>
          {item.label}
        </div>
      {/each}
    </div>
  </Tooltip>

  <Section title="Available since" {loading}>{availableSince}</Section>
  <Section title="Last computed at" {loading}>{lastDatetimeComputedAt}</Section>

  {#if Description[metric.key]}
    <Section title="Description"
      >{@html prepareDescription(Description[metric.key], ticker)}</Section>
  {/if}

  {#if Frequency[metric.key]}
    <Section title="Frequency">{@html Frequency[metric.key]}</Section>
  {/if}
{/if}

<style>
  .btn-2 {
    color: var(--black) !important;
    --border-hover: var(--green);
  }

  .tooltip {
    width: 313px;
    padding: 8px;
  }

  .arrow {
    transform: rotate(180deg);
  }
</style>
