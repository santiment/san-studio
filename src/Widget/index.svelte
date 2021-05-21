<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getAdapterController } from '@/adapter/context'
  import Subwidget from './Subwidget.svelte'
  const { onWidget } = getAdapterController()

  export let widget
  export let Widgets

  const deleteWidget = () => Widgets.delete(widget)
  widget.delete = deleteWidget

  let target
  let destroy
  $: isSingleWidget = $Widgets.length < 2

  onMount(() => {
    if (onWidget) destroy = onWidget(target, widget)
    const options = { block: widget.scrollAlign || 'center' }
    widget.scrollIntoView = () => target.scrollIntoView(options)
    if (widget.scrollOnMount) {
      widget.scrollIntoView()
      delete widget.scrollOnMount
    }
  })
  onDestroy(() => destroy && destroy(target, widget))
</script>

<div class="widget border" bind:this={target}>
  {#if widget.isExternal === false}
    <svelte:component
      this={widget.Widget}
      {widget}
      {isSingleWidget}
      {deleteWidget} />
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
    padding: 14px 16px;
  }
  .widget:first-child {
    margin: 0;
  }
  .widget:only-child {
    height: 100%;
  }
</style>
