<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import { getAdapterController } from './../adapter/context'
  const { onSubwidget } = getAdapterController()

  export let parentWidget
  export let subwidget

  let target
  let destroy

  onMount(() => {
    if (onSubwidget) destroy = onSubwidget(target, subwidget, parentWidget)
  })
  onDestroy(() => destroy && destroy(target, subwidget, parentWidget))
</script>

<div bind:this={target} />
