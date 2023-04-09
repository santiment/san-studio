<script>import { fly } from 'svelte/transition';
import Svg from 'san-webkit/lib/ui/Svg/svelte';
import { selectedItems } from './../stores/selector';
import MetricButton from './../MetricButton.svelte';
import { showCombineDialog } from './../CombineDialog/index.svelte';

const noExpressionMetricsFilter = ({
  expression
}) => !expression;

const expressionMetricsFilter = ({
  expression
}) => expression;

$: ({
  metrics,
  subwidgets,
  chartAddons
} = $selectedItems);

$: items = metrics.concat(subwidgets).concat(chartAddons);

$: baseMetrics = metrics.filter(noExpressionMetricsFilter);

function onCombineClick() {
  const expressionMetrics = metrics.filter(expressionMetricsFilter);
  showCombineDialog({
    metrics: baseMetrics
  }).then(metric => {
    if (!metric) return;
    selectedItems.set(expressionMetrics.concat(metric));
  });
}</script>

<div class="stack row v-center" transition:fly={{ duration: 250, x: -100 }}>
  {#if items.length}
    <div class="info row v-center">
      Selected item(s): <span class="mrg-xs mrg--l">{items.length}</span>

      <div class="btn border mrg-l mrg--r combine" on:click={onCombineClick}>Combine</div>

      <Svg id="cross" w="10" class="delete-jDlFnf" on:click={selectedItems.clear} />

      <div class="items">
        <div class="metrics row mrg-l mrg--b">
          {#each items as metric (metric.key)}
            <MetricButton {metric} onDelete={selectedItems.toggle} class="btn-uDS32x" />
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
    left: 32px;
    z-index: 99;
    user-select: none;
    min-height: 40px;
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

  :global(.btn-uDS32x) {
    white-space: nowrap;
    color: var(--black);
  }

  span {
    display: inline-block;
    width: 3ch;
  }

  :global(.delete-jDlFnf) {
    fill: #fff;
    position: relative;
    z-index: 2;
  }
  :global(.delete-jDlFnf:hover) {
    fill: var(--red);
  }

  .combine {
    position: relative;
    z-index: 10;
    padding: 1px 6px;
  }

  .combine:hover {
    border-color: var(--green);
    color: var(--green);
  }
</style>
