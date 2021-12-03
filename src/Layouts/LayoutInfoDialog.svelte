<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import LayoutInfoDialog from './LayoutInfoDialog.svelte'

  export const showLayoutInfoDialog = (props: any): Promise<unknown> =>
    dialogs.show(LayoutInfoDialog, props)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import Svg from 'webkit/ui/Svg/svelte'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { selectedLayout } from '@/stores/layout'
  import { updateUserLayout } from '@/api/layouts/mutate'
  import LayoutInfo from './LayoutInfo.svelte'
  import { showNewLayoutDialog, Mode } from './NewLayoutDialog.svelte'
  import { showDeleteLayoutDialog } from './DeleteLayoutDialog.svelte'

  export let layout: SAN.Layout
  export let isAuthor = false
  export let closeLoadDialog

  let closeDialog

  function toggleLayoutPublicity() {
    const isPublic = !layout.isPublic
    layout.isPublic = isPublic
    updateUserLayout(layout.id, { isPublic })
  }

  function onUseClick() {
    selectedLayout.set(layout)
    closeDialog(false)
  }

  function onEditClick() {
    showNewLayoutDialog({
      layout,
      title: 'Edit Chart Layout',
      mode: Mode.Edit,
    })
  }

  function onDeleteClick() {
    showDeleteLayoutDialog({ layout }).then(
      (wasDeleted) => wasDeleted && closeDialog(),
    )
  }
</script>

<Dialog
  {...$$props}
  noBg
  class="$style.dialog"
  onBeforeDialogClose={() => setTimeout(closeLoadDialog)}
  bind:closeDialog>
  <div class="title btn" slot="title" on:click={() => closeDialog(true)}>
    <Svg id="arrow" w="14" h="8" class="mrg-l mrg--r $style.arrow" />
    {layout.title}
  </div>

  <div class="dialog-body">
    <div class="actions row txt-m mrg-xl mrg--b v-center">
      {#if isAuthor}
        <Tooltip duration={0} on="click">
          <div
            class="menu btn border row hv-center mrg-a mrg--r"
            slot="trigger">
            <Svg id="vert-dots" w="4" h="14" />
          </div>

          <div slot="tooltip" class="tooltip">
            <div class="btn btn--ghost" on:click={onEditClick}>Edit</div>
            <div class="delete btn btn--ghost" on:click={onDeleteClick}>
              Delete
            </div>
          </div>
        </Tooltip>

        Public
        <Toggle
          class="mrg-m mrg--l"
          isActive={layout.isPublic}
          on:click={toggleLayoutPublicity} />
      {:else}
        <div class="btn btn-1 btn--green" on:click={onUseClick}>
          Use Chart Layout
        </div>
      {/if}
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

  .title {
    --fill: var(--casper);
    --color-hover: var(--green);
  }

  .actions {
    color: var(--waterloo);
  }

  .menu {
    width: 32px;
    height: 32px;
    --fill: var(--black);
    --fill-hover: var(--green);
  }

  .tooltip {
    padding: 8px;
  }
</style>
