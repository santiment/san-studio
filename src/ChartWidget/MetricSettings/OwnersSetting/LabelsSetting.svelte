<script lang="ts">
  import { onMount } from 'svelte'
  import { track } from 'webkit/analytics'
  import VirtualList from 'webkit/ui/VirtualList/svelte'
  import Search from 'webkit/ui/Search.svelte'
  import { debounce$$ } from 'webkit/utils/fn'
  import { withScroll } from 'webkit/ui/history'
  import { getHistoryContext } from '@/history/ctx'
  import { studio } from '@/stores/studio'
  import { getWidget } from '@/ChartWidget/context'
  import { studio as settings$ } from '@/stores/studio'
  import { queryAvailableOwnerLabels } from './api'
  import Dropdown from '../Dropdown.svelte'

  export let metric: any

  const History = getHistoryContext()
  const widget = getWidget()
  const { MetricSettings } = widget

  let labels = [] as any[]
  let searchTerm = ''

  const auto = 'Auto'

  $: slug = metric.project?.slug || $studio.slug
  $: items = Array.from(new Set([auto, ...labels]))
  $: metricSettings = $MetricSettings[metric.key]
  $: metricOwner = metricSettings?.owner
  $: metricLabel = metricSettings?.label
  $: filtered = searchTerm ? filter(items) : items
  $: process.browser && queryData(slug, metricOwner)

  const onSearch$ = debounce$$(250, (value: string) => (searchTerm = value))
  const onInput = ({ currentTarget }) => $onSearch$(currentTarget.value)

  function filter(items: string[]) {
    const value = searchTerm.toLowerCase()
    return items.filter((item) => item.toLowerCase().includes(value))
  }

  function onOptionSelect(newLabel: string) {
    track.event(Event.MetricLabel, { metric: metric.key, label: newLabel })
    const oldLabel = metricLabel || auto

    if (newLabel === oldLabel) {
      return
    }

    const redo = () => setLabel(metric, newLabel)

    redo()
    History.add(
      'Label change',
      withScroll(widget, () => setLabel(metric, oldLabel)),
      withScroll(widget, redo),
    )
  }

  function setLabel(metric: any, newLabel: string) {
    const { key } = metric

    if (newLabel === auto) {
      MetricSettings.delete(key, 'label')
      return
    }

    MetricSettings.set(key, { label: newLabel })
  }

  function queryData(slug: string, owner: string) {
    if (!owner) {
      return
    }

    const { key, queryKey = key } = metric

    queryAvailableOwnerLabels(queryKey, slug, owner).then((data) => {
      labels = data.filter(Boolean)
    })
  }
</script>

<Dropdown>
  Label: {metricLabel || auto}

  <svelte:fragment slot="dropdown">
    <Search class="$style.search mrg-s mrg--b" placeholder="Search..." on:input={onInput} />

    <div class="column">
      <VirtualList itemHeight={32} renderAmount={20} maxFluidHeight={150} items={filtered} let:item>
        <button class="btn-ghost" on:click={() => onOptionSelect(item)}>{item}</button>
      </VirtualList>
    </div>
  </svelte:fragment>
</Dropdown>

<style>
  .search {
    width: 230px;
  }

  div {
    height: 150px;
    width: 230px;
  }
</style>
