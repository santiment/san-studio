<script lang="ts">import { track } from 'san-webkit/lib/analytics';
import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { Event } from './../../../lib/analytics';
import { EMOJIS, newEmoji } from './../../../lib/Chart/Drawer/drawings/emoji';

const random = (max, min) => Math.random() * (max - min) + min;

export let chart;
export let ChartDrawer;
let isOpened;

$: if (isOpened) track.event(Event.ShowEmojis);

function onClick(e) {
  const img = e.currentTarget;
  const id = img.alt;
  const xOffset = random(-0.01, 0.01);
  const yOffset = random(-0.06, 0.06);
  chart.drawer.addDrawing(newEmoji({
    id,
    ratioCoor: [0.06 + xOffset, 0.3 + yOffset]
  }));
  track.event(Event.NewDrawing, {
    type: 'emoji',
    id
  });
}</script>

<Tooltip
  bind:isOpened
  on="click"
  duration={0}
  align="center"
  class="Tooltip-jY_8VM"
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
  :global(.Tooltip-jY_8VM) {
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
