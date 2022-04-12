<script lang="ts">
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg/svelte'
  import { Event } from '@/analytics'
  import { getWidget } from '@/ChartWidget/context'
  import { showEmbedDialog } from './Embed/Dialog.svelte'

  export let widgets = [getWidget()]

  function onEmbed() {
    showEmbedDialog({ widgets })
    track.event(Event.Embed)
  }
</script>

<div class="btn-3 mrg-s mrg--r expl-tooltip" aria-label="Embed chart" on:click={onEmbed}>
  <Svg id="embed" w="20" h="12" />
</div>
