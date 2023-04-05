<script lang="ts">
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg/svelte'
  import ProjectIcon from 'webkit/ui/ProjectIcon.svelte'
  import { studio, getLockedAssetStore } from '@/stores/studio'
  import { Event } from '@/analytics'
  import { showLockedAssetDialog } from './Dialog.svelte'

  const LockedAsset$ = getLockedAssetStore() as any

  $: settings = $studio
  $: asset = $LockedAsset$

  function onSelect(asset) {
    if (!asset) return

    if (asset && settings.slug !== asset.slug) {
      track.event(Event.ChangeLockAsset, { asset: asset.slug })
    }

    LockedAsset$.set(asset)
  }
</script>

<button class="btn border fluid row v-center" on:click={() => showLockedAssetDialog({ onSelect })}>
  {#if asset.slug}
    <ProjectIcon {...asset} size={20} />
  {:else}
    <Svg id="report" w="8" />
  {/if}

  <span class="single-line">{asset.name || asset.address}</span>

  <Svg id="arrow-down" w="8" h="5" class="mrg-a mrg--l" />
</button>

<style>
  button {
    --border-hover: var(--green);
    border-radius: 4px;
    padding: 0 12px;
    height: 32px;
    max-width: 226px;
    gap: 6px;
    fill: var(--waterloo);
  }
</style>
