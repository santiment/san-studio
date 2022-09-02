<script lang="ts">
  import { track } from 'san-webkit/lib/analytics'
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { Event } from './../../../lib/analytics'
  import { newNote } from './../../../lib/Chart/Drawer/drawings/note'
  export let chart
  export let ChartDrawer

  function onClick() {
    chart.drawer.addDrawing(
      newNote({
        ratioCoor: [0.03, 0.03],
      }),
    )
    track.event(Event.NewDrawing, {
      type: 'note',
    })
  }
</script>

<div class="btn-3" class:disabled={$ChartDrawer.isHidden} on:click={onClick}>
  <Svg id="note" w="14" />
</div>
