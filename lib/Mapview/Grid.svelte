<script lang="ts">
  import { onDestroy, tick } from 'svelte'
  import { getHistoryContext } from './../history/ctx'
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import { mapview } from './../stores/mapview'
  import { getWidgets } from './../stores/widgets'
  import { selectedItems } from './../stores/selector'
  import { newSortableDndCtx } from './dnd'
  import SelectedStack from './SelectedStack.svelte'

  export let isMetricsPhase
  export let widgets

  const Widgets = getWidgets()
  const dndContext = newSortableDndCtx({ onDragEnd })
  const History = getHistoryContext()
  const onEscape = ({ key }) => key === 'Escape' && $dialogs.length === 0 && mapview.exit()

  let mountTimers = []
  let hiddenWidgets = new Set()
  mountHiddenWidgets()

  document.body.style.maxWidth = document.body.offsetWidth + 'px'
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onEscape)

  $: dndContext.toggle(isMetricsPhase)
  $: if ($mapview) {
    tick().then(tick).then(dndContext.ctx.recalcGrid)
  }

  function onDragEnd(oldIndex: number, newIndex: number) {
    if (oldIndex === newIndex) return

    const oldWidgets = widgets.slice()
    const newWidgets = widgets.slice()
    const widget = newWidgets.splice(oldIndex, 1)[0]
    newWidgets.splice(newIndex, 0, widget)

    Widgets.set(newWidgets)

    History.add(
      'Widgets rearranged',
      () => Widgets.set(oldWidgets),
      () => Widgets.set(newWidgets),
    )

    const { scrollParent } = dndContext.ctx
    if (!scrollParent) return

    const scrollTop = scrollParent.scrollTop
    window.requestAnimationFrame(() => {
      scrollParent.scrollTop = scrollTop
    })
  }

  function mountHiddenWidgets() {
    let i = 0

    hiddenWidgets.clear()
    mountTimers = widgets
      .map((widget) => {
        if (!widget.isHidden || !widget.show || widget.chart) return
        hiddenWidgets.add(widget)
        return setTimeout(widget.show, 500 * i++)
      })
      .filter(Boolean)
  }

  onDestroy(() => {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onEscape)
    selectedItems.clear()
    mountTimers.forEach(clearTimeout)
  })
</script>

<div class="mapview">
  <div class="sticky column">
    <div class="visible">
      <div class="widgets">
        <slot {hiddenWidgets} />
      </div>
    </div>
  </div>
</div>

{#if isMetricsPhase}
  <SelectedStack />
{/if}

<style>
  .mapview {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--athens);
    user-select: none;
    z-index: 23;
  }

  .sticky {
    height: 100vh;
    top: 0;
    position: sticky;
    padding: 64px 16px 0;
  }

  .visible {
    overflow: auto;
    flex: 1;
    margin-right: -17px;
    user-select: none;
    -webkit-user-select: none;
    padding-bottom: 40px;
  }

  .widgets {
    display: grid;
    grid-template-columns: repeat(auto-fit, 474px);
    grid-auto-flow: row dense;
    grid-gap: 20px;
    flex: 1 1;
    padding-top: 18px;
  }
</style>
