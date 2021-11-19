<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import ReplyDialog from './ReplyDialog.svelte'

  export const showCommentReplyDialog = (entityId: number, parentId: number) =>
    dialogs.show<undefined | SAN.Comment>(ReplyDialog, {
      entityId,
      parentId,
    })
</script>

<script lang="ts">
  import type { DialogController } from 'webkit/ui/Dialog/dialogs'
  import Dialog from 'webkit/ui/Dialog'
  import { createLayoutComment } from '@/api/comments/mutate'

  export let DialogPromise: DialogController
  export let entityId: number
  export let parentId: number

  let closeDialog
  let loading = false

  function onSubmit({ currentTarget }: Event) {
    if (loading) return

    loading = true
    const commentNode = (currentTarget as HTMLFormElement)
      .comment as HTMLTextAreaElement

    createLayoutComment(entityId, commentNode.value, parentId).then(
      (comment) => {
        DialogPromise.resolve(comment)
        closeDialog()
      },
    )
  }
</script>

<Dialog {...$$props} bind:closeDialog title="Replying">
  <form class="dialog-body column" on:submit|preventDefault={onSubmit}>
    <textarea
      required
      class="input border"
      name="comment"
      rows="5"
      placeholder="Type your comment here" />

    <div class="row v-center mrg-l mrg--t">
      <button class="btn btn-2 border mrg-a mrg--l" on:click={closeDialog}
        >Cancel</button>

      <button
        type="submit"
        class:loading
        class="btn btn-1 btn--green mrg-l mrg--l">
        Submit reply
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
