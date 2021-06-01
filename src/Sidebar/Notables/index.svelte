<script lang="ts">
  import Svg from 'webkit/ui/Icon.svelte'
  import Item from './Item.svelte'
  import ChartPreview from './ChartPreview.svelte'
  import Category from '../Category.svelte'
  import { queryRawSignal, queryProjectNotables } from '@/api/signals'
  import { studio } from '@/stores/studio'
  import { NotableSignal } from '@/metrics/_notables'
  import { SelectorType } from '@/metrics/selector/types'
  import { checkIsFilterMatch } from '@/metrics/selector/utils'
  import { debounced } from '@/ChartWidget/utils'

  export let searchTerm = ''
  export let isFiltering = false

  let signals = []
  let hoveredNode
  let hoveredNotable
  let style

  $: settings = getVariables($studio)
  $: getRawSignals(settings)
  $: notables = getNotableMetrics(signals, searchTerm)
  $: style = hoveredNode && getPreviewStyles(hoveredNode)

  const getVariables = ({ slug, from, to }) => ({
    slug,
    from,
    to,
    interval: '2d',
  })

  const getRawSignals = debounced(({ slug, from, to }) => {
    queryRawSignal(slug, 'utc_now-4d', 'utc_now').then((res) => (signals = res))
  })

  function getNotableMetrics(signals, searchTerm) {
    return signals
      .map((key) => {
        const signal = NotableSignal[key]

        if (!signal) return
        if (searchTerm && !checkIsFilterMatch(searchTerm, signal.metric)) return

        return {
          key: signal.key,
          metric: signal.metric,
          label: signal.formatter(),
          selectorType: SelectorType.Notable,
        }
      })
      .filter(Boolean)
  }

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
    const { right } = node.getBoundingClientRect()
    let top = node.offsetTop
    const parent = node.closest('.categories')
    if (parent) top -= parent.scrollTop

    return `left:${right}px;top:${top}px`
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

{#if !isFiltering || (isFiltering && notables.length)}
  <Category category="Notables" {isFiltering} isOpened>
    <Svg slot="pre-title" id="flash" w="16" class="mrg-s mrg--r $style.flash" />

    {#each notables as notable}
      <Item
        {notable}
        {settings}
        {onItemEnter}
        on:mousewheel={closePreview}
        on:mouseleave={onItemLeave} />
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
    z-index: 10;
    transform: translateY(-50%);
  }
  div {
    padding: 10px 10px 0;
  }
</style>
