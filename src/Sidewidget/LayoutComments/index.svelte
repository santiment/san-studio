<script lang="ts">
  import { CommentsType } from 'webkit/api/comments'
  import Comments from 'webkit/ui/Comments/svelte'
  import { selectedLayout } from '@/stores/layout'
  import { currentUser } from '@/stores/user'
  import { updateLayoutCommentsCountCache } from '@/api/layouts/comments'

  export let closeSidewidget

  $: !$selectedLayout && closeSidewidget?.()

  function onNewComment(layout: SAN.Layout, comments: SAN.Comment[]) {
    updateLayoutCommentsCountCache(layout.id, comments.length)
  }
</script>

{#if $selectedLayout}
  <Comments
    type={CommentsType.Layout}
    commentsFor={$selectedLayout}
    currentUser={$currentUser}
    onAnonComment={window.onAnonComment}
    onCommentsLoaded={window.onCommentsLoaded}
    onCommentError={window.onCommentError}
    onCommentSubmitted={window.onCommentSubmitted}
    {onNewComment}
  />
{/if}
