<script context="module">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import LayoutInfoDialog from './LayoutInfoDialog.svelte';
export const showLayoutInfoDialog = (props) => dialogs.show(LayoutInfoDialog, props);
</script>

<script>import Dialog from 'san-webkit/lib/ui/Dialog';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Toggle from 'san-webkit/lib/ui/Toggle.svelte';
import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';
import { selectedLayout } from './../stores/layout';
import { updateUserLayout } from './../api/layouts/mutate';
import LayoutInfo from './LayoutInfo.svelte';
import { showNewLayoutDialog, Mode } from './NewLayoutDialog.svelte';
import { showDeleteLayoutDialog } from './DeleteLayoutDialog.svelte';
export let layout;
export let isAuthor = false;
export let closeLoadDialog;
let closeDialog;
function toggleLayoutPublicity() {
    const isPublic = !layout.isPublic;
    layout.isPublic = isPublic;
    updateUserLayout(layout.id, { isPublic });
}
function onUseClick() {
    selectedLayout.set(layout);
    closeDialog(false);
}
function onEditClick() {
    showNewLayoutDialog({
        layout,
        title: 'Edit Chart Layout',
        mode: Mode.Edit,
    });
}
function onDeleteClick() {
    showDeleteLayoutDialog({ layout }).then((wasDeleted) => wasDeleted && closeDialog());
}
</script>

<Dialog
  {...$$props}
  noBg
  animated={false}
  class="dialog-H8ITpG"
  onBeforeDialogClose={() => setTimeout(closeLoadDialog)}
  bind:closeDialog
>
  <div class="title btn" slot="title" on:click={() => closeDialog(true)}>
    <Svg id="arrow" w="14" h="8" class="mrg-l mrg--r arrow-MDSbjX" />
    {layout.title}
  </div>

  <div class="dialog-body">
    <div class="actions row txt-m mrg-xl mrg--b v-center">
      {#if isAuthor}
        <Tooltip duration={0} on="click">
          <div class="menu btn border row hv-center mrg-a mrg--r" slot="trigger">
            <Svg id="vert-dots" w="4" h="14" />
          </div>

          <div slot="tooltip" class="tooltip">
            <div class="btn-ghost" on:click={onEditClick}>Edit</div>
            <div class="delete btn-ghost" on:click={onDeleteClick}>Delete</div>
          </div>
        </Tooltip>

        Public
        <Toggle class="mrg-m mrg--l" isActive={layout.isPublic} on:click={toggleLayoutPublicity} />
      {:else}
        <div class="btn btn-1 btn--green" on:click={onUseClick}>Use Chart Layout</div>
      {/if}
    </div>

    <LayoutInfo {layout} />
  </div>
</Dialog>

<style>
  :global(.dialog-H8ITpG) {
    width: 600px;
    height: 480px;
  }

  :global(.arrow-MDSbjX) {
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
