<script lang="ts" context="module">
  function handleIntersection({ target, isIntersecting }) {
    const { widget } = target
    if (isIntersecting) widget.show()
    else widget.hide()
  }

  const intersectionHandler = (entries) => entries.forEach(handleIntersection)

  export function newWidgetViewportObserver() {
    return new IntersectionObserver(intersectionHandler, {
      rootMargin: '150px 0px 150px',
    })
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte'
  import { getHistoryContext } from 'san-webkit/lib/ui/history'
  import { getAdapterController } from './../../lib/adapter/context'
  import Subwidget from './Subwidget.svelte'
  const History = getHistoryContext()
  const { onWidget } = getAdapterController()
  export let widget
  export let Widgets
  export let onWidgetUpdate
  export let viewportObserver
  const isNative = !widget.isExternal
  widget.delete = deleteWidget
  widget.deleteWithHistory = deleteWidgetWithHistory
  widget.onWidgetUpdate = onWidgetUpdate

  widget.hide = () => (isVisible = false)

  widget.show = () => (isVisible = true)

  let isVisible = false
  let target

  $: isSingleWidget = $Widgets.length < 2

  $: widget.isHidden = !isVisible

  function deleteWidget() {
    Widgets.delete(widget)
    viewportObserver.unobserve(target)
    delete widget.chart
  }

  function deleteWidgetWithHistory() {
    deleteWidget()
    History.add(
      'Delete widget',
      () => {
        widget.scrollOnMount = true
        Widgets.push(widget)
      },
      deleteWidget,
    )
  }

  onMount(() => {
    widget.container = target
    target.widget = widget
    viewportObserver.observe(target)
    if (onWidget) onWidget(widget)
    const options = {
      block: widget.scrollAlign || 'center',
    }

    widget.scrollIntoView = () =>
      target === null || target === void 0 ? void 0 : target.scrollIntoView(options)

    if (widget.scrollOnMount) {
      widget.scrollIntoView()
      delete widget.scrollOnMount
    }
  })
</script>

<div class="widget border" bind:this={target}>
  {#if isNative && isVisible}
    <svelte:component
      this={widget.Widget}
      {widget}
      {isSingleWidget}
      deleteWidget={deleteWidgetWithHistory}
    />
  {/if}
</div>
{#if widget.subwidgets}
  {#each widget.subwidgets as subwidget}
    <Subwidget {subwidget} parentWidget={widget} />
  {/each}
{/if}

<style>
  .widget {
    margin-top: 16px;
    height: 530px;
    min-height: 530px;
    padding: 14px 16px;
  }
  .widget:first-child {
    margin: 0;
  }
  .widget:only-child {
    height: 100%;
  }
</style>
