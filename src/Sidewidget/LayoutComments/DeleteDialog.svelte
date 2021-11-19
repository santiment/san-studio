<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import DeleteDialog from './DeleteDialog.svelte'

  export const DELETE_MSG = 'The comment has been deleted.'
  export const showCommentDeleteDialog = (comment: SAN.Comment) =>
    dialogs.show<undefined | SAN.Comment>(DeleteDialog, { comment })
</script>

<script lang="ts">
  import type { DialogController } from 'webkit/ui/Dialog/dialogs'
  import Dialog from 'webkit/ui/Dialog'
  import { deleteComment } from '@/api/comments/mutate'

  export let DialogPromise: DialogController
  export let comment: SAN.Comment

  let closeDialog
  let loading = false

  function onDelete() {
    if (loading) return

    loading = true

    deleteComment(comment.id).then(() => {
      comment.content = DELETE_MSG
      comment.user = {
        id: 0,
        avatarUrl: null,
        email: 'anonymous@santiment.net',
        username: 'anonymous',
      }

      DialogPromise.resolve(comment)
      closeDialog()
    })
  }
</script>

<Dialog {...$$props} bind:closeDialog title="Delete comment?">
  <div class="dialog-body column">
    Are you sure you want to delete this comment?
    <div class="row v-center mrg-l mrg--t">
      <button class="btn btn-2 border mrg-a mrg--l" on:click={closeDialog}
        >Cancel</button>

      <button
        on:click={onDelete}
        class:loading
        class="btn btn-1 btn--green mrg-l mrg--l">
        Delete comment
      </button>
    </div>
  </div>
</Dialog>

<style>
  textarea {
    padding: 9px 12px;
    min-height: 40px;
    width: 400px;
  }
</style>
