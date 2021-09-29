<script lang="ts">
  import type { StickerIds } from '@/Chart/Drawer/drawings/stickers'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import Svg from 'webkit/ui/Svg.svelte'
  import { StickerSrc, newSticker } from '@/Chart/Drawer/drawings/stickers'

  const random = (max: number, min: number) => Math.random() * (max - min) + min
  const EMOJIS: [StickerIds, string][] = Object.entries(StickerSrc)

  export let chart

  function onClick(e: MouseEvent) {
    const img = e.currentTarget as HTMLImageElement
    const xOffset = random(-0.01, 0.01)
    const yOffset = random(-0.06, 0.06)
    chart.drawer.addDrawing(
      newSticker({
        id: img.alt as StickerIds,
        ratioCoor: [0.06 + xOffset, 0.3 + yOffset],
      }),
    )
  }
</script>

<Tooltip
  on="click"
  duration={0}
  align="center"
  class="$style.Tooltip"
  activeClass="$style.active">
  <div slot="trigger" class="controls-btn btn">
    <Svg id="smile" w="16" />
  </div>

  <div slot="tooltip" class="tooltip">
    {#each EMOJIS as emoji}
      <img class="btn emoji" alt={emoji[0]} src={emoji[1]} on:click={onClick} />
    {/each}
  </div>
</Tooltip>

<style>
  .Tooltip {
    margin-top: -6px;
  }

  .tooltip {
    padding: 16px;
    display: grid;
    grid-gap: 12px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }

  .emoji {
    width: 32px;
    height: 32px;
  }

  .active {
    --fill: var(--green) !important;
    --bg: var(--green-light-1);
  }
</style>
