<script lang="ts">
  import { onDestroy } from 'svelte'
  import { copy } from 'webkit/utils'
  import { withScroll, getHistoryContext } from 'webkit/ui/history'
  import Svg from 'webkit/ui/Svg/svelte'
  import Tooltip from 'webkit/ui/Tooltip/svelte'
  import { favoriteMetrics } from '@/stores/favoriteMetrics'
  import { globals } from '@/stores/globals'
  import { studio } from '@/stores/studio'
  import { selectedItems } from '@/stores/selector'
  import { getWidget } from '@/ChartWidget/context'
  import { getAdapterController } from '@/adapter/context'

  const History = getHistoryContext()
  const widget = getWidget()
  const newHistory = (name, undo, redo) =>
    History.add(name, withScroll(widget, undo), withScroll(widget, redo))
  const { Metrics, MetricsSignals } = widget
  const { onAnonFavoriteClick = () => {} } = getAdapterController()

  export let metric: Studio.Metric
  export let address: undefined | string
  export let isMenuOpened, isSettingsOpened, isLocked
  export let onLockClick, onSettings

  $: isFavorited = $favoriteMetrics.has(metric.key)

  function onFavoriteClick() {
    if (!$globals.isLoggedIn) return onAnonFavoriteClick()

    const { key } = metric
    favoriteMetrics.toggle(key)
    History.add('Toggle favorite', () => favoriteMetrics.toggle(key))
  }

  function onHideSignal() {
    const redo = () => MetricsSignals.delete(metric)
    redo()
    newHistory('Hide signals', () => MetricsSignals.add(metric), redo)
  }

  let copyLabel = 'Copy address'
  let clearTimeout
  function onAddressCopy() {
    clearTimeout?.()
    copyLabel = 'Copied!'
    clearTimeout = copy(address || $studio.address, () => (copyLabel = 'Copy address'))
  }

  onDestroy(() => {
    clearTimeout?.()
  })
</script>

<Tooltip
  bind:isOpened={isMenuOpened}
  on="click"
  duration={0}
  align="center"
  activeClass="$style.active"
>
  <div slot="trigger" class="btn MetricButton__btn mrg-s mrg--l">
    <Svg id="vert-dots" w="2" h="12" />
  </div>

  <div slot="tooltip" class="menu">
    {#if !metric.noProject}
      <div
        class="btn-ghost option"
        class:disabled={Metrics.hasConvertedMetric(metric, $studio)}
        on:click={onLockClick}
      >
        <Svg id={isLocked ? 'locked' : 'unlocked'} w="14" h="15" class="mrg-s mrg--r" />
        {#if isLocked}
          Unlock metric
        {:else}
          Lock metric to {$studio.ticker}
        {/if}
      </div>
    {/if}

    {#if !metric.base}
      <div class="btn-ghost option" class:favorited={isFavorited} on:click={onFavoriteClick}>
        <Svg id="star{isFavorited ? '-filled' : ''}" w="16" class="mrg-s mrg--r" />
        {isFavorited ? 'Unfavorite' : 'Make favorite'}
      </div>
    {/if}

    {#if $MetricsSignals.includes(metric)}
      <div class="btn-ghost option" on:click={onHideSignal}>
        <Svg id="flash" w="12" h="16" class="mrg-s mrg--r $style.flash" />
        Hide signals
      </div>
    {/if}

    <div class="btn-ghost option" on:click={() => selectedItems.toggle(metric)}>
      <Svg id="plus-circle" w="16" class="mrg-s mrg--r" />
      Reapply metric
    </div>

    {#if address || $studio.address}
      <div class="btn-ghost option" on:click={onAddressCopy}>
        <Svg id="copy" w="16" class="mrg-s mrg--r" />
        {copyLabel}
      </div>
    {/if}

    <div
      class="btn-ghost option"
      class:disabled={isSettingsOpened}
      on:click={() => onSettings(metric)}
    >
      <Svg id="cog" w="16" class="mrg-s mrg--r" />
      Settings
    </div>
  </div>
</Tooltip>

<style>
  .menu {
    padding: 8px;
    white-space: nowrap;
  }

  .option {
    --fill: var(--waterloo);
    display: flex;
    align-items: center;
  }

  .favorited {
    fill: var(--orange);
  }
  .favorited:hover {
    fill: var(--orange-hover);
  }

  .active {
    --bg: var(--m-color);
    --fill: var(--color) !important;
  }

  .disabled {
    background: var(--white);
    fill: var(--mystic);
  }

  .flash {
    fill: var(--red);
    padding: 0 2px;
  }
</style>
