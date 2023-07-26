<script>import Svg from 'san-webkit/lib/ui/Svg/svelte';
import Tooltip from 'san-webkit/lib/ui/Tooltip/svelte';
import ProjectIcon from 'san-webkit/lib/ui/ProjectIcon.svelte';
import { queryAvailableBlockchains } from './../api/blockchains';
export let blockchain = undefined;
export let inputNode;
let blockchains = [];
let isOpened = false;
queryAvailableBlockchains().then((data) => (blockchains = data));
function onBlockchainSelect(selected) {
    blockchain = selected;
    isOpened = false;
    inputNode.focus();
}
</script>

<div class="relative mrg-l mrg--r">
  <Tooltip
    bind:isOpened
    on="click"
    offsetY={4}
    align="center"
    class="tooltip-q5hlG_"
    activeClass="active-Vnc+sA">
    <button slot="trigger" class="btn-2 btn--s row v-center justify">
      {#if blockchain}
        <div class="row v-center">
          <ProjectIcon slug={blockchain.slug} size={16} class="mrg-s mrg--r" />
          {blockchain.name}
        </div>
      {:else}
        All blockchains
      {/if}
      <Svg id="arrow" w="8" h="5" class="arrow-8lHcg_ mrg-s mrg--l" />
    </button>

    <svelte:fragment slot="tooltip">
      <div class="btn-ghost" on:click={() => onBlockchainSelect()}>All blockchains</div>

      {#each blockchains as item (item.slug)}
        <div class="btn-ghost row v-center" on:click={() => onBlockchainSelect(item)}>
          <ProjectIcon slug={item.slug} size={24} class="mrg-s mrg--r" />
          {item.name}
        </div>
      {/each}
    </svelte:fragment>
  </Tooltip>
</div>

<style>
  button {
    min-width: 144px;
    fill: var(--waterloo);
  }

  :global(.active-Vnc\+sA) {
    --border: var(--green);
  }

  :global(.arrow-8lHcg_) {
    transform: rotate(180deg);
  }

  :global(.tooltip-q5hlG_) {
    padding: 8px;
    min-width: 100%;
  }
</style>
