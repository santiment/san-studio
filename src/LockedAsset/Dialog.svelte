<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import LockedAssetDialog from './Dialog.svelte'

  export const showLockedAssetDialog = (props) => dialogs.showOnce(LockedAssetDialog, props)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import ListOfAssets from 'webkit/ui/ListOfAssets/index.svelte'

  export let onSelect
</script>

<Dialog {...$$props} title="Select asset" class="$style.dialog" let:closeDialog>
  <main>
    <ListOfAssets
      onSelect={(asset) => {
        onSelect(asset)
        closeDialog()
      }}
      onEscape={closeDialog}
    />
  </main>
</Dialog>

<style>
  .dialog {
    width: 400px;
    height: 455px;
    max-width: 400px !important;
    max-height: 455px !important;
  }

  .loading {
    height: 100%;
  }

  main {
    padding: 8px 16px;
    flex: 1;
  }
</style>
