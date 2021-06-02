<script lang="ts">
  import { setContext, getContext } from 'svelte'
  import { track } from 'webkit/analytics'
  import Icon from 'webkit/ui/Icon.svelte'
  import { Event } from '@/analytics'
  import ChartWidget from '@/ChartWidget/index.svelte'
  import { getWidget } from '@/ChartWidget/context'
  const widget = getWidget()

  export let fullscreenMetricsFilter = undefined

  let isOpened = false

  const closeFullscreen = getContext('fullscreen')
  if (!closeFullscreen) setContext('fullscreen', close)

  function close() {
    const { drawer } = widget.chart
    isOpened = false
    if (drawer) drawer.recalcAbsCoor()
  }

  function onClickaway({ currentTarget, target }) {
    if (currentTarget !== target) return
    close()
  }

  function onFullscreen() {
    track.event(Event.Fullscreen)
    isOpened = true
  }
</script>

<div
  class="btn controls-btn mrg-s mrg--l"
  on:click={closeFullscreen || onFullscreen}>
  <Icon id={closeFullscreen ? 'close' : 'fullscreen'} w="14" />
</div>

{#if isOpened}
  <div class="bg row hv-center" on:click={onClickaway}>
    <div class="dialog border">
      <ChartWidget
        {widget}
        isFullscreen
        isSingleWidget
        metricsFilter={fullscreenMetricsFilter} />
    </div>
  </div>
{/if}

<style>
  .bg {
    position: fixed;
    background: rgba(0, 0, 0, 0.7);
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 30;
  }

  .dialog {
    width: 96%;
    height: 92%;
    padding: 16px;
    position: relative;
  }
</style>
