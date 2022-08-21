<script lang="ts">import { onDestroy } from 'svelte';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { studio } from './../../../lib/stores/studio';
import { globals } from './../../../lib/stores/globals';
import { queryShortLayouts, queryFeaturedShortLayouts, queryCurrentUserShortLayouts, subscribeCurrentUserShortLayoutsCache } from './../../../lib/api/layouts';
import { filterSelectorGraph } from './../../../lib/metrics/selector/utils';
import { showNewLayoutDialog } from './../../../lib/Layouts/NewLayoutDialog.svelte';
import Item from './Item.svelte';
import { Tab, TABS, TICKER_LAYOUTS, normalizeCategory, newMyLibaryGraph, newExploreGraph, queryRecentLayouts, checkHasOpenedMyLibrary, saveHasOpenedMyLibrary } from './utils';
import Tabs from '../Tabs.svelte';
import Search from '../Search.svelte';
import Category from '../Category.svelte';
let searchTerm = '';
let tab = checkHasOpenedMyLibrary() ? Tab.MyLibrary : Tab.Explore;
let graph = {};

let aborter = () => {};

let unsubscribeCache = aborter;

$: aborter = tab === Tab.MyLibrary ? showMyLibraryLayouts() : ( // @ts-ignore
slug, showExploreLayouts());

$: ({
  slug,
  ticker
} = $studio);

$: isFiltering = !!searchTerm;

$: categories = Object.keys(graph);

$: filteredGraph = searchTerm ? filterSelectorGraph(graph, searchTerm) : graph;

const rerenderGraph = () => graph = graph;

const newCategoriesShower = clb => () => {
  aborter();
  unsubscribeCache();
  let racing = false;
  clb(() => racing);
  return () => racing = true;
};

const showMyLibraryLayouts = newCategoriesShower(checkRacing => {
  graph = newMyLibaryGraph();
  queryCurrentUserShortLayouts().then(items => checkRacing() || (graph['My layouts'] = items));
  queryRecentLayouts().then(items => checkRacing() || (graph['Recently viewed'] = items));
  saveHasOpenedMyLibrary();
  unsubscribeCache = subscribeCurrentUserShortLayoutsCache(rerenderGraph);
});
const showExploreLayouts = newCategoriesShower(checkRacing => {
  graph = newExploreGraph();
  queryShortLayouts(slug).then(items => checkRacing() || (graph[TICKER_LAYOUTS] = items));
  queryFeaturedShortLayouts().then(items => checkRacing() || (graph['Featured by Santiment'] = items));
});

const onNewLayoutClick = () => {
  var _a;

  return (_a = $globals.isLoggedIn ? showNewLayoutDialog : window.showLoginPrompt) === null || _a === void 0 ? void 0 : _a();
};

onDestroy(() => {
  aborter();
  unsubscribeCache();
});</script>

<div class="sidebar-header">
  <Tabs tabs={TABS} bind:tab />
  <div class="btn-1 btn--s mrg-l mrg--t row v-center" on:click={onNewLayoutClick}>
    <Svg id="plus-circle" w="16" class=" mrg-s mrg--r" />
    Create chart layout
  </div>
  <Search bind:searchTerm placeholder="Search layouts" />
</div>
<div class="sidebar-content" on:scroll={() => window.__clearHoverItem && window.__clearHoverItem()}>
  {#each categories as category}
    {#if filteredGraph[category].length}
      <Category {isFiltering} isOpened category={normalizeCategory(category, ticker)}>
        {#each filteredGraph[category] as item (item.id)}
          <Item {item} />
        {/each}
      </Category>
    {/if}
  {/each}
</div>
