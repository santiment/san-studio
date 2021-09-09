<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import LoadLayoutDialog from './LoadLayoutDialog.svelte'

  export const showLoadLayoutDialog = (): Promise<unknown> =>
    dialogs.show(LoadLayoutDialog)
</script>

<script lang="ts">
  import type { Layout } from '@/api/layouts'
  import { onDestroy } from 'svelte'
  import Dialog from 'webkit/ui/Dialog'
  import { studio } from '@/stores/studio'
  import { globals } from '@/stores/globals'
  import { queryLayouts } from '@/api/layouts'
  import {
    queryCurrentUserLayouts,
    subscribeCurrentUserLayoutsCache,
  } from '@/api/layouts/user'
  import Search from '@/Sidebar/Search.svelte'
  import SelectableLayout from './SelectableLayout.svelte'

  enum Tab {
    MyLibrary,
    Explore,
  }

  let closeDialog
  let tab = $globals.isLoggedIn ? Tab.MyLibrary : Tab.Explore
  let layouts = [] as Layout[]
  let oldSortedLayouts = [] as Layout[]
  let searchTerm = ''
  let unsubscribe

  $: ({ slug } = $studio)
  $: getLayouts(tab).then((items: any) => {
    layouts = items
    oldSortedLayouts = items.slice()
  })
  $: filteredLayouts = searchTerm ? filterLayouts(layouts, searchTerm) : layouts

  function getLayouts(tab: Tab) {
    unsubscribe = unsubscribe?.()

    if (tab === Tab.Explore) return queryLayouts(slug)

    unsubscribe = subscribeCurrentUserLayoutsCache(
      () => (layouts = oldSortedLayouts),
    )
    return queryCurrentUserLayouts()
  }

  function filterLayouts(layouts: any[], searchTerm: string) {
    const searchTerms = searchTerm.split(' ')
    const filter = ({ title }) => {
      const lowered = title.toLowerCase()
      return searchTerms.every((word) => lowered.includes(word))
    }

    return layouts.filter(filter)
  }

  function onLayoutSelect(layout: Layout) {
    window.onLayoutSelect(layout)
    closeDialog()
  }

  onDestroy(() => {
    unsubscribe?.()
  })
</script>

<Dialog
  {...$$props}
  title="Load Chart Layout"
  class="$style.dialog"
  bind:closeDialog>
  <div class="tabs row">
    <div
      class="tab btn mrg-xl mrg--r active"
      class:active={tab === Tab.MyLibrary}
      on:click={() =>
        (tab = $globals.isLoggedIn ? Tab.MyLibrary : Tab.Explore)}>
      My Library
    </div>
    <div
      class="tab btn"
      class:active={tab === Tab.Explore}
      on:click={() => (tab = Tab.Explore)}>
      Explore
    </div>
  </div>

  <div class="search">
    <Search bind:searchTerm class="" placeholder="Search chart layout..." />
  </div>

  <div class="dialog-body layouts">
    {#each filteredLayouts as layout (layout.id)}
      <SelectableLayout
        {layout}
        {closeDialog}
        onClick={onLayoutSelect}
        isAuthor={tab === Tab.MyLibrary} />
    {/each}
  </div>
</Dialog>

<style>
  .dialog {
    width: 600px;
    height: 480px;
  }

  .tabs {
    padding: 20px 20px 0;
  }

  .tab {
    --color: var(--casper);
    --color-hover: var(--green);
    padding: 0 0 8px;
    border-radius: 0;
    border-bottom: 2px solid transparent;
  }
  .active {
    color: var(--green);
    border-color: var(--green);
  }

  .search {
    padding: 8px 20px;
    background: var(--athens);
  }
  .tabs,
  .search {
    border-bottom: 1px solid var(--porcelain);
  }

  .layouts {
    padding: 12px;
    margin: 0;
  }
</style>
