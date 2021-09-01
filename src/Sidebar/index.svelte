<script lang="ts">
  import { getHistoryContext } from 'webkit/ui/history'
  import { getSavedValue, saveValue } from '@/utils/localStorage'
  import { getNodeController } from '@/stores/selector'
  import { getAdapterController } from '@/adapter/context'
  import Sidebar from './Sidebar.svelte'
  import Toggle from './Toggle.svelte'
  import Modes, { Mode } from './Modes.svelte'
  import MetricsSidebar from './Metrics/Sidebar.svelte'
  import LayoutsSidebar from './Layouts/Sidebar.svelte'

  const History = getHistoryContext()
  const NodeController = getNodeController()
  const { checkIsMapviewDisabled } = getAdapterController() as any
  const LS_IS_SIDEBAR_LOCKED = 'LS_IS_SIDEBAR_LOCKED'

  let mode = Mode.Metrics
  let isLocked = !!getSavedValue(LS_IS_SIDEBAR_LOCKED, true)
  let isPeeked = false

  $: isOpened = isPeeked // || isDraggingMetric
  $: saveValue(LS_IS_SIDEBAR_LOCKED, isLocked ? '+' : '')

  function onItemClick(e: MouseEvent, item: any) {
    if (checkIsMapviewDisabled?.()) return
    NodeController(item, e, History)
  }
</script>

<Sidebar bind:isOpened bind:isLocked bind:isPeeked>
  <svelte:fragment slot="left">
    <Modes bind:mode />
  </svelte:fragment>

  {#if mode === Mode.Metrics}
    <MetricsSidebar {onItemClick} />
  {:else}
    <LayoutsSidebar {onItemClick} />
  {/if}

  <Toggle bind:isLocked />
</Sidebar>

<style>
  :global(.sidebar-header) {
    padding: 16px 24px;
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
