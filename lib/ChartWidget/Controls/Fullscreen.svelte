<script lang="ts">
  import { getContext } from 'svelte'
  import { track } from 'san-webkit/lib/analytics'
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import { Event } from './../../../lib/analytics'
  import { getWidget } from './../../../lib/ChartWidget/context'
  import { showFullscreenChart } from './FullscreenDialog.svelte'
  const widget = getWidget()
  const closeFullscreen = getContext('fullscreen')
  export let fullscreenMetricsFilter = undefined
  export let isFullscreened

  function onFullscreen() {
    isFullscreened = true
    showFullscreenChart({
      widget,
      fullscreenMetricsFilter,
    }).then(() => (isFullscreened = false))
    track.event(Event.Fullscreen)
  }
</script>

<div class="btn-3 mrg-s mrg--l" on:click={closeFullscreen || onFullscreen}>
  <Svg id={closeFullscreen ? 'close' : 'fullscreen'} w="14" />
</div>
