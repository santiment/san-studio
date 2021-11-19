<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import EditDialog from './EditDialog.svelte'

  export const showCommentEditDialog = (comment: SAN.Comment) =>
    dialogs.show<undefined | SAN.Comment>(EditDialog, { comment })
</script>

<script lang="ts">
  import type { DialogController } from 'webkit/ui/Dialog/dialogs'
  import Dialog from 'webkit/ui/Dialog'
  import { updateComment } from '@/api/comments/mutate'

  export let DialogPromise: DialogController
  export let comment: SAN.Comment

  let closeDialog
  let loading = false

  function onSubmit({ currentTarget }: Event) {
    if (loading) return

    loading = true
    const commentNode = (currentTarget as HTMLFormElement)
      .comment as HTMLTextAreaElement

    updateComment(comment.id, commentNode.value).then(() => {
      comment.content = commentNode.value
      comment.editedAt = new Date().toISOString()
      DialogPromise.resolve(comment)
      closeDialog()
    })
  }
</script>

<Dialog {...$$props} bind:closeDialog title="Update comment">
  <form class="dialog-body column" on:submit|preventDefault={onSubmit}>
    <textarea
      required
      class="input border"
      name="comment"
      rows="5"
      value={comment.content}
      placeholder="Type your comment here" />

    <div class="row v-center mrg-l mrg--t">
      <button class="btn btn-2 border mrg-a mrg--l" on:click={closeDialog}
        >Cancel</button>

      <button
        type="submit"
        class:loading
        class="btn btn-1 btn--green mrg-l mrg--l">
        Update comment
      </button>
    </div>
  </form>
</Dialog>

<style>
  textarea {
    padding: 9px 12px;
    min-height: 40px;
    width: 400px;
  }
</style>
