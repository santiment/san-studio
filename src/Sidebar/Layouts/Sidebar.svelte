<script lang="ts" context="module">
  enum Tab {
    MyCharts = 'My Library',
    Explore = 'Explore',
  }
  const TABS = [Tab.MyCharts, Tab.Explore]
</script>

<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import { studio } from '@/stores/studio'
  import {
    queryLayouts,
    queryFeaturedLayouts,
    queryUserLayouts,
  } from '@/api/layouts'
  import { filterSelectorGraph } from '@/metrics/selector/utils'
  import Tabs from '../Tabs.svelte'
  import Search from '../Search.svelte'
  import Category from '../Category.svelte'
  import Item from '../Item.svelte'
  import HoverItem from './HoverItem.svelte'

  const TICKER = 'TICKER'
  const TICKER_LAYOUTS = TICKER + ' layouts'

  let searchTerm = ''
  let tab = Tab.MyCharts
  let graph = {}
  let aborter = () => {}

  $: aborter = (tab === Tab.MyCharts
    ? showMyLibraryLayouts
    : showExploreLayouts)()
  $: ({ ticker } = $studio)
  $: isFiltering = !!searchTerm
  $: categories = Object.keys(graph) as any[]
  $: filteredGraph = searchTerm ? filterSelectorGraph(graph, searchTerm) : graph

  const normalizeCategory = (title: string) => title.replace(TICKER, ticker)
  const newCategoriesShower = (clb: any) => () => {
    aborter()
    let racing = false
    clb(() => racing)
    return () => (racing = true)
  }

  const showMyLibraryLayouts = newCategoriesShower((checkRacing) => {
    graph = {
      'Recently viewed': [
        { id: 0, title: 'ETH layout' },
        { id: 1, title: 'Cool layout' },
      ],
      'My layouts': [],
    }
    queryUserLayouts().then(
      (items) => checkRacing() || (graph['My layouts'] = items),
    )
  })

  const showExploreLayouts = newCategoriesShower((checkRacing) => {
    graph = {
      'Featured by Santiment': [],
      [TICKER_LAYOUTS]: [],
    }
    queryLayouts().then(
      (items) => checkRacing() || (graph[TICKER_LAYOUTS] = items),
    )
    queryFeaturedLayouts().then(
      (items) => checkRacing() || (graph['Featured by Santiment'] = items),
    )
  })
</script>

<div class="sidebar-header">
  <Tabs tabs={TABS} bind:tab />
  <div class="btn btn-1 btn--green mrg-l mrg--t row v-center">
    <Svg id="plus-circle" w="16" class="$style.plus mrg-s mrg--r" />
    Create chart layout
  </div>
  <Search bind:searchTerm placeholder="Search layouts" />
</div>
<div class="sidebar-content">
  {#each categories as category}
    {#if filteredGraph[category].length}
      <Category isOpened category={normalizeCategory(category)} {isFiltering}>
        {#each filteredGraph[category] as item (item.id)}
          <Item {item} {HoverItem} on:click={() => onItemClick(item)}>
            {item.title}
          </Item>
        {/each}
      </Category>
    {/if}
  {/each}
</div>

<style>
  .btn {
    padding: 6px 12px;
  }
</style>
