<script>import { millify } from 'san-webkit/lib/utils/formatting';
import ProjectIcon from 'san-webkit/lib/ui/ProjectIcon.svelte';
import { studio } from './../stores/studio';
import { queryProject, queryProjectPriceChange } from './../api/project';
import { usdFormatter } from './../metrics/formatters';
import Selector from './Selector.svelte';
import Change from 'san-webkit/lib/ui/Change.svelte';
let price = '';
let change = 0;
let marketcap = '';
let projectRank = 0;
$: ({ slug, ticker, name = slug, logoUrl } = $studio);
$: queryProject(slug).then(setProject);
$: queryProjectPriceChange(slug).then(setPriceChange);
$: isUpChange = change >= 0;
function setProject(project) {
    studio.setProject(project);
}
function setPriceChange({ priceUsd, percentChange24h, marketcapUsd, rank }) {
    price = usdFormatter(priceUsd);
    marketcap = millify(marketcapUsd);
    change = +(+percentChange24h).toFixed(2);
    projectRank = rank;
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

  <div class="change txt-m expl-tooltip" aria-label="24h change">
    <Change {change} />
  </div>
</div>

<div class="row v-center">
  <span class="c-waterloo">Market cap</span>
  <span class="body-1 mrg-s mrg--l">${marketcap}</span>
</div>

<div class="rank mrg-xxl mrg--l">Rank #{projectRank}</div>

<style>
  .change::before {
    z-index: 999;
  }

  .rank {
    background: var(--athens);
    padding: 6px 12px;
    border-radius: 4px;
  }
</style>
