<script lang="ts">
  import type { ProjectPriceChange } from '@/api/project'
  import Svg from 'webkit/ui/Svg.svelte'
  import { studio } from '@/stores/studio'
  import { queryProject, queryProjectPriceChange } from '@/api/project'
  import { usdFormatter } from '@/metrics/formatters'

  let price = ''
  let change = 0

  $: ({ slug, ticker, name = slug } = $studio)
  // @ts-ignore
  $: error = (slug, false)
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
    <div class="img row hv-center mrg-l mrg--r" class:error>
      {#if error}
        <Svg id="asset-small" w="12" class="$style.placeholder" />
      {:else}
        <img
          alt="Project"
          on:error={() => (error = true)}
          src="https://production-sanbase-images.s3.amazonaws.com/uploads/logo64_{slug}.png" />
      {/if}
    </div>
    {name} ({ticker})
    <Svg id="arrow" w="8" h="4.5" class="mrg-s mrg--l $style.arrow" />
  </div>

  <div class="row v-center">
    <span class="price"> Price </span>
    <span class="body-1 mrg-s mrg--l mrg--r">{price}</span>

    <div
      class="change txt-m row v-center expl-tooltip"
      class:up={change >= 0}
      title="24h change">
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

  .img {
    border-radius: 50%;
  }
  .error {
    background: var(--porcelain);
  }
  :global(.night-mode) .error {
    background: var(--mystic);
  }

  .img,
  img {
    width: 40px;
    height: 40px;
    min-width: 40px;
  }

  .placeholder {
    fill: var(--casper);
  }
  :global(.night-mode) .placeholder {
    fill: var(--waterloo);
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
