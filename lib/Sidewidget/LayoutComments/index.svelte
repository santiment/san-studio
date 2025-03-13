<script>import { CommentsType } from 'san-webkit/lib/api/comments';
import Comments from 'san-webkit/lib/ui/Comments/svelte';
import { selectedLayout } from './../../stores/layout';
import { currentUser } from './../../stores/user';
import { updateLayoutCommentsCountCache } from './../../api/layouts/comments';
export let closeSidewidget;
$: !$selectedLayout && (closeSidewidget === null || closeSidewidget === void 0 ? void 0 : closeSidewidget());
function onNewComment(layout, comments) {
    updateLayoutCommentsCountCache(layout.id, comments.length);
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
