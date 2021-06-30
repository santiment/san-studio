<script lang="ts">
  import { onDestroy } from 'svelte'
  import { newGlobalShortcut } from 'webkit/utils/events'
  import Svg from 'webkit/ui/Icon.svelte'
  import { getHistoryContext } from '@/history'
  const History = getHistoryContext()

  export let isLocked

  const toggle = () => (isLocked = !isLocked)

  const unsubCmdBackslash = newGlobalShortcut('CMD+\\', toggle)
  const unsubCmdZ = newGlobalShortcut('CMD+Z', History.undo)
  const unsubCmdShiftZ = newGlobalShortcut('CMD+SHIFT+Z', History.redo)
  onDestroy(() => {
    unsubCmdBackslash()
    unsubCmdZ()
    unsubCmdShiftZ()
  })
</script>

<div class="toggle" on:click={toggle}>
  <div class:locked={isLocked} class="close caption txt-m">
    <Svg id="sidebar" w="12" h="10" class="$style.icon" />
  </div>
</div>

<style>
  .toggle {
    width: 12px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: -1px;
    user-select: none;
    border-right: 1px solid var(--porcelain);
    display: flex;
  }

  .icon {
    transform: rotate(270deg);
    margin: 0 0 0 8px;
  }

  .close {
    position: absolute;
    display: flex;
    align-items: center;
    white-space: nowrap;
    transform: rotate(270deg);
    color: var(--waterloo);
    fill: var(--waterloo);
    top: 64px;
    left: -34px;
    padding: 0 6px 7px;
    cursor: pointer;
  }

  .close,
  .close::after {
    background: var(--white);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .close::after {
    position: absolute;
    content: '';
    z-index: -1;
    top: 6px;
    left: -7px;
    bottom: -1px;
    right: -7px;
    border: 1px solid var(--porcelain);
    border-top: 0;
  }

  .close::before {
    content: 'Lock Sidebar';
  }

  .close:hover {
    color: var(--green);
    fill: var(--green);
  }

  .locked::before {
    content: 'Hide Sidebar';
  }

  .locked .icon {
    transform: rotate(90deg);
  }
</style>
