<script lang="ts">
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg.svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import { showEmbedDialog } from './EmbedDialog.svelte'

  export let widgets = [getWidget()]

  function onEmbed() {
    showEmbedDialog({ widgets })
    track.event(Event.Embed)
  }
</script>

<div class="btn controls-btn mrg-s mrg--l" on:click={onEmbed}>
  <Svg id="close" w="14" />
</div>
