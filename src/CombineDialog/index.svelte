<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import FullscreenDialog from './index.svelte'

  export const showCombineDialog = (props): Promise<unknown> =>
    dialogs.show(FullscreenDialog, props)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import Chart from './Chart.svelte'
  import { newExpessionMetric } from './utils'

  export let metrics
  let expression = 'x1 + x2'

  $: metric = newExpessionMetric(metrics, expression)

  let closeDialog
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
    <input class="border fluid" type="text" value="Custom metric" />

    <div class="caption mrg-l mrg--t">Expression</div>
    <input class="border fluid" type="text" bind:value={expression} />

    <div class="caption mrg-l mrg--t">Preview</div>
    <div class="border">
      <Chart metrics={[metric]} />
    </div>

    <div class="row mrg-l mrg--t v-center">
      <div class="btn btn-1 btn--green mrg-a mrg--l">Combine</div>
      <div class="btn btn-1 border mrg-l mrg--l" on:click={closeDialog}>
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
</style>
