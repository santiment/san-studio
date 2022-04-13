<script context="module" lang="ts">
  const CHAR_WIDTH = 8.5
</script>

<script>
  import { tick } from 'svelte'
  import AddressIcon from '@/MasterAsset/AddressIcon.svelte'
  import { queryAddressLabels } from '@/api/address'
  import Suggestion from './Suggestion.svelte'

  export let item
  export let cursored = false

  let node
  let labels = []
  let maxItems = 0

  $: ({ address, infrastructure } = item)
  $: shortAddress = address
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
  <AddressIcon {address} />

  <span bind:this={node} class="mrg-a mrg--r">{shortAddress}</span>

  {#each labels.slice(0, maxItems) as { name }}
    <div class="label caption c-black mrg-s mrg--l">{name}</div>
  {/each}
  {#if labels.length > maxItems}
    <div class="label caption c-black mrg-s mrg--l">+{labels.length - maxItems}</div>
  {/if}
</Suggestion>

<style>
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
