<script lang="ts">
  import Category from '@/Sidebar/Category.svelte'
  import { studio } from '@/stores/studio'
  import { getInsightsGraph } from './utils'

  $: items = getInsightsGraph($studio)
  const VisibleGroup = { Tags: true }
</script>

<Category
  category="Santiment Insights"
  isOpened
  {items}
  {VisibleGroup}
  onItemClick={console.log} />
