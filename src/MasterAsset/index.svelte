<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { FeatureWalkthrough$ } from 'webkit/ui/FeatureWalkthrough/context'
  import { queryAllProjects } from '@/api/project'
  import { studio } from '@/stores/studio'
  import Asset from './Asset.svelte'
  import Address from './Address.svelte'
  import selectorSrc from './selector.jpg'

  let timer
  onMount(() => {
    timer = setTimeout(queryAllProjects, 150)

    FeatureWalkthrough$.show({
      id: 'fw-master-selector',
      title: 'New master select',
      description: `<p class="mrg-l mrg--b">Paste the concrete smart contract address for fetching relevant metrics for it</p>
      <img src="${selectorSrc}" alt="Example" />`,
    })
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

  <section class="project-actions mrg-a mrg--l row v-center">
    <button class="btn-1 btn--s row v-center" on:click={window.onWatchClick}>
      <Svg id="add-list" w="16" h="14" />
      Watch
    </button>
    <button class="btn-2 btn--s row v-center mrg-s mrg--l" on:click={window.onAddAlertClick}>
      <Svg id="alert" w="16" />
      Add alert</button
    >
  </section>
</div>

<style>
  button {
    gap: 8px;
  }
</style>
