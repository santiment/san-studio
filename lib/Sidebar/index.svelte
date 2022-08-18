<script lang="ts">
  import { onDestroy } from 'svelte'
  import { getHistoryContext } from 'san-webkit/lib/ui/history'
  import { saveBoolean } from 'san-webkit/lib/utils/localStorage'
  import { newGlobalShortcut } from 'san-webkit/lib/utils/events'
  import { getAdapterController } from './../../lib/adapter/context'
  import { showShortcutsDialog } from './../../lib/Shortcuts/Dialog.svelte'
  import { handleItemSelect } from './controller'
  import Sidebar from './Sidebar.svelte'
  import { Mode } from './Modes.svelte'
  import MetricsSidebar from './Metrics/Sidebar.svelte'
  import LayoutsSidebar from './Layouts/Sidebar.svelte'
  const History = getHistoryContext()
  const { checkIsMapviewDisabled } = getAdapterController()
  const LS_IS_SIDEBAR_LOCKED = 'LS_IS_SIDEBAR_LOCKED'
  export let Widgets, Sidewidget, adjustSelectedMetric
  let mode = Mode.Metrics
  let isLocked = true // getSavedBoolean(LS_IS_SIDEBAR_LOCKED, true)

  let isPeeked = false

  $: isOpened = isPeeked // || isDraggingMetric

  $: saveBoolean(LS_IS_SIDEBAR_LOCKED, isLocked)

  function onItemClick(e, item) {
    if (
      checkIsMapviewDisabled === null || checkIsMapviewDisabled === void 0
        ? void 0
        : checkIsMapviewDisabled()
    )
      return
    handleItemSelect(item, e, Widgets, Sidewidget, History, adjustSelectedMetric)
  }

  const removeOpenShortcutsDialogHandler = newGlobalShortcut('SHIFT+?', showShortcutsDialog)
  onDestroy(removeOpenShortcutsDialogHandler)
</script>

<Sidebar bind:isOpened bind:isLocked bind:isPeeked>
  <!-- 
  <svelte:fragment slot="left">
    <Modes bind:mode bind:isLocked />
  </svelte:fragment>
 -->

  {#if mode === Mode.Metrics}
    <MetricsSidebar {onItemClick} />
  {:else}
    <LayoutsSidebar {onItemClick} />
  {/if}
</Sidebar>

<style>
  :global(.sidebar-header) {
    padding: 16px;
    border-bottom: 1px solid var(--porcelain);
  }

  :global(.sidebar-content) {
    flex: 1;
    overflow: hidden;
    scrollbar-width: thin;
    padding-bottom: 30vh;
    max-width: 258px;
  }

  :global(.sidebar-content:hover) {
    overflow-y: auto;
    overflow-y: overlay;
  }
</style>
