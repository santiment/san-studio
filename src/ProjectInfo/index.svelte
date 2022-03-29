<script lang="ts">
  import type { ProjectPriceChange } from '@/api/project'
  import { onDestroy, onMount } from 'svelte'
  import { newGlobalShortcut } from 'webkit/utils/events'
  import { millify } from 'webkit/utils/formatting'
  import Svg from 'webkit/ui/Svg/svelte'
  import ProjectIcon from 'webkit/ui/ProjectIcon.svelte'
  import { studio } from '@/stores/studio'
  import { queryProject, queryAllProjects, queryProjectPriceChange } from '@/api/project'
  import { usdFormatter } from '@/metrics/formatters'
  import { showMasterSelectorDialog } from '@/MasterSelectorDialog/index.svelte'
  import { preloadSuggestions } from '@/MasterSelectorDialog/Suggestions.svelte'

  let price = ''
  let change = 0
  let marketcap = ''
  let projectRank = 0

  $: ({ slug, ticker, name = slug } = $studio)
  $: queryProject(slug).then(setProject)
  $: queryProjectPriceChange(slug).then(setPriceChange)
  $: isUpChange = change >= 0

  function setProject(project: any) {
    studio.setProject(project)
  }
  function setPriceChange({ priceUsd, percentChange24h, marketcapUsd, rank }: ProjectPriceChange) {
    price = usdFormatter(priceUsd)
    marketcap = millify(marketcapUsd)
    change = +(+percentChange24h).toFixed(2)
    projectRank = rank
  }

  const unsubSelectorShortcut = newGlobalShortcut('CMD+K', showMasterSelectorDialog)
  let timer
  onMount(() => {
    timer = setTimeout(queryAllProjects, 300)
  })

  onDestroy(() => {
    unsubSelectorShortcut()
    clearTimeout(timer)
  })
</script>

<svelte:head>
  <title>{ticker} {price} {isUpChange ? '▲ +' : '▼ '}{change}%</title>
</svelte:head>

<div class="row v-center">
  <div
    class="project body-1 btn row v-center"
    on:click={showMasterSelectorDialog}
    use:preloadSuggestions>
    <ProjectIcon {slug} size={32} class="mrg-s mrg--r" />

    {name} ({ticker})
    <Svg id="arrow" w="8" h="5" class="mrg-s mrg--l $style.arrow" />
  </div>

  <div class="row v-center mrg-xxl mrg--l mrg--r">
    <span class="c-waterloo">Price</span>
    <span class="body-1 mrg-s mrg--l mrg--r">{price}</span>

    <div
      class="change txt-m row v-center expl-tooltip"
      class:up={isUpChange}
      aria-label="24h change">
      <span class="direction row hv-center mrg-xs mrg--r">
        <Svg id="triangle" w="6" h="4" />
      </span>
      {change}%
    </div>
  </div>

  <div class="row v-center">
    <span class="c-waterloo">Market cap</span>
    <span class="body-1 mrg-s mrg--l">${marketcap}</span>
  </div>

  <div class="rank mrg-xxl mrg--l">Rank #{projectRank}</div>

  <div class="project-actions mrg-a mrg--l row v-center" />
</div>

<style>
  .project {
    --fill: var(--waterloo);
    --color-hover: var(--green);
  }

  .change {
    position: relative;
    color: var(--red);
    --color: var(--red);
    --bg: var(--red-light-1);
  }
  .up {
    color: #26c953;
    --color: #26c953;
    --bg: #d6f6d6;
  }
  .change::before {
    z-index: 999;
  }

  .arrow {
    transform: rotate(180deg);
  }

  .direction {
    border-radius: 50%;
    width: 12px;
    height: 12px;
    fill: var(--color);
    background: var(--bg);
  }

  .rank {
    background: var(--athens);
    padding: 6px 12px;
    border-radius: 4px;
  }
</style>
