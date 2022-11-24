<script lang="ts">import { onDestroy } from 'svelte';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { studio, getLockedAssetStore } from './../../../../lib/stores/studio';
import { getWidgets } from './../../../../lib/stores/widgets';
import { getAdapterController } from './../../../../lib/adapter/context';
import Category from './../../../../lib/Sidebar/Category.svelte';
import { getInsightsGraph } from './utils';
export let searchTerm = '';
export let isFiltering = false;
const {
  InsightsContextStore
} = getAdapterController();
const Widgets = getWidgets();
const LockedAsset = getLockedAssetStore();

$: ({
  from,
  to
} = $studio);

$: ({
  ticker
} = $LockedAsset);

$: ({
  insight,
  hasMyInsights,
  hasFollowings
} = $InsightsContextStore);

$: ({
  insights,
  projectInsight
} = getInsightsGraph(ticker, hasMyInsights, hasFollowings, searchTerm));

$: ticker && updateInsightProject();

$: updateInsightPeriod(from, to);

function updateInsightProject() {
  if (insight && insight.type === 'project') {
    InsightsContextStore.set(projectInsight, from, to);
  }
}

function updateInsightPeriod(from, to) {
  if (insight) {
    InsightsContextStore.changePeriod(from, to);
  }
}

onDestroy(() => {
  InsightsContextStore.set();
});</script>

<Category
  category="Insights"
  {isFiltering}
  items={insights}
  onItemClick={(_, item) => InsightsContextStore.set(item)}
>
  <svelte:fragment slot="pre-title">
    <Svg id="lightbulb" w="12" h="18" class="mrg-s mrg--r icon-vbK9y1" />
  </svelte:fragment>
</Category>

<style>
  :global(.icon-vbK9y1) {
    fill: var(--green) !important;
  }
</style>
