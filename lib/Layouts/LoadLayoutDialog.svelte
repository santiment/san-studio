<script context="module" lang="ts">
  import { dialogs } from 'san-webkit/lib/ui/Dialog'
  import LoadLayoutDialog from './LoadLayoutDialog.svelte'
  export const showLoadLayoutDialog = () => dialogs.showOnce(LoadLayoutDialog)
</script>

<script lang="ts">
  import { onDestroy } from 'svelte'
  import Dialog from 'san-webkit/lib/ui/Dialog'
  import VirtualList from 'san-webkit/lib/ui/VirtualList/index.svelte'
  import { studio } from './../../lib/stores/studio'
  import { globals } from './../../lib/stores/globals'
  import { queryLayouts } from './../../lib/api/layouts'
  import {
    queryCurrentUserLayouts,
    subscribeCurrentUserLayoutsCache,
  } from './../../lib/api/layouts/user'
  import Search from './../../lib/Sidebar/Search.svelte'
  import SelectableLayout from './SelectableLayout.svelte'
  var Tab

  ;(function (Tab) {
    Tab[(Tab['MyLibrary'] = 0)] = 'MyLibrary'
    Tab[(Tab['Explore'] = 1)] = 'Explore'
  })(Tab || (Tab = {}))

  let closeDialog
  let tab = $globals.isLoggedIn ? Tab.MyLibrary : Tab.Explore
  let layouts = []
  let oldSortedLayouts = []
  let searchTerm = ''
  let unsubscribe

  $: ({ slug } = $studio)

  $: getLayouts(tab).then((items) => {
    layouts = items
    oldSortedLayouts = items.slice()
  })

  $: filteredLayouts = searchTerm ? filterLayouts(layouts, searchTerm) : layouts

  function getLayouts(tab) {
    unsubscribe = unsubscribe === null || unsubscribe === void 0 ? void 0 : unsubscribe()
    if (tab === Tab.Explore) return queryLayouts(slug)
    unsubscribe = subscribeCurrentUserLayoutsCache(() => (layouts = oldSortedLayouts))
    return queryCurrentUserLayouts()
  }

  function filterLayouts(layouts, searchTerm) {
    const searchTerms = searchTerm.split(' ')

    const filter = ({ title }) => {
      const lowered = title.toLowerCase()
      return searchTerms.every((word) => lowered.includes(word))
    }

    return layouts.filter(filter)
  }

  function onLayoutSelect(layout) {
    window.onLayoutSelect(layout)
    closeDialog()
  }

  onDestroy(() => {
    unsubscribe === null || unsubscribe === void 0 ? void 0 : unsubscribe()
  })
</script>

<Dialog {...$$props} title="Load Chart Layout" class="dialog-6fOxr9" bind:closeDialog>
  <div class="tabs row">
    <div
      class="tab btn mrg-xl mrg--r active"
      class:active={tab === Tab.MyLibrary}
      on:click={() => (tab = $globals.isLoggedIn ? Tab.MyLibrary : Tab.Explore)}
    >
      My Library
    </div>
    <div class="tab btn" class:active={tab === Tab.Explore} on:click={() => (tab = Tab.Explore)}>
      Explore
    </div>
  </div>

  <div class="search">
    <Search bind:searchTerm autofocus placeholder="Search chart layout..." />
  </div>

  <VirtualList
    hideEmptyResults
    items={filteredLayouts}
    key="id"
    defaultItemHeight={72}
    class="layouts-5tHmY0"
    let:item
  >
    <SelectableLayout
      layout={item}
      {closeDialog}
      onClick={onLayoutSelect}
      isAuthor={tab === Tab.MyLibrary}
    />
  </VirtualList>
</Dialog>

<style>
  :global(.dialog-6fOxr9) {
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

  :global(.layouts-5tHmY0) :global(.list) {
    padding: 12px;
  }
</style>
