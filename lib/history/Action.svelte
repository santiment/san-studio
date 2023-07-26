<script>import { onDestroy } from 'svelte';
import { fade } from 'svelte/transition';
export let HistoryEmitter;
let action;
let name;
let node;
$: if ($HistoryEmitter)
    notify();
let timer;
let popTimer;
function notify() {
    action = $HistoryEmitter.action;
    name = $HistoryEmitter.name;
    clearTimeout(timer);
    timer = setTimeout(() => (action = undefined), 900);
}
$: if (node && timer) {
    clearTimeout(popTimer);
    node.classList.remove('pop-IxpXbn');
    node.classList.add('pop-IxpXbn');
    popTimer = setTimeout(() => node === null || node === void 0 ? void 0 : node.classList.remove('pop-IxpXbn'), 120);
}
onDestroy(() => {
    clearTimeout(timer);
});
</script>

{#if action}
  <div bind:this={node} class="box" transition:fade={{ duration: 130 }}>
    {action}: {name}
  </div>
{/if}

<style>
  div {
    position: fixed;
    bottom: 20px;
    z-index: 101;
    left: 50%;
    transform: translateX(-50%);
    background: #505573;
    color: #fff;
    border-radius: 16px;
    padding: 5px 12px;
    transition: transform 100ms;
  }

  :global(.pop-IxpXbn) {
    transform: translateX(-50%) scale(1.07) !important;
  }
</style>
