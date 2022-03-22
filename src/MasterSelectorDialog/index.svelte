<script context="module" lang="ts">
  import { dialogs } from 'webkit/ui/Dialog'
  import MasterSelectorDialog from './index.svelte'

  export const showMasterSelectorDialog = (props?: any): Promise<unknown> =>
    dialogs.show(MasterSelectorDialog, props)
</script>

<script lang="ts">
  import type { DialogController } from 'webkit/ui/Dialog/dialogs'
  import { track } from 'webkit/analytics'
  import Svg from 'webkit/ui/Svg/svelte'
  import Dialog from 'webkit/ui/Dialog'
  import { DialogLock } from 'webkit/ui/Dialog/dialogs'
  import { Event } from '@/analytics'
  import Suggestions from './Suggestions.svelte'

  export let DialogPromise: DialogController
</script>

<Dialog {...$$props} noTitle class="$style.dialog">
  <div class="search row v-center nowrap">
    <Svg id="search" w="16" class="$style.icon" />
    <input class="fluid body-2" type="text" placeholder="Search for asset name..." />

    <button class="btn-2 btn--s mrg-l mrg--r row v-center"
      >All blockchains
      <Svg id="arrow" w="8" h="5" class="$style.arrow mrg-s mrg--l" />
    </button>
  </div>

  <Suggestions />

  <div class="tip row v-center caption c-waterloo">PROTIP:</div>
</Dialog>

<style lang="scss">
  .dialog {
    width: 480px;
    border-radius: 10px !important;
    overflow: hidden;
  }

  .tip {
    padding: 12px 16px;
    background: var(--athens);
    border-top: 1px solid var(--porcelain);
  }

  .search {
    fill: var(--waterloo);
    &:focus-within {
      fill: var(--green);
    }
  }

  input {
    padding: 16px 16px 16px 48px;
  }

  .icon {
    position: absolute;
    top: 20px;
    left: 20px;
    pointer-events: none;
  }

  .arrow {
    transform: rotate(180deg);
  }
</style>
