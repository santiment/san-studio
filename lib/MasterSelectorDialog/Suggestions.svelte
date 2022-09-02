<svelte:options immutable />

<script context="module">
  import { Preloader } from 'san-webkit/lib/utils/fn'
  import { queryAllProjects } from './../../lib/api/project'
  export const preloadSuggestions = Preloader(queryAllProjects)
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import { getAddressInfrastructure } from 'san-webkit/lib/utils/address'
  import VirtualList from 'san-webkit/lib/ui/VirtualList/index.svelte'
  import Asset from './Suggestion/Asset.svelte'
  import Address from './Suggestion/Address.svelte'
  import { getRecentAssetMap, getRecents, newAddressSuggestion } from './utils'
  let filtered = []
  export let searchTerm = ''
  export { filtered as items }
  export let cursor = 0
  export let blockchain
  export let onSelect
  queryAllProjects().then((projects) => (items = projects.map(mapProject)))
  const recents = getRecents()
  const AssetSlugRecent = getRecentAssetMap(recents)
  const DEFAULT_HEADERS = recents.length
    ? {
        0: 'Recents',
        [recents.length]: 'Assets',
      }
    : {
        0: 'Assets',
      }
  let node
  let items = []
  let renderHeight
  let headers = DEFAULT_HEADERS

  $: filtered = filter(searchTerm, items, blockchain)

  $: cursor, tick().then(scrollToCursor)

  function mapProject(project) {
    const { slug, priceUsd } = project
    project.key = slug
    if (AssetSlugRecent[slug]) AssetSlugRecent[slug].priceUsd = priceUsd
    return project
  }

  function filter(searchTerm, items, blockchain) {
    if (!searchTerm) {
      headers = DEFAULT_HEADERS
      return recents.concat(blockchain ? items.filter(filterBlockchain) : items)
    }

    if (getAddressInfrastructure(searchTerm)) {
      headers = {
        0: 'Address',
      }
      return [newAddressSuggestion(searchTerm)]
    }

    let match
    const filtered = items.filter((item) => {
      if (!filterBlockchain(item)) return false
      const name = item.name.toLowerCase()
      const ticker = item.ticker.toLowerCase()

      if (!match && (name === searchTerm || ticker === searchTerm)) {
        match = item
      }

      return name.includes(searchTerm) || ticker.includes(searchTerm)
    })

    if (match) {
      const index = filtered.indexOf(match)
      filtered.splice(index, 1)
      filtered.splice(0, 0, match)
    }

    headers = {
      0: 'Assets',
    }
    return filtered
  }

  function filterBlockchain(item) {
    return blockchain ? blockchain.infrastructure === item.infrastructure : true
  }

  function scrollToCursor() {
    node === null || node === void 0 ? void 0 : node.scroll(0, renderHeight * cursor)
  }
</script>

<VirtualList
  hideEmptyResults
  class="suggestions-i_98iz {!filtered.length ? 'hide' : ''}"
  items={filtered}
  key="key"
  defaultItemHeight={48}
  maxHeight={381}
  bind:viewportNode={node}
  bind:renderHeight
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

<style lang="scss">
  :global(.suggestions-i_98iz) {
    border-top: 1px solid var(--porcelain);
  }

  :global(.suggestions-i_98iz) :global(.list) {
    padding: 16px 24px;
  }
</style>
