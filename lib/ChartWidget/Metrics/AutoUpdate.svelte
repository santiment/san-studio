<script lang="ts">
  import { track } from 'san-webkit/lib/analytics'
  import { ONE_SECOND_IN_MS, ONE_MINUTE_IN_MS, ONE_HOUR_IN_MS } from 'san-webkit/lib/utils/dates'
  import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte'
  import { Event } from './../../analytics'

  export let AutoUpdater
  export let changeStudioPeriod

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
      AutoUpdater.enable(changeStudioPeriod)
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
  closeTimeout={0}
>
  <div
    slot="trigger"
    class:active={$AutoUpdater.isUpdating}
    class="btn-3 live row hv-center mrg-s mrg--b"
    on:click={onClick}
  />

  <svelte:fragment slot="tooltip">Updated {updated} ago</svelte:fragment>
</Tooltip>

<style>
  .live {
    align-self: flex-end;
    --bg: var(--athens);
    --bg-hover: var(--athens);
    --dot: var(--casper);
    --border: #e5e8f0;
  }

  :global(.night-mode) .live {
    --border: #193830;
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

  .live:active {
    --bg-hover: var(--porcelain);
  }

  .active {
    --bg: none !important;
    --bg-hover: var(--green-light-1);
    --dot: #26c953;
    --border: #c3e9d2;
  }
  .active::before {
    animation: live infinite 1.4s both;
  }
  .active:active {
    --bg-hover: var(--green-light-2);
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
