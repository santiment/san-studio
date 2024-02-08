<script>import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { studio } from './../stores/studio';
import Metric from './Metric.svelte';
export let metrics;
export let mergedMetrics;
export let mergingMetrics;
export let colors;
export let Metrics;
export let isMerging = false;
export let onMergeClick, onMetricClick, onUnmergeClick;
let isOpened = true;
</script>

<div class="aside column" class:opened={isOpened}>
  <div class="toggle">
    <Svg
      id="sidebar"
      w="12"
      h="10"
      class="btn icon-rZUgpY"
      on:click={() => (isOpened = !isOpened)}
    />
  </div>

  {#if isOpened}
    <div class="row v-center mrg-l mrg--b">
      <div class="body-2 txt-m">
        {$studio.ticker} Supply Distribution
        <div class="body-3">
          <slot />
        </div>
      </div>

      <div
        class="merge btn border mrg-a mrg--l row v-center"
        on:click={onMergeClick}
        class:merging={isMerging}
        class:confirm={isMerging && mergingMetrics.size > 1}
      >
        {#if isMerging}
          {mergingMetrics.size > 1 ? 'Confirm' : 'Cancel'}
        {:else}
          <Svg id="merge" w="18" h="14" class="mrg-s mrg--r" /> Merge
        {/if}
      </div>
    </div>

    <slot name="tabs" />

    <div class="metrics column">
      {#if !isMerging}
        {#each mergedMetrics as metric}
          <Metric {metric} {colors} isActive={$Metrics.includes(metric)} onClick={onMetricClick}>
            <span class="btn unmerge mrg-s mrg--l" on:click={() => onUnmergeClick(metric)}>
              Unmerge
            </span>
          </Metric>
        {/each}
      {/if}

      {#each metrics as metric}
        <Metric
          {metric}
          {colors}
          {isMerging}
          isActive={isMerging ? mergingMetrics.has(metric) : $Metrics.includes(metric)}
          onClick={onMetricClick}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .aside {
    margin: -16px;
    margin-left: 16px;
    position: relative;
  }

  :global(.icon-rZUgpY) {
    --fill: var(--casper);
    --fill-hover: var(--green);
    --bg: var(--white);
    padding: 10px 4px;
  }

  .opened {
    flex: 1 0 340px;
    max-width: 340px;
    padding: 20px 16px;
    border-left: 1px solid var(--porcelain);
  }

  .body-3 {
    color: var(--waterloo);
    font-weight: 400;
  }

  .merge {
    padding: 5px 12px;
    --color-hover: var(--green);
  }

  .metrics {
    overflow: auto;
  }

  .toggle {
    position: absolute;
    top: 15px;
    left: -21px;
    width: 21px;
    border: 1px solid var(--porcelain);
    border-right: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .opened .toggle {
    left: -13px;
    width: 13px;
  }

  .merging {
    border-color: var(--red);
    --color: var(--red);
    --color-hover: var(--red-hover);
  }

  .confirm {
    border-color: var(--green);
    --color: var(--green);
    --color-hover: var(--green-hover);
  }

  .unmerge {
    color: var(--red);
  }
  .unmerge:hover {
    color: var(--red-hover);
    text-decoration: underline;
  }
</style>
