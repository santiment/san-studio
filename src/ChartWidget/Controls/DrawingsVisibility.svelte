<script lang="ts">
  import { getHistoryContext } from 'webkit/ui/history'
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg.svelte'
  import { Event } from '@/analytics'
  import { recordDrawingVisibility } from '@/history/drawings'

  const History = getHistoryContext()

  export let widget
  export let ChartDrawer

  $: isActive = $ChartDrawer.isHidden

  function onClick() {
    const newValue = !isActive
    ChartDrawer.toggleVisibility(newValue)
    recordDrawingVisibility(History, widget, newValue)
    track.event(Event.DrawingsVisibility, { value: isActive })
  }
</script>

<div
  class="btn expl-tooltip controls-btn controls-expl"
  aria-label={isActive ? 'Show drawings' : 'Hide drawings'}
  class:controls-btn_active={isActive}
  on:click={onClick}>
  {#if isActive}
    <Svg id="eye-crossed" w="20" h="17" />
  {:else}
    <Svg id="eye" w="18" h="12" />
  {/if}
</div>
