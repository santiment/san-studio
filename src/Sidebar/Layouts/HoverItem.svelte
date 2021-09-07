<script lang="ts">
  import type { DetailedLayout } from '@/api/layouts'
  import { onMount, onDestroy } from 'svelte'
  import { queryLayout } from '@/api/layouts'
  import LayoutInfo from '@/Layouts/LayoutInfo.svelte'
  import HoverItem from '../HoverItem.svelte'

  export let item: any
  export let node: HTMLElement
  export let hoverNode: HTMLElement

  let timer
  let layout = {} as DetailedLayout
  let destroyed = false

  const showPreview = () =>
    queryLayout(item.id).then((data) => destroyed || (layout = data))

  function startPreviewTimer() {
    window.clearTimeout(timer)
    timer = window.setTimeout(showPreview, 150)
  }
  function closePreview() {
    destroyed = true
    window.clearTimeout(timer)
  }

  onMount(startPreviewTimer)
  onDestroy(closePreview)
</script>

<HoverItem {node} {hoverNode}>
  {item.title}

  <svelte:fragment slot="right">
    {#if layout.title}
      <div class="preview border">
        <LayoutInfo {layout} />
      </div>
    {/if}
  </svelte:fragment>
</HoverItem>

<style>
  .preview {
    position: absolute;
    left: 100%;
    min-width: 350px;
    max-width: 400px;
    cursor: initial;
    color: var(--black);
    margin-left: 2px;
    padding: 20px;
  }
  .preview::before {
    content: '';
    position: absolute;
    left: -5px;
    width: 5px;
    top: 0;
    bottom: 0;
  }
</style>
