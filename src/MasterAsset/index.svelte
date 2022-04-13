<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { newGlobalShortcut } from 'webkit/utils/events'
  import { dialogs } from 'webkit/ui/Dialog'
  import { queryAllProjects } from '@/api/project'
  import { studio } from '@/stores/studio'
  import MasterSelectorDialog, {
    showMasterSelectorDialog,
  } from '@/MasterSelectorDialog/index.svelte'
  import Asset from './Asset.svelte'
  import Address from './Address.svelte'

  function openMasterSelectorDialog() {
    if (dialogs.has(MasterSelectorDialog)) return
    showMasterSelectorDialog()
  }

  const removeOpenMasterSelectorDialogHandler = newGlobalShortcut('CMD+K', openMasterSelectorDialog)
  let timer
  onMount(() => {
    timer = setTimeout(queryAllProjects, 300)
  })

  onDestroy(() => {
    removeOpenMasterSelectorDialogHandler()
    clearTimeout(timer)
  })
</script>

<div class="row v-center">
  {#if $studio.address}
    <Address />
  {:else}
    <Asset />
  {/if}

  <div class="project-actions mrg-a mrg--l row v-center" />
</div>
