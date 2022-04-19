<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { newGlobalShortcut } from 'webkit/utils/events'
  import { queryAllProjects } from '@/api/project'
  import { studio } from '@/stores/studio'
  import { showMasterSelectorDialog } from '@/MasterSelectorDialog/index.svelte'
  import Asset from './Asset.svelte'
  import Address from './Address.svelte'

  const removeOpenMasterSelectorDialogHandler = newGlobalShortcut('CMD+K', showMasterSelectorDialog)
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
