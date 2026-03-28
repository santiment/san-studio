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
  import { queryAvailableOwners } from './api'
  import LabelsSetting from './LabelsSetting.svelte'
  import Dropdown from '../Dropdown.svelte'

  export let metric: any

  const History = getHistoryContext()
  const widget = getWidget()
  const { MetricSettings } = widget

  let owners = [] as any[]
  let searchTerm = ''

  const auto = 'Auto'

  $: slug = metric.project?.slug || $studio.slug
  $: items = Array.from(new Set([auto, ...owners]))
  $: metricSettings = $MetricSettings[metric.key]
  $: metricOwner = metricSettings?.owner
  $: filtered = searchTerm ? filter(items) : items
  $: process.browser && queryOwners(slug)

  const onSearch$ = debounce$$(250, (value: string) => (searchTerm = value))
  const onInput = ({ currentTarget }) => $onSearch$(currentTarget.value)

  function filter(items: string[]) {
    const value = searchTerm.toLowerCase()
    return items.filter((item) => item.toLowerCase().includes(value))
  }

  function onOptionSelect(newOwner: string) {
    track.event(Event.MetricOwner, { metric: metric.key, owner: newOwner })
    const oldOwner = metricOwner || auto

    if (newOwner === oldOwner) {
      return
    }

    const oldLabel = metricSettings?.label
    const redo = () => setOwner(metric, newOwner)

    redo()
    History.add(
      'Owner change',
      withScroll(widget, () => setOwner(metric, oldOwner, oldLabel)),
      withScroll(widget, redo),
    )
  }

  function setOwner(metric: any, newOwner: string, newLabel?: string) {
    const { key } = metric

    if (newOwner === auto) {
      MetricSettings.delete(key, 'owner')
      MetricSettings.delete(key, 'label')
      return
    }

    MetricSettings.set(key, { owner: newOwner })
    MetricSettings.set(key, { label: newLabel })
  }

  function queryOwners(slug: string) {
    console.log(metric)

    const { key, queryKey = key } = metric

    queryAvailableOwners(queryKey, slug).then((data) => {
      owners = data
    })
  }
</script>

<Dropdown>
  Owner: {metricOwner || auto}

  <svelte:fragment slot="dropdown">
    <Search class="$style.search mrg-s mrg--b" placeholder="Search..." on:input={onInput} />

    <div class="column">
      <VirtualList itemHeight={32} renderAmount={20} maxFluidHeight={150} items={filtered} let:item>
        <button class="btn-ghost" on:click={() => onOptionSelect(item)}>{item}</button>
      </VirtualList>
    </div>
  </svelte:fragment>
</Dropdown>

<LabelsSetting {metric} />

<style>
  .search {
    width: 160px;
  }

  div {
    height: 150px;
    width: 160px;
  }
</style>
