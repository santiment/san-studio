<script lang="ts">
  import { onMount } from 'svelte'
  import { track } from 'san-webkit/lib/analytics'
  import VirtualList from 'san-webkit/lib/ui/VirtualList/svelte'
  import Search from 'san-webkit/lib/ui/Search.svelte'
  import { debounce$$ } from 'san-webkit/lib/utils/fn'
  import { withScroll } from 'san-webkit/lib/ui/history'
  import { queryAllProjects } from './../../api/project'
  import { getHistoryContext } from './../../history/ctx'
  import { getWidget } from './../../ChartWidget/context'
  import { studio as settings$ } from './../../stores/studio'
  import Dropdown from './Dropdown.svelte'

  export let metric: any

  const History = getHistoryContext()
  const widget = getWidget()
  const { MetricSettings } = widget

  let assets = [] as any[]
  let searchTerm = ''

  $: ticker = $settings$.ticker
  $: autoTicker = `Auto (${ticker})`
  $: items = Array.from(new Set([autoTicker, ...assets]))
  $: metricSettings = $MetricSettings[metric.key]
  $: metricOwner = metricSettings?.owner
  $: filtered = searchTerm ? filter(items) : items

  const onSearch$ = debounce$$(250, (value: string) => (searchTerm = value))
  const onInput = ({ currentTarget }) => $onSearch$(currentTarget.value)

  function filter(items: string[]) {
    const value = searchTerm.toLowerCase()
    return items.filter((item) => item.toLowerCase().includes(value))
  }

  function onOwnerSelect(newOwner: string) {
    track.event(Event.MetricSettlementCurrency, { metric: metric.key, owner: newOwner })
    const oldOwner = metricOwner || autoTicker
    const redo = () => setSettlementCurrency(metric, newOwner)

    redo()
    History.add(
      'Settlement Currency change',
      withScroll(widget, () => setSettlementCurrency(metric, oldOwner)),
      withScroll(widget, redo),
    )
  }

  function setSettlementCurrency(metric: any, newOwner: string) {
    const { key } = metric

    if (newOwner === autoTicker) {
      MetricSettings.delete(key, 'owner')
      return
    }

    MetricSettings.set(key, { owner: newOwner })
  }

  onMount(() => {
    queryAllProjects().then((data) => {
      assets = Array.from(new Set(data.map(({ ticker }) => ticker)))
    })
  })
</script>

<Dropdown>
  Settlement Currency: {metricOwner || autoTicker}

  <svelte:fragment slot="dropdown">
    <Search class="$style.search mrg-s mrg--b" placeholder="Search for asset" on:input={onInput} />

    <div class="column">
      <VirtualList itemHeight={32} renderAmount={20} maxFluidHeight={150} items={filtered} let:item>
        <button class="btn-ghost" on:click={() => onOwnerSelect(item)}>{item}</button>
      </VirtualList>
    </div>
  </svelte:fragment>
</Dropdown>

<style>
  .search {
    width: 160px;
  }

  div {
    height: 150px;
    width: 160px;
  }
</style>
