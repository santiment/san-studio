<script lang="ts">
  import type { ProjectPriceChange } from '@/api/project'
  import Svg from 'webkit/ui/Svg/svelte'
  import ProjectIcon from 'webkit/ui/ProjectIcon.svelte'
  import { studio } from '@/stores/studio'
  import { queryProject, queryProjectPriceChange } from '@/api/project'
  import { usdFormatter } from '@/metrics/formatters'

  let price = ''
  let change = 0

  $: ({ slug, ticker, name = slug } = $studio)
  $: queryProject(slug).then(setProject)
  $: queryProjectPriceChange(slug).then(setPriceChange)

  function setProject(project: any) {
    studio.setProject(project)
  }
  function setPriceChange({ priceUsd, percentChange24h }: ProjectPriceChange) {
    price = usdFormatter(priceUsd)
    change = +(+percentChange24h).toFixed(2)
  }
</script>

<div class="row v-center">
  <div class="project body-1 btn row v-center">
    <ProjectIcon {slug} size={40} class="mrg-l mrg--r" />

    {name} ({ticker})
    <Svg id="arrow" w="8" h="4.5" class="mrg-s mrg--l $style.arrow" />
  </div>

  <div class="row v-center">
    <span class="price"> Price </span>
    <span class="body-1 mrg-s mrg--l mrg--r">{price}</span>

    <div
      class="change txt-m row v-center expl-tooltip"
      class:up={change >= 0}
      aria-label="24h change">
      <span class="direction row hv-center mrg-xs mrg--r">
        <Svg id="triangle" w="6" h="4" />
      </span>
      {change}%
    </div>
  </div>
  <div class="project-actions mrg-a mrg--l row v-center" />
</div>

<style>
  .project {
    margin-right: 80px;
    --fill: var(--waterloo);
    --color-hover: var(--green);
  }

  .price {
    color: var(--waterloo);
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
</style>
