<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { queryAllProjects } from '@/api/project'
  import { studio } from '@/stores/studio'
  import Asset from './Asset.svelte'
  import Address from './Address.svelte'

  let timer
  onMount(() => {
    timer = setTimeout(queryAllProjects, 150)
  })

  onDestroy(() => {
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
