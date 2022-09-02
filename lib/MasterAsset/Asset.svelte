<script lang="ts">
  import { millify } from 'san-webkit/lib/utils/formatting'
  import Svg from 'san-webkit/lib/ui/Svg/svelte'
  import ProjectIcon from 'san-webkit/lib/ui/ProjectIcon.svelte'
  import { studio } from './../../lib/stores/studio'
  import { queryProject, queryProjectPriceChange } from './../../lib/api/project'
  import { usdFormatter } from './../../lib/metrics/formatters'
  import Selector from './Selector.svelte'
  let price = ''
  let change = 0
  let marketcap = ''
  let projectRank = 0

  $: ({ slug, ticker, name = slug, logoUrl } = $studio)

  $: queryProject(slug).then(setProject)

  $: queryProjectPriceChange(slug).then(setPriceChange)

  $: isUpChange = change >= 0

  function setProject(project) {
    studio.setProject(project)
  }

  function setPriceChange({ priceUsd, percentChange24h, marketcapUsd, rank }) {
    price = usdFormatter(priceUsd)
    marketcap = millify(marketcapUsd)
    change = +(+percentChange24h).toFixed(2)
    projectRank = rank
  }
</script>

<svelte:head>
  <title>{ticker} {price} {isUpChange ? '▲ +' : '▼ '}{change}%</title>
</svelte:head>

<Selector>
  <ProjectIcon {slug} {logoUrl} size={32} class="mrg-s mrg--r" />
  {name} ({ticker})
</Selector>

<div class="row v-center mrg-xxl mrg--l mrg--r">
  <span class="c-waterloo">Price</span>
  <span class="body-1 mrg-s mrg--l mrg--r">{price}</span>

  <div class="change txt-m row v-center expl-tooltip" class:up={isUpChange} aria-label="24h change">
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

<style>
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
