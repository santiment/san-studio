<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import LayoutInfoDialog from './LayoutInfoDialog.svelte'

  export const showLayoutInfoDialog = (props: any): Promise<unknown> =>
    dialogs.show(LayoutInfoDialog, props)
</script>

<script lang="ts">
  import type { Layout } from '@/api/layouts/user'
  import Dialog from 'webkit/ui/Dialog'
  import Svg from 'webkit/ui/Svg.svelte'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import { updateUserLayout } from '@/api/layouts/user'
  import LayoutInfo from './LayoutInfo.svelte'

  export let layout: Layout
  export let closeLoadDialog
  export let rerenderLayouts

  let closeDialog

  function toggleLayoutPublicity() {
    const isPublic = !layout.isPublic
    layout.isPublic = isPublic
    updateUserLayout(layout.id, { isPublic }).then(() => {
      layout.updatedAt = new Date().toISOString()
      rerenderLayouts()
    })
  }
</script>

<Dialog
  {...$$props}
  noBg
  class="$style.dialog"
  onBeforeDialogClose={() => setTimeout(closeLoadDialog)}
  bind:closeDialog>
  <div class="btn" slot="title" on:click={() => closeDialog(true)}>
    <Svg id="arrow" w="14" h="8" class="mrg-l mrg--r $style.arrow" />
    {layout.title}
  </div>

  <div class="dialog-body">
    <div class="actions row txt-m mrg-xl mrg--b">
      Public
      <Toggle
        class="mrg-m mrg--l"
        isActive={layout.isPublic}
        on:click={toggleLayoutPublicity} />
    </div>

    <LayoutInfo {layout} />
  </div>
</Dialog>

<style>
  .dialog {
    width: 600px;
    height: 480px;
  }

  .arrow {
    transform: rotate(-90deg);
  }

  .btn {
    --fill: var(--casper);
    --color-hover: var(--green);
  }

  .actions {
    color: var(--waterloo);
  }
</style>
