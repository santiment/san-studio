<script lang="ts">
  import { onDestroy } from 'svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import { studio } from '@/stores/studio'
  import {
    queryLayouts,
    queryFeaturedLayouts,
    queryUserLayouts,
  } from '@/api/layouts'
  import { filterSelectorGraph } from '@/metrics/selector/utils'
  import Item from './Item.svelte'
  import {
    Tab,
    TABS,
    TICKER_LAYOUTS,
    normalizeCategory,
    newMyLibaryGraph,
    newExploreGraph,
    queryRecentLayouts,
  } from './utils'
  import Tabs from '../Tabs.svelte'
  import Search from '../Search.svelte'
  import Category from '../Category.svelte'

  let searchTerm = ''
  let tab = Tab.Explore
  let graph = {}
  let aborter = () => {}

  $: aborter =
    tab === Tab.MyLibrary
      ? showMyLibraryLayouts()
      : // @ts-ignore
        (slug, showExploreLayouts())
  $: ({ slug, ticker } = $studio)
  $: isFiltering = !!searchTerm
  $: categories = Object.keys(graph) as any[]
  $: filteredGraph = searchTerm ? filterSelectorGraph(graph, searchTerm) : graph

  const newCategoriesShower = (clb: any) => () => {
    aborter()
    let racing = false
    clb(() => racing)
    return () => (racing = true)
  }

  const showMyLibraryLayouts = newCategoriesShower((checkRacing) => {
    graph = newMyLibaryGraph()
    window.refetchMyLayout = () =>
      queryUserLayouts().then(
        (items) => checkRacing() || (graph['My layouts'] = items),
      )
    queryRecentLayouts().then(
      (items) => checkRacing() || (graph['Recently viewed'] = items),
    )
    window.refetchMyLayout()
  })

  const showExploreLayouts = newCategoriesShower((checkRacing) => {
    graph = newExploreGraph()
    queryLayouts(slug).then(
      (items) => checkRacing() || (graph[TICKER_LAYOUTS] = items),
    )
    queryFeaturedLayouts().then(
      (items) => checkRacing() || (graph['Featured by Santiment'] = items),
    )
  })
  onDestroy(() => (window.refetchMyLayout = null))
</script>

<div class="sidebar-header">
  <Tabs tabs={TABS} bind:tab />
  <div
    class="btn btn-1 btn--green mrg-l mrg--t row v-center"
    on:click={window.showNewLayoutDialog}>
    <Svg id="plus-circle" w="16" class="$style.plus mrg-s mrg--r" />
    Create chart layout
  </div>
  <Search bind:searchTerm placeholder="Search layouts" />
</div>
<div
  class="sidebar-content"
  on:scroll={() => window.__clearHoverItem && window.__clearHoverItem()}>
  {#each categories as category}
    {#if filteredGraph[category].length}
      <Category
        {isFiltering}
        isOpened
        category={normalizeCategory(category, ticker)}>
        {#each filteredGraph[category] as item (item.id)}
          <Item {item} />
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
