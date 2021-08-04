<script lang="ts">
  import { getContext } from 'svelte'
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg.svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import { showFullscreenChart } from './FullscreenDialog.svelte'

  const widget = getWidget()
  const closeFullscreen = getContext('fullscreen')

  export let fullscreenMetricsFilter = undefined

  function onFullscreen() {
    showFullscreenChart({
      widget,
      fullscreenMetricsFilter,
    })
    track.event(Event.Fullscreen)
  }
</script>

<div
  class="btn controls-btn mrg-s mrg--l"
  on:click={closeFullscreen || onFullscreen}>
  <Svg id={closeFullscreen ? 'close' : 'fullscreen'} w="14" />
</div>
