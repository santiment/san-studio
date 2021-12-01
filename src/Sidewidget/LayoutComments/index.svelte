<script lang="ts">
  import { CommentsType } from 'webkit/api/comments'
  import Comments from 'webkit/ui/Comments/svelte'
  import { selectedLayout } from '@/stores/layout'
  import { currentUser } from '@/stores/user'
  import { updateLayoutCommentsCountCache } from '@/api/layouts/comments'

  function onNewComment(layout: SAN.Layout, comments: SAN.Comment[]) {
    updateLayoutCommentsCountCache(layout.id, comments.length)
  }
</script>

<Comments
  type={CommentsType.Layout}
  commentsFor={$selectedLayout}
  currentUser={$currentUser}
  onAnonComment={window.onAnonComment}
  onCommentsLoaded={window.onCommentsLoaded}
  onCommentError={window.onCommentError}
  {onNewComment} />
