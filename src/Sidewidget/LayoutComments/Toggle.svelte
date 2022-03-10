<script lang="ts">
  import CommentsButton from 'webkit/ui/Comments/Button.svelte'
  import { SidewidgetType, getSidewidget } from '@/stores/widgets'
  import {
    queryLayoutCommentsCount,
    subscribeLayoutCommentsCountCache,
  } from '@/api/layouts/comments'

  let className = ''
  export { className as class }
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

<CommentsButton
  count={commentsCount}
  class={className}
  active={$Sidewidget === SidewidgetType.LAYOUT_COMMENTS}
  on:click={() => Sidewidget.set(SidewidgetType.LAYOUT_COMMENTS)} />
