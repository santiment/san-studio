<script lang="ts">
  import Svg from 'webkit/ui/Svg.svelte'
  import { queryRawSignal } from '@/api/signals'
  import { studio, getLockedAssetStore } from '@/stores/studio'
  import { debounced } from '@/ChartWidget/utils'
  import Category from '@/Sidebar/Category.svelte'
  import { getSettings, getNotableMetrics } from './utils'
  import Item from './Item.svelte'
  import ChartPreview from './ChartPreview.svelte'

  const LockedAsset = getLockedAssetStore()

  export let searchTerm = ''
  export let isFiltering = false
  export let onItemClick

  let signals = []
  let hoveredNode
  let hoveredNotable
  let style

  $: settings = getSettings($LockedAsset, $studio)
  $: getRawSignals(settings)
  $: notables = getNotableMetrics(signals, searchTerm)
  $: style = hoveredNode && getPreviewStyles(hoveredNode)

  const getRawSignals = debounced(({ slug }) => {
    queryRawSignal(slug, 'utc_now-2d', 'utc_now').then((res) => (signals = res))
  })

  let timer
  function onItemEnter(node, notable) {
    window.clearTimeout(timer)
    if (style) return setHovered(node, notable)

    timer = window.setTimeout(() => setHovered(node, notable), 150)
  }

  function setHovered(node, notable) {
    window.clearTimeout(closeTimer)
    hoveredNode = node
    hoveredNotable = notable
  }

  function getPreviewStyles(node) {
    const { top, right } = node.getBoundingClientRect()
    return `left:${right - 33}px;top:${top}px`
  }

  let closeTimer
  function onItemLeave() {
    window.clearTimeout(closeTimer)
    if (!style) return closePreview()

    closeTimer = window.setTimeout(closePreview, 50)
  }

  function closePreview() {
    window.clearTimeout(timer)
    if (!hoveredNotable) return
    hoveredNotable = null
    hoveredNode = null
  }
</script>

{#if notables.length}
  <Category category="Notables" {isFiltering} isOpened>
    <svelte:fragment slot="pre-title">
      <Svg id="flash" w="12" h="16" class="mrg-s mrg--r $style.flash" />
    </svelte:fragment>

    {#each notables as notable}
      <Item
        {notable}
        {onItemClick}
        {onItemEnter}
        on:mousewheel={closePreview}
        onLeave={onItemLeave} />
    {/each}

    {#if style}
      <div
        {style}
        class="border preview column caption"
        on:mouseenter={closePreview}
        on:mouseleave={closePreview}>
        <div>{hoveredNotable.label}</div>
        <ChartPreview {settings} {...hoveredNotable} />
      </div>
    {/if}
  </Category>
{/if}

<style>
  .flash {
    fill: var(--red);
  }

  .preview {
    width: 320px;
    height: 152px;
    padding: 8px 14px;
    position: absolute;
    z-index: 1;
    transform: translateY(-50%);
  }
  div {
    padding: 10px 10px 0;
  }
</style>
