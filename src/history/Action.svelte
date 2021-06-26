<script lang="ts">
  import { onDestroy } from 'svelte'
  import { fade } from 'svelte/transition'
  export let HistoryEmitter

  let action
  let name

  $: if ($HistoryEmitter) notify()

  let timer
  function notify() {
    action = $HistoryEmitter.action
    name = $HistoryEmitter.name
    clearTimeout(timer)
    timer = setTimeout(() => (action = undefined), 800)
  }

  onDestroy(() => clearTimeout(timer))
</script>

{#if action}
  <div transition:fade={{ duration: 130 }}>{action}: {name}</div>
{/if}

<style>
  div {
    position: fixed;
    bottom: 20px;
    z-index: 21;
    left: 50%;
    transform: translateX(-50%);

    background: #505573;
    color: #fff;
    border-radius: 16px;
    padding: 5px 12px;
  }
</style>
