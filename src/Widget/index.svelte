<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getHistoryContext } from '@/history'
  import { getAdapterController } from '@/adapter/context'
  import { setOnLoadContext } from '@/ChartWidget/context'
  import { getQueueStore } from './queue'
  import Subwidget from './Subwidget.svelte'

  const History = getHistoryContext()
  const Queue = getQueueStore()
  const { onWidget } = getAdapterController()

  export let widget
  export let Widgets

  const isNative = !widget.isExternal
  widget.delete = deleteWidget
  widget.deleteWithHistory = deleteWidgetWithHistory

  let target
  $: isSingleWidget = $Widgets.length < 2

  function deleteWidget() {
    Widgets.delete(widget)
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

  setOnLoadContext(Queue.delete)
  onMount(() => {
    widget.container = target
    if (onWidget) onWidget(widget)
    const options = { block: widget.scrollAlign || 'center' }
    widget.scrollIntoView = () => target?.scrollIntoView(options)
    if (widget.scrollOnMount) {
      widget.scrollIntoView()
      delete widget.scrollOnMount
    }
  })
  onDestroy(() => isNative && Queue.delete(widget))
</script>

<div class="widget border" bind:this={target}>
  {#if isNative && $Queue.has(widget) === false}
    <svelte:component
      this={widget.Widget}
      {widget}
      {isSingleWidget}
      deleteWidget={deleteWidgetWithHistory} />
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
