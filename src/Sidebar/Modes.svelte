<script lang="ts">
  import { onDestroy } from 'svelte'
  import { newGlobalShortcut } from 'webkit/utils/events'
  import { dialogs } from 'webkit/ui/Dialog'
  import Svg from 'webkit/ui/Svg.svelte'
  import ShortcutsDialog, {
    showShortcutsDialog,
  } from '@/Shortcuts/Dialog.svelte'

  function openShortcutsDialog() {
    if (dialogs.has(ShortcutsDialog)) return
    showShortcutsDialog()
  }

  const onHelpClick = () => window.Intercom?.('show')

  onDestroy(newGlobalShortcut('SHIFT+?', openShortcutsDialog))
</script>

<div class="nav row">
  <div class="btn active">Metrics</div>
  <div class="btn">Layouts</div>
  <!-- <div class="btn">Dashboards</div> -->

  <div
    title="Shortcuts | Shift + ?"
    class="shortcuts btn mrg-a mrg--t row hv-center expl-tooltip"
    on:click={showShortcutsDialog}>
    <Svg id="cmd-key" w="16" />
  </div>
  <div class="help btn row v-center" on:click={onHelpClick}>
    Help & Feedback
    <Svg id="chat" w="14" h="16" class="$style.chat mrg-s mrg--t" />
  </div>
</div>

<style>
  .nav {
    --color: var(--waterloo);
    --color-hover: var(--green) !important;
    writing-mode: vertical-lr;
    border-right: 1px solid var(--porcelain);
    position: sticky;
    top: 0;
    height: 100vh;
    z-index: 1;
  }
  .btn {
    padding: 16px 5px;
    border-top: 1px solid var(--porcelain);
    border-radius: 0;
    transform: rotate(180deg);
  }
  .active {
    --color: var(--green);
    --bg: var(--green-light-1);
  }

  .shortcuts {
    border-bottom: 1px solid var(--porcelain);
    height: 32px;
    width: 32px;
    padding: 0;
    transform: none;
    position: relative;
    --expl-position: 28px;
  }

  .expl-tooltip::before {
    writing-mode: initial;
    left: 36px;
  }

  .help {
    --fill: var(--casper);
    padding: 12px 5px;
  }
  .chat {
    transform: rotate(90deg);
  }
</style>
