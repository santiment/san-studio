<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { studio, getLockedAssetStore } from '@/stores/studio'
  import { getWidgets } from '@/stores/widgets'
  import { getAdapterController } from '@/adapter/context'
  import Category from '@/Sidebar/Category.svelte'
  import { getInsightsGraph } from './utils'

  const { InsightsContextStore } = getAdapterController()
  const Widgets = getWidgets()
  const LockedAsset = getLockedAssetStore()

  $: ({ from, to } = $studio)
  $: ({ ticker } = $LockedAsset)
  $: ({ insight, hasMyInsights, hasFollowings } = $InsightsContextStore)
  $: ({ insights, projectInsight } = getInsightsGraph(
    ticker,
    hasMyInsights,
    hasFollowings,
  ))
  $: ticker && updateInsightProject()
  $: updateInsightPeriod(from, to)

  const VisibleGroup = { Tags: true }

  function updateInsightProject() {
    if (insight && insight.type === 'project') {
      InsightsContextStore.set(projectInsight, from, to)
    }
  }

  function updateInsightPeriod(from, to) {
    if (insight) {
      InsightsContextStore.changePeriod(from, to)
    }
  }

  onMount(() => {
    InsightsContextStore.set(projectInsight, from, to)
    const widget = $Widgets[0]
    widget?.scrollIntoView?.()
  })

  onDestroy(() => {
    InsightsContextStore.set()
  })
</script>

<Category
  category="Santiment Insights"
  isOpened
  items={insights}
  {VisibleGroup}
  onItemClick={(_, item) => InsightsContextStore.set(item)} />
