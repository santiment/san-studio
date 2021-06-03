<script lang="ts">
  import { track } from 'webkit/analytics'
  import {
    ONE_SECOND_IN_MS,
    ONE_MINUTE_IN_MS,
    ONE_HOUR_IN_MS,
  } from 'webkit/utils/dates'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { Event } from '@/analytics'
  import { getAutoUpdater } from '@/stores/autoUpdater'
  const AutoUpdater = getAutoUpdater()

  let interval
  let isOpened = false
  $: updated = isOpened ? startInterval() : stopInterval()

  function getDiffTime() {
    const diff = Date.now() - $AutoUpdater.lastUpdate

    if (diff < ONE_MINUTE_IN_MS) {
      return Math.floor(diff / ONE_SECOND_IN_MS) + 's'
    }

    if (diff < ONE_HOUR_IN_MS) {
      return Math.floor(diff / ONE_MINUTE_IN_MS) + 'm'
    }

    return Math.floor(diff / ONE_HOUR_IN_MS) + 'h'
  }

  function startInterval() {
    const newDiff = getDiffTime()
    const timeout = newDiff.endsWith('s') ? 1000 : 60000
    interval = window.setInterval(() => {
      updated = getDiffTime()
    }, timeout)

    return newDiff
  }

  function stopInterval() {
    window.clearInterval(interval)
    return updated
  }

  function onClick() {
    if ($AutoUpdater.isUpdating) {
      AutoUpdater.update(true)
    } else {
      AutoUpdater.enable()
    }

    track.event(Event.AutoUpdate)
  }
</script>

<Tooltip
  bind:isOpened
  dark
  class="caption $style.tooltip"
  position="top"
  align="end"
  duration={0}
  closeTimeout={0}>
  <div
    slot="trigger"
    class:active={$AutoUpdater.isUpdating}
    class="btn live row hv-center mrg-a mrg--l"
    on:click={onClick} />

  <svelte:fragment slot="tooltip">Updated {updated} ago</svelte:fragment>
</Tooltip>

<style>
  .live {
    width: 32px;
    height: 32px;
    --bg-hover: var(--athens);
    --dot: var(--casper);
    --border: #e5e8f0;
  }

  .live::before,
  .live::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 8px;
    height: 8px;
    background: var(--dot);
    position: relative;
    z-index: 2;
  }
  .live::before {
    position: absolute;
    transform: scale(2);
    z-index: 1;
    background: var(--border);
  }

  .active {
    --bg-hover: var(--green-light-1);
    --dot: #26c953;
    --border: #c3e9d2;
  }
  .active::before {
    animation: live infinite 1.4s both;
  }

  .tooltip {
    white-space: nowrap;
  }

  @keyframes live {
    0% {
      transform: scale(2);
    }
    70% {
      transform: scale(1.7);
    }
    100% {
      transform: scale(2);
    }
  }
</style>
