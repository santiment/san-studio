<script lang="ts">
  import { getContext } from 'svelte'
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg/svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import { showFullscreenChart } from './FullscreenDialog.svelte'

  const widget = getWidget()
  const closeFullscreen = getContext('fullscreen')

  export let fullscreenMetricsFilter = undefined
  export let isFullscreened: boolean

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
