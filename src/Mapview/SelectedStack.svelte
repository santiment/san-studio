<script lang="ts">
  import { fly } from 'svelte/transition'
  import Svg from 'webkit/ui/Svg.svelte'
  import { selectedMetrics } from '@/stores/selector'
  import MetricButton from '@/MetricButton.svelte'

  $: ({ items: metrics, subwidgets } = $selectedMetrics)
  $: items = metrics.concat(subwidgets)
</script>

<div class="stack" transition:fly={{ duration: 250, x: -100 }}>
  {#if items.length}
    <div class="info row v-center">
      Selected item(s): <span class="mrg-xs mrg--l">{items.length}</span>

      <Svg
        id="cross"
        w="10"
        class="$style.delete"
        on:click={selectedMetrics.clear} />

      <div class="items">
        <div class="metrics row mrg-l mrg--b">
          {#each items as metric (metric.key)}
            <MetricButton
              {metric}
              onDelete={selectedMetrics.toggle}
              class="$style.btn" />
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .stack {
    position: fixed;
    bottom: 16px;
    left: 16px;
    z-index: 99;
    user-select: none;
  }
  .stack,
  .metrics {
    padding: 8px;
    border-radius: 4px;
    background: #505573;
  }

  .info {
    position: relative;
    cursor: pointer;
    color: #fff;
  }

  .items {
    display: none;
    position: absolute;
    bottom: 100%;
    left: -8px;
    width: 500px;
  }

  .metrics {
    padding: 8px 8px 0 0;
    flex-wrap: wrap;
    position: relative;
  }

  .metrics::after {
    content: '';
    display: block;
    position: absolute;
    height: 40px;
    top: 100%;
    left: 0px;
    right: 0;
    min-width: 160px;
  }

  .info:hover .items {
    display: flex;
  }

  .btn {
    white-space: nowrap;
    color: var(--black);
  }

  span {
    display: inline-block;
    width: 3ch;
  }

  .delete {
    fill: #fff;
    position: relative;
    z-index: 2;
  }
  .delete:hover {
    fill: var(--red);
  }
</style>
