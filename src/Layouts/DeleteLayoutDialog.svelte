<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import DeleteLayoutDialog from './DeleteLayoutDialog.svelte'
  import { removeRecentLayoutId } from './utils'

  export const showDeleteLayoutDialog = (props?: any) =>
    dialogs.show<boolean>(DeleteLayoutDialog, props)
</script>

<script lang="ts">
  import type { DialogController } from 'webkit/ui/Dialog/dialogs'
  import Dialog from 'webkit/ui/Dialog'
  import { deleteUserLayout } from '@/api/layouts/user/mutate'

  export let DialogPromise: DialogController
  export let layout: { id: number }

  let closeDialog

  function onDeleteClick() {
    deleteUserLayout(layout.id).then(() => {
      removeRecentLayoutId(layout.id)
      DialogPromise.resolve(true)
      closeDialog()
    })
  }
</script>

<Dialog
  {...$$props}
  title="Do you want to delete this layout?"
  bind:closeDialog
  class="$style.dialog">
  <div class="dialog-body">
    This action cannot be undone
    <div class="row mrg-l mrg--t">
      <div class="btn btn-2 border mrg-a mrg--l" on:click={closeDialog}>
        Cancel
      </div>
      <div class="btn btn-1 btn--green mrg-l mrg--l" on:click={onDeleteClick}>
        Delete
      </div>
    </div>
  </div>
</Dialog>

<style>
  .dialog {
    width: 320px;
  }
</style>
