<script lang="ts">
  import { tick } from 'svelte'
  import { track } from 'webkit/analytics'
  import Icon from 'webkit/ui/Icon.svelte'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { Event } from '@/analytics'
  import { globals } from '@/stores/globals'
  import { studio } from '@/stores/studio'
  import { getWidget } from '@/ChartWidget/context'
  import { downloadPng } from './downloadPng'
  import { downloadCsv } from './downloadCsv'
  const widget = getWidget()
  const { ChartOptions } = widget

  export let activeClass = ''
  export let isSingleWidget: boolean
  export let deleteWidget

  let isOpened = false

  $: ({ isPro, isProPlus } = $globals)
  $: ChartOptions.getProDefaults(isPro, isProPlus)

  function onDelete() {
    isOpened = false
    // NOTE: Widget is not deleted if tooltip is not closed [@vanguard | May 26, 2021]
    tick()
      .then(tick)
      .then(() => deleteWidget(true))
  }

  function onDownload(downloader) {
    // prettier-ignore
    track.event(Event.Download, { type: downloader === downloadPng ? 'png' : 'csv'})
    downloader(widget, $studio)
  }
</script>

<Tooltip on="click" duration={0} align="end" {activeClass} bind:isOpened>
  <slot slot="trigger" />
  <div slot="tooltip" class="menu">
    <div class="btn" on:click={ChartOptions.toggleScale}>
      Log scale <Toggle isActive={$ChartOptions.isLogScale} />
    </div>
    <div class="btn" on:click={() => ChartOptions.toggle('cartesianGrid')}>
      Cartesian grid <Toggle isActive={$ChartOptions.cartesianGrid} />
    </div>
    <div class="btn" on:click={() => globals.toggle('isPresenterMode')}>
      Presenter mode <Toggle isActive={$globals.isPresenterMode} />
    </div>
    <div
      class="btn"
      class:disabled={!isPro}
      on:click={() => isPro && ChartOptions.toggle('isWatermarkLessVisible')}>
      Make watermark less visible
      {#if isPro}
        <Toggle
          isActive={$ChartOptions.isWatermarkLessVisible}
          class="mrg-xl mrg--l" />
      {:else}
        <a href="/pricing" class="label">PRO</a>
      {/if}
    </div>

    <div
      class="btn"
      on:click={() => isProPlus && ChartOptions.toggle('watermark')}
      class:disabled={!isProPlus}>
      Hide watermark
      {#if isProPlus}
        <Toggle isActive={!$ChartOptions.watermark} class="mrg-xl mrg--l" />
      {:else}
        <a href="/pricing" class="label plus">PRO+</a>
      {/if}
    </div>

    <div class="divider" />

    <div
      class="btn"
      class:disabled={!isPro}
      on:click={() => isPro && onDownload(downloadCsv)}>
      <span>
        <Icon id="download" w="16" class="mrg-s mrg--r" />
        Download as CSV
      </span>
      {#if !isPro}
        <a href="/pricing" class="label">PRO</a>
      {/if}
    </div>
    <div class="btn" on:click={() => onDownload(downloadPng)}>
      <span>
        <Icon id="download" w="16" class="mrg-s mrg--r" />
        Download as PNG
      </span>
    </div>

    {#if !isSingleWidget}
      <div class="btn delete" on:click={onDelete}>
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
