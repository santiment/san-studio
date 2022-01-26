<script lang="ts">
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg/svelte'
  import { Event } from '@/analytics'
  import { newNote } from '@/Chart/Drawer/drawings/note'

  export let chart
  export let ChartDrawer

  function onClick() {
    chart.drawer.addDrawing(
      newNote({
        ratioCoor: [0.03, 0.03],
      }),
    )
    track.event(Event.NewDrawing, { type: 'note' })
  }
</script>

<div class="btn-3" class:disabled={$ChartDrawer.isHidden} on:click={onClick}>
  <Svg id="note" w="14" />
</div>
