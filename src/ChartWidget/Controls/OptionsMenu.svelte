<script lang="ts">
  import Icon from 'webkit/ui/Icon.svelte'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { globals } from '@/stores/globals'
  import { studio } from '@/stores/studio'
  import { getWidget } from '@/ChartWidget/context'
  import { downloadPng } from './download'
  import { getChartOptions } from './context'
  const chartOptions = getChartOptions()
  const widget = getWidget()

  export let activeClass = ''
  export let isSingleWidget: boolean
  export let deleteWidget

  const forceDelete = () => deleteWidget(true)

  $: ({ isPro, isProPlus } = $globals)
</script>

<Tooltip on="click" duration={0} align="end" {activeClass}>
  <slot slot="trigger" />
  <div slot="tooltip" class="menu">
    <div class="btn" on:click={chartOptions.toggleScale}>
      Log scale <Toggle isActive={$chartOptions.isLogScale} />
    </div>
    <div class="btn" on:click={() => chartOptions.toggle('cartesianGrid')}>
      Cartesian grid <Toggle isActive={$chartOptions.cartesianGrid} />
    </div>
    <div
      class="btn"
      class:disabled={!isPro}
      on:click={() => isPro && chartOptions.toggle('isWatermarkLessVisible')}>
      Make watermark less visible
      {#if isPro}
        <Toggle
          isActive={$chartOptions.isWatermarkLessVisible}
          class="mrg-xl mrg--l" />
      {:else}
        <a href="/pricing" class="label">PRO</a>
      {/if}
    </div>

    <div
      class="btn"
      on:click={() => isProPlus && chartOptions.toggle('watermark')}
      class:disabled={!isProPlus}>
      Hide watermark
      {#if isProPlus}
        <Toggle isActive={!$chartOptions.watermark} class="mrg-xl mrg--l" />
      {:else}
        <a href="/pricing" class="label plus">PRO+</a>
      {/if}
    </div>

    <div class="divider" />

    <div class="btn" class:disabled={!isPro}>
      <span>
        <Icon id="download" w="16" class="mrg-s mrg--r" />
        Download as CSV
      </span>
      {#if !isPro}
        <a href="/pricing" class="label">PRO</a>
      {/if}
    </div>
    <div class="btn" on:click={() => downloadPng(widget, $studio)}>
      <span>
        <Icon id="download" w="16" class="mrg-s mrg--r" />
        Download as PNG
      </span>
    </div>

    {#if !isSingleWidget}
      <div class="btn delete" on:click={forceDelete}>
        <span>
          <Icon id="delete" w="12" class="mrg-s mrg--r" />
          Delete chart
        </span>
      </div>
    {/if}
  </div>
</Tooltip>

<style>
  .menu {
    padding: 8px;
    white-space: nowrap;
  }

  .btn {
    --color: var(--black);
    --fill: var(--waterloo);
    --color-hover: var(--green);
    --bg-hover: var(--athens);
    padding: 6px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .delete {
    --color: var(--red);
    --fill: var(--red);
    --color-hover: var(--red-hover);
    --fill-hover: var(--red-hover);
  }

  .divider {
    margin: 8px -9px;
    border-top: 1px solid var(--porcelain);
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
  .plus {
    background: var(--yellow);
  }
  .plus:hover {
    background: var(--yellow-hover);
  }

  span {
    display: flex;
    align-items: center;
  }

  .disabled {
    background: none !important;
    fill: var(--mystic) !important;
    color: var(--mystic) !important;
  }

  a {
    pointer-events: all;
  }
</style>
