<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import LockedAssetDialog from './Dialog.svelte'

  export const showLockedAssetDialog = (props) => dialogs.showOnce(LockedAssetDialog, props)
</script>

<script lang="ts">
  import { queryFiatAssets } from 'webkit/api/projects'
  import Dialog from 'webkit/ui/Dialog'
  import ListOfAssets from 'webkit/ui/ListOfAssets/index.svelte'
  import { TABS } from 'webkit/ui/ListOfAssets/Tabs.svelte'
  import { FIAT_FUND_ASSETS, FIAT_MONEY_SUPPLY_ASSETS } from '../api/metrics'

  export let onSelect
  export let DialogCtx

  const LIST_OF_ASSETS = [
    ...TABS,
    [
      'Fiat',
      () =>
        queryFiatAssets().then((data) => {
          return data.concat(FIAT_MONEY_SUPPLY_ASSETS).concat(FIAT_FUND_ASSETS)
        }),
    ],
  ]
</script>

<Dialog {...$$props} title="Select asset" class="$style.dialog">
  <main>
    <ListOfAssets
      tabs={LIST_OF_ASSETS}
      onSelect={(asset) => {
        onSelect(asset)
        DialogCtx.close()
      }}
      onEscape={DialogCtx.close}
    />
  </main>
</Dialog>

<style>
  .dialog {
    width: 400px;
    height: 455px;
    max-width: 400px !important;
    max-height: 455px !important;
  }

  .loading {
    height: 100%;
  }

  main {
    padding: 8px 16px;
    flex: 1;
  }
</style>
