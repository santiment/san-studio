<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import MasterSelectorDialog from './index.svelte'

  export const showMasterSelectorDialog = (props?: any): Promise<unknown> =>
    dialogs.showOnce(MasterSelectorDialog, props)
</script>

<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import Dialog from 'webkit/ui/Dialog'
  import { studio } from '@/stores/studio'
  import Suggestions from './Suggestions.svelte'
  import Blockchains from './Blockchains.svelte'
  import { handleNavigation } from './navigation'
  import { addRecent } from './utils'

  let closeDialog
  let inputNode
  let searchTerm = ''
  let suggestions = []
  let context = {
    cursor: 0,
    items: [],
    onSelect,
  }
  let blockchain = undefined

  $: updateSuggestions(suggestions)

  function updateSuggestions(suggestions) {
    context.items = suggestions
    context.cursor = 0
  }

  function onKeyDown(e: KeyboardEvent) {
    if (handleNavigation(e, context)) return
    context = context
  }

  function onSelect(item) {
    if (!item) return

    studio.setProject(item)
    addRecent(item)
    closeDialog()
  }

  function onEditableEscaped(target: HTMLInputElement, closeDialog: () => void) {
    if (!target.value) return closeDialog()

    searchTerm = ''
  }
</script>

<!-- svelte-ignore a11y-autofocus -->

<Dialog {...$$props} noTitle class="$style.dialog" bind:closeDialog {onEditableEscaped}>
  <div class="search row v-center nowrap">
    <Svg id="search" w="16" class="$style.icon" />
    <input
      bind:this={inputNode}
      autofocus
      class="fluid body-2"
      type="text"
      placeholder="Search for asset or address..."
      bind:value={searchTerm}
      on:keydown={onKeyDown}
    />

    <Blockchains bind:blockchain {inputNode} />
  </div>

  <Suggestions
    bind:items={suggestions}
    searchTerm={searchTerm.toLowerCase()}
    cursor={context.cursor}
    {blockchain}
    {onSelect}
  />

  <!-- <div class="tip row v-center caption c-waterloo">PROTIP:</div> -->
</Dialog>

<style lang="scss">
  .dialog {
    width: 500px;
    max-height: 480px !important;
    border-radius: 10px !important;
  }

  // .tip {
  // padding: 12px 16px;
  // background: var(--athens);
  // border-top: 1px solid var(--porcelain);
  // }

  .search {
    fill: var(--waterloo);
    &:focus-within {
      fill: var(--green);
    }
  }

  input {
    padding: 16px 16px 16px 48px;
    border-radius: 10px;
  }

  .icon {
    position: absolute;
    top: 20px;
    left: 20px;
    pointer-events: none;
  }
</style>
