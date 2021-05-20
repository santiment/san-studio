<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import Category from '@/Sidebar/Category.svelte'
  import { studio } from '@/stores/studio'
  import { getInsightsGraph } from './utils'
  import { getWidgets } from '@/stores/widgets'
  import { getAdapterController } from '@/adapter/context'
  const { InsightsContextStore } = getAdapterController()
  const Widgets = getWidgets()

  $: ({ ticker, from, to } = $studio)
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
    widget.chart?.canvas?.scrollIntoView({ block: 'center' })
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
  onItemClick={InsightsContextStore.set} />
