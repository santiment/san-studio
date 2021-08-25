<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import EmbedDialog from './Dialog.svelte'

  export const showEmbedDialog = (props): Promise<unknown> =>
    dialogs.show(EmbedDialog, props)
</script>

<script lang="ts">
  import Dialog from 'webkit/ui/Dialog'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Code from './Code.svelte'
  import SelectChart from './SelectChart.svelte'
  import { globals } from '@/stores/globals'

  export let widgets

  let width = '100%'
  let height = '300'
  let isNightMode = $globals.isNightMode
  let isWithMetricSettings = false
  let isCartesianGrid = true

  $: ({ isPro } = $globals)
</script>

<Dialog {...$$props} title="Embed charts">
  <div class="dialog-body">
    <SelectChart bind:charts={widgets} />

    <div class="row mrg-l mrg--b">
      <div class="column">
        <div class="caption txt-m">Width</div>
        <input class="border body-3" type="text" bind:value={width} />
      </div>
      <div class="column mrg-l mrg--l">
        <div class="caption txt-m">Height</div>
        <input class="border body-3" type="text" bind:value={height} />
      </div>
    </div>

    <div
      class="row btn mrg-m mrg--b justify"
      class:disabled={!isPro}
      on:click={() => (isNightMode = !isNightMode)}>
      Night mode
      {#if isPro}
        <Toggle isActive={isNightMode} />
      {:else}
        <a href="/pricing" class="label">PRO</a>
      {/if}
    </div>

    <div
      class="row btn mrg-m mrg--b justify"
      class:disabled={!isPro}
      on:click={() => (isCartesianGrid = !isCartesianGrid)}>
      Cartesian grid
      {#if isPro}
        <Toggle isActive={isCartesianGrid} />
      {:else}
        <a href="/pricing" class="label">PRO</a>
      {/if}
    </div>

    <div
      class="row btn mrg-l mrg--b justify"
      class:disabled={!isPro}
      on:click={() => (isWithMetricSettings = !isWithMetricSettings)}>
      Show metric's settings {#if isPro}
        <Toggle isActive={isWithMetricSettings} />
      {:else}
        <a href="/pricing" class="label">PRO</a>
      {/if}
    </div>

    <div class="caption txt-m">Code</div>
    <Code
      {widgets}
      {width}
      {height}
      {isNightMode}
      {isWithMetricSettings}
      {isCartesianGrid} />
  </div>
</Dialog>

<style>
  .caption {
    color: var(--waterloo);
    margin: 0 0 4px;
  }

  input {
    width: 120px;
    padding: 5px 10px;
    color: var(--black);
  }

  .label {
    font-size: 12px;
    color: #fff;
    background: var(--orange);
    padding: 0 7px;
    border-radius: 4px;
    margin-left: 12px;
  }
  .label:hover {
    background: var(--orange-hover);
  }

  .disabled {
    background: none !important;
  }

  a {
    pointer-events: all;
  }
</style>
