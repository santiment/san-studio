<script lang="ts">
  import Svg from 'webkit/ui/Svg/svelte'
  import { studio } from '@/stores/studio'

  export let i
  export let metric
  export let onLock, onDelete

  $: ({ ticker } = $studio)
  $: isLocked = !!metric.project
</script>

<div class="border metric row v-center">
  <span class="var mrg-s mrg--r">x{i + 1}</span>
  {metric.label}

  <div
    class="btn row expl-tooltip"
    title={isLocked ? 'Unlock metric' : 'Lock metric to ' + ticker}
    on:click={() => onLock(metric, i, $studio)}>
    <Svg id={isLocked ? 'locked' : 'unlocked'} w="14" />
  </div>

  {#if onDelete}
    <div class="btn row" on:click={() => onDelete(i)}>
      <Svg id="cross" w="8" />
    </div>
  {/if}
</div>

<style>
  .metric {
    padding: 3px 5px;
    margin: 0 0 8px 8px;
  }

  .var {
    background: var(--green-light-1);
    padding: 2px 5px;
    border-radius: 4px;
    color: var(--green);
  }

  .btn {
    margin: 0 4px 0 8px;
    --fill: var(--waterloo);
    --fill-hover: var(--green);
  }

  .expl-tooltip {
    position: relative;
  }
  .expl-tooltip::before {
    transform: translate(-50%, -100%) !important;
    left: 50%;
  }
</style>
