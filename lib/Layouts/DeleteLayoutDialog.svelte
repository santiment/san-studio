<script context="module">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import DeleteLayoutDialog from './DeleteLayoutDialog.svelte';
import { removeRecentLayoutId } from './utils';
export const showDeleteLayoutDialog = (props) => dialogs.show(DeleteLayoutDialog, props);
</script>

<script>import Dialog from 'san-webkit/lib/ui/Dialog';
import { deleteUserLayout } from './../api/layouts/mutate';
export let DialogPromise;
export let layout;
let closeDialog;
function onDeleteClick() {
    deleteUserLayout(layout.id).then(() => {
        removeRecentLayoutId(layout.id);
        DialogPromise.resolve(true);
        closeDialog();
    });
}
</script>

<Dialog
  {...$$props}
  title="Do you want to delete this layout?"
  bind:closeDialog
  class="dialog-SvCPap"
>
  <div class="dialog-body">
    This action cannot be undone
    <div class="row mrg-l mrg--t">
      <div class="btn btn-2 border mrg-a mrg--l" on:click={closeDialog}>Cancel</div>
      <div class="btn btn-1 btn--green mrg-l mrg--l" on:click={onDeleteClick}>Delete</div>
    </div>
  </div>
</Dialog>

<style>
  :global(.dialog-SvCPap) {
    width: 320px;
  }
</style>
