<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import { SidewidgetType, getSidewidget } from '@/stores/widgets'
  import {
    queryLayoutCommentsCount,
    subscribeLayoutCommentsCountCache,
  } from '@/api/layouts/comments'

  export let layout: Pick<SAN.Layout, 'id'>

  const Sidewidget = getSidewidget()

  let commentsCount = 0
  let unsubscribe: ReturnType<typeof subscribeLayoutCommentsCountCache>

  $: process.browser && getCommentsCount(layout.id)

  const setCount = (count: number) => (commentsCount = count)
  function getCommentsCount(id: number) {
    queryLayoutCommentsCount(id).then(setCount)
    unsubscribe?.()
    unsubscribe = subscribeLayoutCommentsCountCache(id, setCount)
  }
</script>

<div
  class="action btn border txt-m"
  class:active={$Sidewidget === SidewidgetType.LAYOUT_COMMENTS}
  on:click={() => Sidewidget.set(SidewidgetType.LAYOUT_COMMENTS)}>
  <Svg id="comment" w="16" h="14" class="mrg-xs mrg--r" />
  {commentsCount}
</div>

<style>
  .action {
    padding: 5px 12px;
    border-radius: 20px;
    --color: var(--waterloo);
    --color-hover: var(--black);
    --border-hover: var(--mystic);
  }

  .active {
    --color: var(--green);
    --border: var(--green);
    --color-hover: var(--green-hover);
    --border-hover: var(--green-hover);
  }
</style>
