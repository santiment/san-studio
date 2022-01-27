<script lang="ts">
  import { onDestroy } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { studio } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import {
    queryShortLayouts,
    queryFeaturedShortLayouts,
    queryCurrentUserShortLayouts,
    subscribeCurrentUserShortLayoutsCache,
  } from '@/api/layouts'
  import { filterSelectorGraph } from '@/metrics/selector/utils'
  import { showNewLayoutDialog } from '@/Layouts/NewLayoutDialog.svelte'
  import Item from './Item.svelte'
  import {
    Tab,
    TABS,
    TICKER_LAYOUTS,
    normalizeCategory,
    newMyLibaryGraph,
    newExploreGraph,
    queryRecentLayouts,
    checkHasOpenedMyLibrary,
    saveHasOpenedMyLibrary,
  } from './utils'
  import Tabs from '../Tabs.svelte'
  import Search from '../Search.svelte'
  import Category from '../Category.svelte'

  let searchTerm = ''
  let tab = checkHasOpenedMyLibrary() ? Tab.MyLibrary : Tab.Explore
  let graph = {}
  let aborter = () => {}
  let unsubscribeCache = aborter

  $: aborter =
    tab === Tab.MyLibrary
      ? showMyLibraryLayouts()
      : // @ts-ignore
        (slug, showExploreLayouts())
  $: ({ slug, ticker } = $studio)
  $: isFiltering = !!searchTerm
  $: categories = Object.keys(graph) as any[]
  $: filteredGraph = searchTerm ? filterSelectorGraph(graph, searchTerm) : graph

  const rerenderGraph = () => (graph = graph)
  const newCategoriesShower = (clb: any) => () => {
    aborter()
    unsubscribeCache()
    let racing = false
    clb(() => racing)
    return () => (racing = true)
  }

  const showMyLibraryLayouts = newCategoriesShower((checkRacing) => {
    graph = newMyLibaryGraph()
    queryCurrentUserShortLayouts().then(
      (items) => checkRacing() || (graph['My layouts'] = items),
    )
    queryRecentLayouts().then(
      (items) => checkRacing() || (graph['Recently viewed'] = items),
    )

    saveHasOpenedMyLibrary()
    unsubscribeCache = subscribeCurrentUserShortLayoutsCache(rerenderGraph)
  })

  const showExploreLayouts = newCategoriesShower((checkRacing) => {
    graph = newExploreGraph()
    queryShortLayouts(slug).then(
      (items) => checkRacing() || (graph[TICKER_LAYOUTS] = items),
    )
    queryFeaturedShortLayouts().then(
      (items) => checkRacing() || (graph['Featured by Santiment'] = items),
    )
  })

  const onNewLayoutClick = () =>
    ($globals.isLoggedIn ? showNewLayoutDialog : window.showLoginPrompt)?.()

  onDestroy(() => {
    aborter()
    unsubscribeCache()
  })
</script>

<div class="sidebar-header">
  <Tabs tabs={TABS} bind:tab />
  <div
    class="btn-1 btn--s mrg-l mrg--t row v-center"
    on:click={onNewLayoutClick}>
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
