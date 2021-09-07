<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import LoadLayoutDialog from './LoadLayoutDialog.svelte'

  export const showLoadLayoutDialog = (): Promise<unknown> =>
    dialogs.show(LoadLayoutDialog)
</script>

<script lang="ts">
  import type { Layout } from '@/api/layouts/user'
  import Dialog from 'webkit/ui/Dialog'
  import { queryUserLayouts } from '@/api/layouts/user'
  import Search from '@/Sidebar/Search.svelte'
  import SelectableLayout from './SelectableLayout.svelte'

  enum Tab {
    MyLibrary,
    Explore,
  }

  let closeDialog
  let tab = Tab.MyLibrary
  let layouts = [] as Layout[]

  queryUserLayouts().then((items) => (layouts = items))

  function onLayoutSelect(layout: Layout) {
    console.log(layout)
  }

  const rerenderLayouts = () => (layouts = layouts.slice())
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
      on:click={() => (tab = Tab.MyLibrary)}>
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
    <Search class="" placeholder="Search chart layout..." />
  </div>

  <div class="dialog-body layouts">
    {#each layouts as layout (layout.id)}
      <SelectableLayout
        {layout}
        {closeDialog}
        {rerenderLayouts}
        onClick={onLayoutSelect} />
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
