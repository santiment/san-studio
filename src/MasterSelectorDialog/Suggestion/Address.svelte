<script context="module" lang="ts">
  import { Infrastructure } from 'webkit/utils/address'

  const InfrastructureAsset = {
    [Infrastructure.ETH]: 'ethereum',
    [Infrastructure.BTC]: 'bitcoin',
    [Infrastructure.BCH]: 'bitcoin-cash',
    [Infrastructure.XRP]: 'ripple',
    [Infrastructure.LTC]: 'litecoin',
  }

  const CHAR_WIDTH = 8.5
</script>

<script>
  import { tick } from 'svelte'
  import Svg from 'webkit/ui/Svg/svelte'
  import ProjectIcon from 'webkit/ui/ProjectIcon.svelte'
  import { queryAddressLabels } from '@/api/address'
  import Suggestion from './Suggestion.svelte'

  export let item
  export let cursored = false

  let node
  let labels = []
  let maxItems = 0

  $: ({ address, infrastructure } = item)
  $: shortAddress = address
  $: infrastructureAsset = InfrastructureAsset[infrastructure]
  $: queryAddressLabels(address, infrastructure).then(setLabels)

  function setLabels(data) {
    let size = 0
    let index = 0
    data.some(({ name }) => {
      size += name.length
      if (size > 39) return true
      index++
    })
    labels = data
    maxItems = index

    tick().then(setShortAddress)
  }

  function setShortAddress() {
    shortAddress = getShortAddress(address, node.clientWidth)
  }

  function getShortAddress(address, width) {
    const chars = Math.floor(width / CHAR_WIDTH) - 1

    if (chars >= address.length - 5) return address

    const start = address.slice(0, 4)
    const end = address.slice(4 - chars)
    return start + '...' + end
  }
</script>

<Suggestion {cursored} on:click>
  <div class="icon relative row hv-center mrg-s mrg--r">
    <Svg id="report" w="16" />
    <ProjectIcon slug={infrastructureAsset} size={16} class="$style.project" />
  </div>

  <span bind:this={node} class="mrg-a mrg--r">{shortAddress}</span>

  {#each labels.slice(0, maxItems) as { name }}
    <div class="label caption c-black mrg-s mrg--l">{name}</div>
  {/each}
  {#if labels.length > maxItems}
    <div class="label caption c-black mrg-s mrg--l">+{labels.length - maxItems}</div>
  {/if}
</Suggestion>

<style>
  .icon {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 50%;
    background: var(--casper);
    fill: var(--white);
  }

  .project {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  span {
    min-width: 90px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .label {
    padding: 3px 8px;
    background: var(--mystic);
    border-radius: 4px;
  }
</style>
