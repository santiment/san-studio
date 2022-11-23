<script lang="ts">import { HOLDER_DISTRIBUTION_BALANCE_ABSOLUTE_METRICS, HOLDER_DISTRIBUTION_BALANCE_PERCENT_METRICS } from './../../lib/metrics/_onchain/holderDistributions';
import HolderDistributionWidget from './index.svelte';
export let widget;
export let isSingleWidget;
export let deleteWidget;
const defaultMetrics = HOLDER_DISTRIBUTION_BALANCE_PERCENT_METRICS.slice();
let isPercentsMetrics = true;
let isMerging = false;

$: metrics = isPercentsMetrics ? HOLDER_DISTRIBUTION_BALANCE_PERCENT_METRICS : HOLDER_DISTRIBUTION_BALANCE_ABSOLUTE_METRICS;</script>

<HolderDistributionWidget
  {widget}
  {metrics}
  {isSingleWidget}
  {deleteWidget}
  {defaultMetrics}
  bind:isMerging
>
  <slot>by balance of addresses</slot>

  <div slot="tabs" class="tabs row txt-m mrg-l mrg--b" class:disabled={isMerging}>
    <div
      class="tab btn"
      class:active={isPercentsMetrics}
      on:click={() => isMerging || (isPercentsMetrics = true)}
    >
      Percents
    </div>
    <div
      class="tab btn"
      class:active={!isPercentsMetrics}
      on:click={() => isMerging || (isPercentsMetrics = false)}
    >
      Absolute
    </div>
  </div>
</HolderDistributionWidget>

<style>
  .tabs {
    color: var(--casper);
  }

  .tab {
    padding: 0 0 8px;
    flex: 1;
    text-align: center;
    border-bottom: 2px solid var(--porcelain);
    border-radius: 0;
    --color-hover: var(--green);
  }
  .active {
    --color: var(--black);
    border-color: var(--green);
    font-weight: 600;
  }

  .disabled .active {
    border-color: var(--mystic);
  }
</style>
