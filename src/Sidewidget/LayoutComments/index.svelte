<script lang="ts">
  import { CommentsType } from 'webkit/api/comments'
  import Comments from 'webkit/ui/Comments/svelte'
  import { selectedLayout } from '@/stores/layout'
  import { currentUser } from '@/stores/user'
  import { updateLayoutCommentsCountCache } from '@/api/layouts/comments'

  // export let onAnonComment: undefined | (() => void)
  // export let onCommentError = noop

  function onNewComment(layout: SAN.Layout, comments: SAN.Comment[]) {
    updateLayoutCommentsCountCache(layout.id, comments.length)
  }
</script>

<Comments
  type={CommentsType.Layout}
  commentsFor={$selectedLayout}
  currentUser={$currentUser}
  {onNewComment} />
