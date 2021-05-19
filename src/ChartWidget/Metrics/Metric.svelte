<script lang="ts">
  import { onDestroy } from 'svelte'
  import Icon from 'webkit/ui/Icon.svelte'
  import Tooltip from 'webkit/ui/Tooltip.svelte'
  import MetricButton from '@/MetricButton.svelte'
  import { getWidget } from '@/ChartWidget/context'
  import { studio } from '@/stores/studio'
  import { favoriteMetrics } from '@/stores/favoriteMetrics'
  import { globals } from '@/stores/globals'
  import { convertBaseProjectMetric } from './utilts'
  const { Metrics } = getWidget()

  export let metric: Studio.Metric
  export let colors
  export let error
  export let index: number
  export let onHover, onClick, onDelete, onLock, onSettings

  let timer: number
  let isHovered = false
  let isMenuOpened = false

  $: isLocked = !!metric.project
  $: isFavorited = $favoriteMetrics.has(metric.key)

  const clear = () => clearTimeout(timer)
  function onMouseEnter() {
    clear()
    timer = window.setTimeout(() => {
      isHovered = true
      onHover(metric)
    }, 120)
  }
  function onMouseLeave() {
    clear()
    if (isHovered) {
      isHovered = false
      onHover()
    }
  }

  function onLockClick() {
    if (Metrics.hasConvertedMetric(metric, $studio)) return
    onLock(convertBaseProjectMetric(metric, $studio), index)
  }

  onDestroy(onMouseLeave)
</script>

<MetricButton
  {metric}
  {colors}
  {error}
  {onDelete}
  ticker={$studio.ticker}
  active={isMenuOpened}
  on:click={(e) => onClick(metric, e)}
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}>
  {#if isLocked}
    <div class="locked row hv-center"><Icon id="locked-small" w="8" /></div>
  {:else if !metric.indicator}
    ({$studio.ticker})
  {/if}

  <Tooltip
    bind:isOpened={isMenuOpened}
    on="click"
    duration={0}
    align="center"
    activeClass="$style.active">
    <div slot="trigger" class="btn MetricButton__btn mrg-s mrg--l">
      <Icon id="vert-dots" w="2" h="12" />
    </div>
    <div slot="tooltip" class="menu">
      <div
        class="btn btn--ghost option"
        class:disabled={Metrics.hasConvertedMetric(metric, $studio)}
        on:click={onLockClick}>
        <Icon
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

      {#if $globals.isLoggedIn && !metric.base}
        <div
          class="btn btn--ghost option"
          class:favorited={isFavorited}
          on:click={() => favoriteMetrics.toggle(metric.key)}>
          <Icon
            id="star{isFavorited ? '-filled' : ''}"
            w="16"
            h="16"
            class="mrg-s mrg--r" />
          {isFavorited ? 'Unfavorite' : 'Make favorite'}
        </div>
      {/if}

      <div class="btn btn--ghost option" on:click={() => onSettings(metric)}>
        <Icon id="cog" w="16" h="16" class="mrg-s mrg--r" />
        Settings
      </div>
    </div>
  </Tooltip>
</MetricButton>

<style>
  .menu {
    padding: 8px;
    white-space: nowrap;
  }

  .active {
    --bg: var(--green-light-1);
    --fill: var(--green);
  }

  .option {
    --fill: var(--waterloo);
    display: flex;
    align-items: center;
  }

  .locked {
    position: absolute;
    top: -5px;
    left: -5px;
    background: #505573;
    border-radius: 50%;
    fill: #fff;
    width: 16px;
    height: 16px;
  }

  .favorited {
    fill: var(--orange);
  }
  .favorited:hover {
    fill: var(--orange-hover);
  }

  .disabled {
    background: var(--white);
    fill: var(--mystic);
  }
</style>
