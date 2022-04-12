<svelte:options immutable />

<script context="module">
  import { Preloader } from 'webkit/utils/fn'
  import { queryAllProjects } from '@/api/project'

  export const preloadSuggestions = Preloader(queryAllProjects)
</script>

<script lang="ts">
  import { tick } from 'svelte'
  import VirtualList from 'webkit/ui/VirtualList/index.svelte'
  import Asset from './Suggestion/Asset.svelte'
  import Address from './Suggestion/Address.svelte'

  let filtered = [] as any[]
  export let searchTerm = ''
  export { filtered as items }
  export let cursor = 0
  export let blockchain
  export let onSelect

  queryAllProjects().then((projects) => (items = projects))

  let node
  let items = [] as any[]
  let renderHeight

  $: filtered = filter(searchTerm, items, blockchain)
  $: cursor, tick().then(scrollToCursor)

  function filter(
    searchTerm: string,
    items: any[],
    blockchain?: { infrastructure: string },
  ): any[] {
    if (!searchTerm) {
      return blockchain ? items.filter(filterBlockchain) : items
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

    return filtered
  }

  function filterBlockchain(item) {
    return blockchain ? blockchain.infrastructure === item.infrastructure : true
  }

  function scrollToCursor() {
    node?.scroll(0, renderHeight * cursor)
  }
</script>

<VirtualList
  hideEmptyResults
  class="$style.suggestions {!filtered.length ? 'hide' : ''}"
  items={filtered}
  key="slug"
  defaultItemHeight={48}
  maxHeight={381}
  bind:viewportNode={node}
  bind:renderHeight
  let:item
  let:i
>
  {#if i === 0}
    <div class="caption txt-m c-waterloo">All</div>
  {/if}

  <Asset {item} cursored={i === cursor} on:click={() => onSelect(item)} />
</VirtualList>

<style lang="scss">
  .suggestions {
    border-top: 1px solid var(--porcelain);
  }
  .suggestions :global(.list) {
    padding: 16px 24px;
  }
</style>
