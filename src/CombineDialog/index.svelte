<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import FullscreenDialog from './index.svelte'

  export const showCombineDialog = (props): Promise<unknown> =>
    dialogs.show(FullscreenDialog, props)
</script>

<script lang="ts">
  import type { DialogController } from 'webkit/ui/Dialog/dialogs'
  import Dialog from 'webkit/ui/Dialog'
  import { DialogLock } from 'webkit/ui/Dialog/dialogs'
  import Chart from './Chart.svelte'
  import { newExpessionMetric, checkIsExpressionValid } from './utils'

  export let DialogPromise: DialogController
  export let metrics

  let label = ''
  let expression = 'x1 + x2'
  let isValidExpression = true
  let isLabelInputDirty = false
  let isExpressionDirty = false
  let closeDialog

  $: checkExpression(metrics, expression)
  $: metric = newExpessionMetric(metrics, expression, label)
  $: isValid = isValidExpression && label
  $: colors = { [metric.key]: '#14c393' }
  $: if (isLabelInputDirty || isExpressionDirty) {
    DialogPromise.locking = DialogLock.WARN
  }

  let checkExpressionTimer
  function checkExpression(metrics, expression) {
    clearTimeout(checkExpressionTimer)
    checkExpressionTimer = setTimeout(() => {
      isValidExpression = checkIsExpressionValid(metrics, expression)
    }, 150)
  }

  function onCombineClick() {
    DialogPromise.resolve(metric)
    closeDialog()
  }
</script>

<Dialog
  {...$$props}
  bind:closeDialog
  title="Combine metrics"
  class="$style.dialog">
  <div class="dialog-body">
    <div class="caption">Metrics</div>
    <div class="row">
      {#each metrics as metric, i}
        <div class="border metric">
          <span class="var">x{i + 1}</span>
          {metric.label}
        </div>
      {/each}
    </div>

    <div class="caption mrg-l mrg--t">Name</div>
    <input
      class="border fluid"
      type="text"
      bind:value={label}
      placeholder="Combined metric"
      on:focus={() => (isLabelInputDirty = true)}
      class:invalid={isLabelInputDirty && !label.trim()} />

    <div class="caption mrg-l mrg--t">Expression</div>
    <input
      class="border fluid"
      type="text"
      bind:value={expression}
      on:focus={() => (isExpressionDirty = true)}
      class:invalid={!isValidExpression} />

    <div class="caption mrg-l mrg--t">Preview</div>
    <div class="border">
      <Chart metrics={[metric]} {colors} />
    </div>

    <div class="row mrg-l mrg--t v-center">
      <div
        class="btn btn-1 btn--green mrg-a mrg--l"
        class:disabled={!isValid}
        on:click={onCombineClick}>
        Combine
      </div>
      <div class="btn btn-1 border mrg-l mrg--l cancel" on:click={closeDialog}>
        Cancel
      </div>
    </div>
  </div>
</Dialog>

<style>
  .dialog {
    width: 700px;
    position: relative;
  }

  input {
    padding: 5px 8px;
  }

  .caption {
    color: var(--waterloo);
    margin-bottom: 4px;
  }

  .metric {
    padding: 5px;
    margin-right: 8px;
  }

  .var {
    background: var(--green-light-1);
    padding: 2px 5px;
    border-radius: 4px;
    color: var(--green);
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
