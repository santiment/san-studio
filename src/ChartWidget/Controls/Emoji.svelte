<script lang="ts">
  import type { EmojiIds } from '@/Chart/Drawer/drawings/emoji'
  import { track } from 'webkit/analytics'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import { Event } from '@/analytics'
  import { EMOJIS, newEmoji } from '@/Chart/Drawer/drawings/emoji'

  const random = (max: number, min: number) => Math.random() * (max - min) + min

  export let chart
  export let ChartDrawer

  let isOpened

  $: if (isOpened) track.event(Event.ShowEmojis)

  function onClick(e: MouseEvent) {
    const img = e.currentTarget as HTMLImageElement
    const id = img.alt as EmojiIds
    const xOffset = random(-0.01, 0.01)
    const yOffset = random(-0.06, 0.06)

    chart.drawer.addDrawing(
      newEmoji({
        id,
        ratioCoor: [0.06 + xOffset, 0.3 + yOffset],
      }),
    )
    track.event(Event.NewDrawing, { type: 'emoji', id })
  }
</script>

<Tooltip
  bind:isOpened
  on="click"
  duration={0}
  align="center"
  class="$style.Tooltip"
  activeClass="active"
>
  <div slot="trigger" class="btn-3" class:disabled={$ChartDrawer.isHidden}>
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
</style>
