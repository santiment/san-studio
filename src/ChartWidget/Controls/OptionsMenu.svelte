<script lang="ts">
  import { withScroll, getHistoryContext } from 'webkit/ui/history'
  import Svg from 'webkit/ui/Svg/svelte'
  import Toggle from 'webkit/ui/Toggle.svelte'
  import { globals } from '@/stores/globals'
  import { download, downloadPng, downloadCsv } from './download'

  const History = getHistoryContext()

  export let isSingleWidget: boolean
  export let deleteWidget
  export let widget

  $: ({ ChartOptions } = widget)
  $: ({ isPro, isProPlus } = $globals)
  $: ChartOptions.getProDefaults(isPro, isProPlus)

  function onDelete() {
    deleteWidget(true)
  }

  function onDownload(downloader) {
    download(widget, downloader)
  }

  function newHistoryToggle(name, toggle) {
    const command = withScroll(widget, toggle)
    return () => {
      command()
      History.add(name, command)
    }
  }
</script>

<div class="menu">
  <div class="btn" on:click={newHistoryToggle('Toggle "Log scale"', ChartOptions.toggleScale)}>
    Log scale <Toggle isActive={$ChartOptions.isLogScale} />
  </div>
  <div
    class="btn"
    on:click={newHistoryToggle('Toggle "Cartesian grid"', () =>
      ChartOptions.toggle('cartesianGrid'),
    )}>
    Cartesian grid <Toggle isActive={$ChartOptions.cartesianGrid} />
  </div>
  <div
    class="btn"
    on:click={newHistoryToggle('Toggle "Presenter mode"', () => globals.toggle('isPresenterMode'))}>
    Presenter mode <Toggle isActive={$globals.isPresenterMode} />
  </div>
  <div
    class="btn"
    class:disabled={!isPro}
    on:click={() => isPro && ChartOptions.toggle('isWatermarkLessVisible')}>
    Make watermark less visible
    {#if isPro}
      <Toggle isActive={$ChartOptions.isWatermarkLessVisible} class="mrg-xl mrg--l" />
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

  <div class="btn" class:disabled={!isPro} on:click={() => isPro && onDownload(downloadCsv)}>
    <span>
      <Svg id="download" w="16" class="mrg-s mrg--r" />
      Download as CSV
    </span>
    {#if !isPro}
      <a href="/pricing" class="label">PRO</a>
    {/if}
  </div>
  <div class="btn" on:click={() => onDownload(downloadPng)}>
    <span>
      <Svg id="download" w="16" class="mrg-s mrg--r" />
      Download as PNG
    </span>
  </div>

  {#if !isSingleWidget}
    <div class="btn delete" on:click={onDelete}>
      <span>
        <Svg id="delete" w="12" class="mrg-s mrg--r" />
        Delete chart
      </span>
    </div>
  {/if}
</div>

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
    color: inherit;
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
