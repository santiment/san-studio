<script>
  import Svg from 'webkit/ui/Svg/svelte'
  import ProjectIcon from 'webkit/ui/ProjectIcon.svelte'
  import Suggestion from './Suggestion.svelte'
  import { onMount } from 'svelte'

  const LABELS = [
    'Smart contract',
    'Ethereum',
    'ERC20',
    'Ethereum',
    'Ethereum',
    'Ethereum',
    'Ethereum',
    'Ethereum',
  ]

  export let item
  export let cursored = false

  let node

  $: ({ address = '0x00000000219ab540356cBB839Cbe05303d7705Fa', labels = LABELS } = item)
  $: shortAddress = address

  const CHAR_WIDTH = 8.5
  function getAddressShorthand(address, width) {
    const chars = Math.floor(width / CHAR_WIDTH) - 1

    if (chars >= address.length - 5) return address

    const start = address.slice(0, 4)
    const end = address.slice(4 - chars)
    return start + '...' + end
  }

  onMount(() => {
    shortAddress = getAddressShorthand(address, node.clientWidth)
  })
</script>

<Suggestion {cursored} on:click>
  <div class="icon relative row hv-center mrg-s mrg--r">
    <Svg id="report" w="16" />
    <ProjectIcon slug="bitcoin" size={16} class="$style.project" />
  </div>

  <span bind:this={node}>{shortAddress}</span>

  <div class="row mrg-a mrg--l">
    {#each labels.slice(0, 3) as label}
      <div class="label caption c-black mrg-s mrg--l">{label}</div>
    {/each}
    {#if labels.length > 3}
      <div class="label caption c-black mrg-s mrg--l">+{labels.length - 3}</div>
    {/if}
  </div>
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
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .label {
    padding: 3px 8px;
    background: var(--porcelain);
    border-radius: 4px;
  }
</style>
