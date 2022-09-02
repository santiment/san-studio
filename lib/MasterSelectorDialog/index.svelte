<script lang="ts">
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import { studio } from './../../lib/stores/studio'
  import Suggestions from './Suggestions.svelte'
  import Blockchains from './Blockchains.svelte'
  import { handleNavigation } from './navigation'
  import { addRecent, replaceDefaultMetrics } from './utils'
  import { getWidgets } from './../../lib/stores/widgets'
  export let onItemSelect
  const Widgets = getWidgets()
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

  function onKeyDown(e) {
    if (handleNavigation(e, context)) return
    context = context
  }

  function onSelect(item) {
    if (!item) return

    if (onItemSelect) {
      onItemSelect(item)
    } else {
      studio.setProject(item)
      replaceDefaultMetrics(item, $Widgets)
    }

    addRecent(item)
    closeDialog()
  }

  function onEditableEscaped(target, closeDialog) {
    if (!target.value) return closeDialog()
    searchTerm = ''
  }
</script>

<!-- svelte-ignore a11y-autofocus -->

<Dialog {...$$props} noTitle class="dialog-E1Gbnm" bind:closeDialog {onEditableEscaped}>
  <div class="search row v-center nowrap">
    <Svg id="search" w="16" class="icon-06Ailh" />
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
  :global(.dialog-E1Gbnm) {
    width: 500px;
    max-height: 480px !important;
    border-radius: 10px !important;
  }

  .search {
    fill: var(--waterloo);
  }
  .search:focus-within {
    fill: var(--green);
  }

  input {
    padding: 16px 16px 16px 48px;
    border-radius: 10px;
  }

  :global(.icon-06Ailh) {
    position: absolute;
    top: 20px;
    left: 20px;
    pointer-events: none;
  }
</style>
