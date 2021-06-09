<script lang="ts">
  import Svg from 'webkit/ui/Icon.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import { favoriteMetrics } from '@/stores/favoriteMetrics'
  import { globals } from '@/stores/globals'
  import { studio } from '@/stores/studio'
  import { getWidget } from '@/ChartWidget/context'
  import { getAdapterController } from '@/adapter/context'
  const { Metrics, MetricsSignals } = getWidget()
  const { onAnonFavoriteClick = () => {} } = getAdapterController()

  export let metric: Studio.Metric
  export let isMenuOpened, isSettingsOpened, isLocked
  export let onLockClick, onSettings

  $: isFavorited = $favoriteMetrics.has(metric.key)
</script>

<Tooltip
  bind:isOpened={isMenuOpened}
  on="click"
  duration={0}
  align="center"
  activeClass="$style.active">
  <div slot="trigger" class="btn MetricButton__btn mrg-s mrg--l">
    <Svg id="vert-dots" w="2" h="12" />
  </div>

  <div slot="tooltip" class="menu">
    {#if !metric.noProject}
      <div
        class="btn btn--ghost option"
        class:disabled={Metrics.hasConvertedMetric(metric, $studio)}
        on:click={onLockClick}>
        <Svg
          id={isLocked ? 'locked' : 'unlocked'}
          w="14"
          h="15"
          class="mrg-s mrg--r" />
        {#if isLocked}
          Unlock metric
        {:else}
          Lock metric to {$studio.ticker}
        {/if}
      </div>
    {/if}

    {#if !metric.base}
      <div
        class="btn btn--ghost option"
        class:favorited={isFavorited}
        on:click={() =>
          $globals.isLoggedIn
            ? favoriteMetrics.toggle(metric.key)
            : onAnonFavoriteClick()}>
        <Svg
          id="star{isFavorited ? '-filled' : ''}"
          w="16"
          class="mrg-s mrg--r" />
        {isFavorited ? 'Unfavorite' : 'Make favorite'}
      </div>
    {/if}

    {#if $MetricsSignals.includes(metric)}
      <div
        class="btn btn--ghost option"
        on:click={() => MetricsSignals.delete(metric)}>
        <Svg id="flash" w="12" h="16" class="mrg-s mrg--r $style.flash" />
        Hide signals
      </div>
    {/if}

    <div
      class="btn btn--ghost option"
      class:disabled={isSettingsOpened}
      on:click={() => onSettings(metric)}>
      <Svg id="cog" w="16" h="16" class="mrg-s mrg--r" />
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
    --bg: var(--green-light-1);
    --fill: var(--green);
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
