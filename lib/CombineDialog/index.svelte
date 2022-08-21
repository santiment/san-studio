<script context="module" lang="ts">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import FullscreenDialog from './index.svelte';
export const showCombineDialog = props => dialogs.show(FullscreenDialog, props);</script>

<script lang="ts">import { track } from 'san-webkit/lib/analytics';
import Dialog from 'san-webkit/lib/ui/Dialog';
import { DialogLock } from 'san-webkit/lib/ui/Dialog/dialogs';
import { Event } from './../../lib/analytics';
import { convertBaseProjectMetric } from './../../lib/ChartWidget/Metrics/utils';
import Chart from './Chart.svelte';
import Metric from './Metric.svelte';
import { importMath, newExpessionMetric, checkIsExpressionValid } from './utils';
import Sidebar from './Sidebar.svelte'; // TODO: Show dialog on load [@vanguard | Aug 18, 2021]

importMath();
export let DialogPromise;
export let metric;
export let metrics = metric && metric.baseMetrics.slice();
let label = metric ? metric.label : '';
let expression = metric ? metric.expression : 'x1 + x2';
let isValidExpression = true;
let isLabelInputDirty = false;
let isExpressionDirty = false;
let closeDialog;

$: checkExpression(metrics, expression);

$: expressionMetric = metrics.length ? newExpessionMetric(metrics, expression, label) : undefined;

$: isValid = isValidExpression && label;

$: colors = expressionMetric && {
  [expressionMetric.key]: '#14c393'
};

$: chartMetrics = expressionMetric ? [expressionMetric] : [];

$: if (isLabelInputDirty || isExpressionDirty) {
  DialogPromise.locking = DialogLock.WARN;
}

let checkExpressionTimer;

function checkExpression(metrics, expression) {
  clearTimeout(checkExpressionTimer);
  checkExpressionTimer = setTimeout(() => {
    isValidExpression = checkIsExpressionValid(metrics, expression);
  }, 150);
}

function onCombineClick() {
  DialogPromise.resolve(expressionMetric);
  closeDialog();
  track.event(Event.CombineMetrics, {
    metrics: metrics.map(({
      key
    }) => key)
  });
}

function onMetricDelete(i) {
  metrics.splice(i, 1);
  metrics = metrics.slice();
}

function onMetricSelect(metric) {
  metrics = metrics.concat(metric);
}

function onMetricLock(metric, i, project) {
  metrics[i] = convertBaseProjectMetric(metric, Object.assign({}, project));
}

track.event(Event.CombineOpened);</script>

<Dialog
  {...$$props}
  bind:closeDialog
  title={metric ? 'Edit combined metric' : 'Combine metrics'}
  class="dialog-tG9zvz"
>
  <div class="dialog-content row">
    <Sidebar {metrics} {onMetricSelect} />

    <div class="dialog-body">
      <div class="caption">Metrics</div>
      <div class="row metrics">
        {#each metrics as metric, i}
          <Metric {i} {metric} onLock={onMetricLock} onDelete={onMetricDelete} />
        {:else}
          <div class="mrg-s mrg--l mrg--b c-waterloo">
            Select at least two metrics from left side-bar for combine...
          </div>
        {/each}
      </div>

      <div class="caption mrg-l mrg--t">Name</div>
      <input
        class="border fluid"
        type="text"
        bind:value={label}
        placeholder="Combined metric"
        on:blur={() => (isLabelInputDirty = true)}
        class:invalid={isLabelInputDirty && !label.trim()}
      />

      <div class="caption mrg-l mrg--t">Expression</div>
      <input
        class="border fluid"
        type="text"
        bind:value={expression}
        on:blur={() => (isExpressionDirty = true)}
        class:invalid={!isValidExpression}
      />

      <div class="caption mrg-l mrg--t">Preview</div>
      <div class="border">
        <Chart metrics={chartMetrics} {colors} />
      </div>

      <div class="row mrg-l mrg--t v-center">
        <div class="btn-1 mrg-a mrg--l" class:disabled={!isValid} on:click={onCombineClick}>
          {metric ? 'Save' : 'Combine'}
        </div>
        <div class="btn-2 border mrg-l mrg--l cancel" on:click={closeDialog}>Cancel</div>
      </div>
    </div>
  </div>
</Dialog>

<style>
  :global(.dialog-tG9zvz) {
    width: 900px;
    position: relative;
  }

  :global(.dialog-content) {
    overflow: auto;
  }

  :global(.dialog-body) {
    flex: 1;
  }

  input {
    padding: 5px 8px;
    height: 32px;
    color: var(--black);
  }

  .caption {
    color: var(--waterloo);
    margin-bottom: 4px;
  }

  .metrics {
    flex-wrap: wrap;
    margin-left: -8px;
    margin-bottom: -8px;
  }

  .invalid {
    border-color: var(--red) !important;
  }

  .disabled {
    --color: var(--mystic);
    --bg: var(--athens);
  }

  .cancel {
    --color-hover: var(--green);
  }
</style>
