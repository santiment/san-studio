<svelte:options immutable />

<script context="module">
  import { Preloader } from 'san-webkit/lib/utils/fn'
  import { queryAllProjects } from './../api/project'

  export const preloadSuggestions = Preloader(queryAllProjects)
</script>

<script>import { tick } from 'svelte';
import { getAddressInfrastructure } from 'san-webkit/lib/utils/address';
import VirtualList, { Controller } from 'san-webkit/lib/ui/VirtualList/index.svelte';
import Asset from './Suggestion/Asset.svelte';
import Address from './Suggestion/Address.svelte';
import { getRecentAssetMap, getRecents, newAddressSuggestion } from './utils';
let filtered = [];
export let searchTerm = '';
export { filtered as items };
export let cursor = 0;
export let blockchain;
export let onSelect;
queryAllProjects().then((projects) => (items = projects.map(mapProject)));
const recents = getRecents();
const AssetSlugRecent = getRecentAssetMap(recents);
const DEFAULT_HEADERS = recents.length
    ? { 0: 'Recents', [recents.length]: 'Assets' }
    : { 0: 'Assets' };
const ListController = Controller();
let items = [];
let headers = DEFAULT_HEADERS;
$: filtered = filter(searchTerm, items, blockchain);
$: cursor, tick().then(scrollToCursor);
function mapProject(project) {
    const { slug, priceUsd } = project;
    project.key = slug;
    if (AssetSlugRecent[slug])
        AssetSlugRecent[slug].priceUsd = priceUsd;
    return project;
}
function filter(searchTerm, items, blockchain) {
    if (!searchTerm) {
        headers = DEFAULT_HEADERS;
        return recents.concat(blockchain ? items.filter(filterBlockchain) : items);
    }
    if (getAddressInfrastructure(searchTerm)) {
        headers = { 0: 'Address' };
        return [newAddressSuggestion(searchTerm)];
    }
    let match;
    const filtered = items.filter((item) => {
        if (!filterBlockchain(item))
            return false;
        const name = item.name.toLowerCase();
        const ticker = item.ticker.toLowerCase();
        if (!match && (name === searchTerm || ticker === searchTerm)) {
            match = item;
        }
        return name.includes(searchTerm) || ticker.includes(searchTerm);
    });
    if (match) {
        const index = filtered.indexOf(match);
        filtered.splice(index, 1);
        filtered.splice(0, 0, match);
    }
    headers = { 0: 'Assets' };
    return filtered;
}
function filterBlockchain(item) {
    return blockchain ? blockchain.infrastructure === item.infrastructure : true;
}
function scrollToCursor() {
    var _a;
    (_a = ListController.scrollTo) === null || _a === void 0 ? void 0 : _a.call(ListController, cursor);
}
</script>

<section>
  <VirtualList
    class="suggestions-3xSt2I {!filtered.length ? 'hide' : ''}"
    items={filtered}
    itemHeight={56}
    maxFluidHeight={381}
    let:item
    let:i
  >
    {@const cursored = i === cursor}
    {@const header = headers[i]}
    {@const onClick = () => onSelect(item)}

    {#if header}
      <div class="caption txt-m c-waterloo mrg-m" class:mrg--t={i > 0}>{header}</div>
    {/if}

    {#if item.slug}
      <Asset {item} {cursored} on:click={onClick} />
    {:else if item.address}
      <Address {item} {cursored} on:click={onClick} />
    {/if}
  </VirtualList>
</section>

<style >/**
@include dac(desktop, tablet, phone) {
  main {
    background: red;
  }
}
*/
/**
@include dacnot(desktop) {
  main {
    background: red;
  }
}
*/
:global(.suggestions-3xSt2I) {
  border-top: 1px solid var(--porcelain);
}

:global(.suggestions-3xSt2I) :global(.list) {
  padding: 16px 24px;
}

section :global(virtual-list-items) {
  padding: 16px 24px;
}</style>
