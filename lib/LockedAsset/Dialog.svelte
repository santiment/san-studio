<script context="module">import { dialogs } from 'san-webkit/lib/ui/Dialog';
import LockedAssetDialog from './Dialog.svelte';
export const showLockedAssetDialog = (props) => dialogs.showOnce(LockedAssetDialog, props);
</script>

<script>import { queryFiatAssets } from 'san-webkit/lib/api/projects';
import Dialog from 'san-webkit/lib/ui/Dialog';
import ListOfAssets from 'san-webkit/lib/ui/ListOfAssets/index.svelte';
import { TABS } from 'san-webkit/lib/ui/ListOfAssets/Tabs.svelte';
import { FIAT_FUND_ASSETS } from '../api/metrics';
export let onSelect;
export let DialogCtx;
const LIST_OF_ASSETS = [
    ...TABS,
    [
        'Fiat',
        () => queryFiatAssets().then((data) => {
            return data.concat(FIAT_FUND_ASSETS);
        }),
    ],
];
</script>

<Dialog {...$$props} title="Select asset" class="dialog-0_iv1J">
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
  :global(.dialog-0_iv1J) {
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
